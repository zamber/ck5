import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import {upcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';
import {isMedia} from '../media/utils';
import {
    captionElementCreator,
    getCaptionFromMedia,
    matchMediaCaption
} from './utils';

export default class MediaCaptionEditing extends Plugin {
    init() {
        const editor = this.editor;
        const view = editor.editing.view;
        const schema = editor.model.schema;
        const data = editor.data;
        const editing = editor.editing;
        const t = editor.t;

        // Schema configuration.
        schema.register('caption', {
            allowIn: 'media',
            allowContentOf: '$block',
            isLimit: true
        });

        // Add caption element to each media inserted without it.
        editor.model.document.registerPostFixer(writer => this._insertMissingModelCaptionElement(writer));

        // View to model converter for the data pipeline.
        editor.conversion.for('upcast').add(upcastElementToElement({
            view: matchMediaCaption,
            model: 'caption'
        }));

        // Model to view converter for the data pipeline.
        const createCaptionForData = writer => writer.createContainerElement('figcaption');
        data.downcastDispatcher.on('insert:caption', captionModelToView(createCaptionForData, false));

        // Model to view converter for the editing pipeline.
        const createCaptionForEditing = captionElementCreator(view, t('Enter media caption'));
        editing.downcastDispatcher.on('insert:caption', captionModelToView(createCaptionForEditing));

        // Always show caption in view when something is inserted in model.
        editing.downcastDispatcher.on(
            'insert',
            this._fixCaptionVisibility(data => data.item),
            {priority: 'high'}
        );

        // Hide caption when everything is removed from it.
        editing.downcastDispatcher.on('remove', this._fixCaptionVisibility(data => data.position.parent), {priority: 'high'});

        // Update caption visibility on view in post fixer.
        view.document.registerPostFixer(writer => this._updateCaptionVisibility(writer));
    }

    _updateCaptionVisibility(viewWriter) {
        const mapper = this.editor.editing.mapper;
        const lastCaption = this._lastSelectedCaption;
        let viewCaption;

        // If whole media is selected.
        const modelSelection = this.editor.model.document.selection;
        const selectedElement = modelSelection.getSelectedElement();

        if (selectedElement && selectedElement.is('media')) {
            const modelCaption = getCaptionFromMedia(selectedElement);
            viewCaption = mapper.toViewElement(modelCaption);
        }

        // If selection is placed inside caption.
        const position = modelSelection.getFirstPosition();
        const modelCaption = getParentCaption(position.parent);

        if (modelCaption) {
            viewCaption = mapper.toViewElement(modelCaption);
        }

        // Is currently any caption selected?
        if (viewCaption) {
            // Was any caption selected before?
            if (lastCaption) {
                // Same caption as before?
                if (lastCaption === viewCaption) {
                    return showCaption(viewCaption, viewWriter);
                } else {
                    hideCaptionIfEmpty(lastCaption, viewWriter);
                    this._lastSelectedCaption = viewCaption;

                    return showCaption(viewCaption, viewWriter);
                }
            } else {
                this._lastSelectedCaption = viewCaption;
                return showCaption(viewCaption, viewWriter);
            }
        } else {
            // Was any caption selected before?
            if (lastCaption) {
                const viewModified = hideCaptionIfEmpty(lastCaption, viewWriter);
                this._lastSelectedCaption = null;

                return viewModified;
            } else {
                return false;
            }
        }
    }

    _fixCaptionVisibility(nodeFinder) {
        return (evt, data, conversionApi) => {
            const node = nodeFinder(data);
            const modelCaption = getParentCaption(node);
            const mapper = this.editor.editing.mapper;
            const viewWriter = conversionApi.writer;

            if (modelCaption) {
                const viewCaption = mapper.toViewElement(modelCaption);

                if (viewCaption) {
                    if (modelCaption.childCount) {
                        viewWriter.removeClass('ck-hidden', viewCaption);
                    } else {
                        viewWriter.addClass('ck-hidden', viewCaption);
                    }
                }
            }
        };
    }

    _insertMissingModelCaptionElement(writer) {
        const model = this.editor.model;
        const changes = model.document.differ.getChanges();

        for (const entry of changes) {
            if (entry.type === 'insert' && entry.name === 'media') {
                const item = entry.position.nodeAfter;

                if (!getCaptionFromMedia(item)) {
                    writer.appendElement('caption', item);

                    return true;
                }
            }
        }

        return false;
    }
}

function captionModelToView(elementCreator, hide = true) {
    return (evt, data, conversionApi) => {
        const captionElement = data.item;

        // Return if element shouldn't be present when empty.
        if (!captionElement.childCount && !hide) {
            return;
        }

        if (isMedia(captionElement.parent)) {
            if (!conversionApi.consumable.consume(data.item, 'insert')) {
                return;
            }

            const viewMedia = conversionApi.mapper.toViewElement(data.range.start.parent);
            const viewCaption = elementCreator(conversionApi.writer);
            const viewWriter = conversionApi.writer;

            // Hide if empty.
            if (!captionElement.childCount) {
                viewWriter.addClass('ck-hidden', viewCaption);
            }

            insertViewCaptionAndBind(viewCaption, data.item, viewMedia, conversionApi);
        }
    };
}

function insertViewCaptionAndBind(viewCaption, modelCaption, viewMedia, conversionApi) {
    const viewPosition = ViewPosition.createAt(viewMedia, 'end');

    conversionApi.writer.insert(viewPosition, viewCaption);
    conversionApi.mapper.bindElements(modelCaption, viewCaption);
}

function getParentCaption(node) {
    const ancestors = node.getAncestors({includeSelf: true});
    const caption = ancestors.find(ancestor => ancestor.name === 'caption');

    if (caption && caption.parent && caption.parent.name === 'media') {
        return caption;
    }

    return null;
}

function hideCaptionIfEmpty(caption, viewWriter) {
    if (!caption.childCount && !caption.hasClass('ck-hidden')) {
        viewWriter.addClass('ck-hidden', caption);
        return true;
    }

    return false;
}

function showCaption(caption, viewWriter) {
    if (caption.hasClass('ck-hidden')) {
        viewWriter.removeClass('ck-hidden', caption);
        return true;
    }

    return false;
}
