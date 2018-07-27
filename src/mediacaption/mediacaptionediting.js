/**
 * @module media/mediacaption/mediacaptionediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import {captionElementCreator, getCaptionFromMedia, matchMediaCaption} from './utils';
import {isMedia} from '../media/utils';
import {upcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

/**
 * Media Caption Editing Plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaCaptionEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const editing = editor.editing;
        const view = editing.view;
        const schema = editor.model.schema;
        const data = editor.data;
        const t = editor.t;

        schema.register('caption', {
            allowContentOf: '$block',
            allowIn: 'media',
            isLimit: true
        });

        editor.model.document.registerPostFixer(writer => this._insertMissingCaption(writer));
        editor.conversion.for('upcast').add(upcastElementToElement({
            model: 'caption',
            view: matchMediaCaption
        }));

        const createCaptionForData = writer => writer.createContainerElement('figcaption');
        data.downcastDispatcher.on('insert:caption', captionModelToView(createCaptionForData, false));

        const createCaptionForEditing = captionElementCreator(view, t('Enter media caption'));
        editing.downcastDispatcher.on('insert:caption', captionModelToView(createCaptionForEditing));
        editing.downcastDispatcher.on('insert', this._fixCaptionVisibility(data => data.item), {priority: 'high'});
        editing.downcastDispatcher.on('remove', this._fixCaptionVisibility(data => data.position.parent), {priority: 'high'});
        view.document.registerPostFixer(writer => this._updateCaptionVisibility(writer));
    }

    /**
     * Updates the view before each rendering, making sure that empty captions are hidden and then visible when the
     * media is selected.
     *
     * @private
     *
     * @param {module:engine/view/writer~Writer} viewWriter
     *
     * @returns {Boolean}
     */
    _updateCaptionVisibility(viewWriter) {
        const mapper = this.editor.editing.mapper;
        const lastCaption = this._lastSelectedCaption;
        let viewCaption;
        const modelSelection = this.editor.model.document.selection;
        const selectedElement = modelSelection.getSelectedElement();

        if (selectedElement && selectedElement.is('media')) {
            const modelCaption = getCaptionFromMedia(selectedElement);
            viewCaption = mapper.toViewElement(modelCaption);
        }

        const position = modelSelection.getFirstPosition();
        const modelCaption = getParentCaption(position.parent);

        if (modelCaption) {
            viewCaption = mapper.toViewElement(modelCaption);
        }

        if (viewCaption && lastCaption && lastCaption === viewCaption) {
            return showCaption(viewCaption, viewWriter);
        }

        if (viewCaption && lastCaption) {
            hideCaptionIfEmpty(lastCaption, viewWriter);
            this._lastSelectedCaption = viewCaption;

            return showCaption(viewCaption, viewWriter);
        }

        if (viewCaption) {
            this._lastSelectedCaption = viewCaption;
            return showCaption(viewCaption, viewWriter);
        }

        if (lastCaption) {
            const viewModified = hideCaptionIfEmpty(lastCaption, viewWriter);
            this._lastSelectedCaption = null;

            return viewModified;
        }

        return false;
    }

    /**
     * Returns a converter that fixes caption visibility during the model-to-view conversion.
     * Checks if the changed node is placed inside the caption element and fixes its visibility in the view.
     *
     * @private
     *
     * @param {Function} nodeFinder
     *
     * @returns {Function}
     */
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

    /**
     * Checks whether the data inserted to the model document has a media element that has no caption element inside it.
     * If there is none, it adds it to the media element.
     *
     * @private
     *
     * @param {module:engine/model/writer~Writer} writer
     *
     * @returns {Boolean}
     */
    _insertMissingCaption(writer) {
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

/**
 * Creates a converter that converts media caption model element to view element.
 *
 * @private
 *
 * @param {Function} elementCreator
 * @param {Boolean} hide
 *
 * @returns {Function}
 */
function captionModelToView(elementCreator, hide = true) {
    return (evt, data, conversionApi) => {
        const captionElement = data.item;

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

            if (!captionElement.childCount) {
                viewWriter.addClass('ck-hidden', viewCaption);
            }

            insertViewCaptionAndBind(viewCaption, data.item, viewMedia, conversionApi);
        }
    };
}

/**
 * Inserts `viewCaption` at the end of `viewMedia` and binds it to `modelCaption`.
 *
 * @private
 *
 * @param {module:engine/view/containerelement~ContainerElement} viewCaption
 * @param {module:engine/model/element~Element} modelCaption
 * @param {module:engine/view/containerelement~ContainerElement} viewMedia
 * @param {Object} conversionApi
 */
function insertViewCaptionAndBind(viewCaption, modelCaption, viewMedia, conversionApi) {
    const viewPosition = ViewPosition.createAt(viewMedia, 'end');

    conversionApi.writer.insert(viewPosition, viewCaption);
    conversionApi.mapper.bindElements(modelCaption, viewCaption);
}

/**
 * Checks if the provided node or one of its ancestors is a caption element, and returns it.
 *
 * @private
 *
 * @param {module:engine/model/node~Node} node
 *
 * @returns {module:engine/model/element~Element|null}
 */
function getParentCaption(node) {
    const ancestors = node.getAncestors({includeSelf: true});
    const caption = ancestors.find(ancestor => ancestor.name === 'caption');

    if (caption && caption.parent && caption.parent.name === 'media') {
        return caption;
    }

    return null;
}

/**
 * Hides a given caption in the view if it is empty.
 *
 * @private
 *
 * @param {module:engine/view/containerelement~ContainerElement} caption
 * @param {module:engine/view/writer~Writer} viewWriter
 *
 * @returns {Boolean}
 */
function hideCaptionIfEmpty(caption, viewWriter) {
    if (!caption.childCount && !caption.hasClass('ck-hidden')) {
        viewWriter.addClass('ck-hidden', caption);
        return true;
    }

    return false;
}

/**
 * Shows the caption.
 *
 * @param {module:engine/view/containerelement~ContainerElement} caption
 * @param {module:engine/view/writer~Writer} viewWriter
 *
 * @returns {Boolean}
 */
function showCaption(caption, viewWriter) {
    if (caption.hasClass('ck-hidden')) {
        viewWriter.removeClass('ck-hidden', caption);
        return true;
    }

    return false;
}
