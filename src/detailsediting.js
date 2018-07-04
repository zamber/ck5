import DetailsCommand from './detailscommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {downcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {toWidget, toWidgetEditable} from '@ckeditor/ckeditor5-widget/src/utils';
import {upcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

/**
 * Details Editing Plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class DetailsEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const conversion = editor.conversion;
        const detailsCfg = {model: 'details', view: 'details'};
        const summaryCfg = {model: 'detailsSummary', view: 'summary'};
        const contentCfg = {
            model: 'detailsContent',
            view: {
                name: 'div',
                attributes: {
                    class: 'content'
                }
            }
        };

        editor.commands.add('details', new DetailsCommand(editor));
        schema.register('details', {
            allowIn: '$root',
            allowWhere: '$block',
            isBlock: true,
            isLimit: true,
            isObject: true
        });
        conversion.for('upcast').add(upcastElementToElement(detailsCfg));
        conversion.for('dataDowncast').add(downcastElementToElement(detailsCfg));
        conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'details',
            view: detailsEditingDowncast
        }));
        schema.register('detailsSummary', {
            allowContentOf: '$block',
            allowIn: 'details',
            isBlock: true,
            isLimit: true
        });
        conversion.for('upcast').add(upcastElementToElement(summaryCfg));
        conversion.for('dataDowncast').add(downcastElementToElement(summaryCfg));
        conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'detailsSummary',
            view: detailsSummaryEditingDowncast
        }));
        schema.register('detailsContent', {
            allowContentOf: '$root',
            allowIn: 'details',
            isBlock: true,
            isLimit: true
        });
        conversion.for('upcast').add(upcastElementToElement(contentCfg));
        conversion.for('dataDowncast').add(downcastElementToElement(contentCfg));
        conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'detailsContent',
            view: detailsContentEditingDowncast
        }));
    }

    /**
     * @inheritDoc
     */
    afterInit() {
        const editor = this.editor;
        const model = editor.model;

        this.listenTo(editor.editing.view.document, 'enter', (evt, data) => {
            const doc = editor.model.document;
            const positionParent = doc.selection.getLastPosition().parent;

            if (positionParent.parent && positionParent.parent.name === 'details' && doc.selection.isCollapsed && positionParent.isEmpty) {
                model.change(writer => {
                    writer.insert(positionParent, positionParent.parent, 'after');
                });
                editor.editing.view.scrollToTheSelection();

                data.preventDefault();
                evt.stop();
            }
        });
    }
}

function detailsEditingDowncast(modelElement, viewWriter) {
    const details = viewWriter.createContainerElement('details');

    return toWidget(details, viewWriter);
}

function detailsSummaryEditingDowncast(modelElement, viewWriter) {
    const summary = viewWriter.createContainerElement('summary');

    return toWidgetEditable(summary, viewWriter);
}

function detailsContentEditingDowncast(modelElement, viewWriter) {
    const content = viewWriter.createContainerElement('div', {class: 'content'});

    return toWidgetEditable(content, viewWriter);
}
