/**
 * @module details/detailsediting
 */
import DetailsCommand from './detailscommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {toDetailsWidget} from './utils';
import {toWidgetEditable} from '@ckeditor/ckeditor5-widget/src/utils';

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
        const t = editor.t;

        // Command
        editor.commands.add('details', new DetailsCommand(editor));

        // Schema
        schema.register('details', {
            allowWhere: '$block',
            isBlock: true,
            isLimit: true,
            isObject: true
        });
        schema.register('detailsSummary', {
            allowContentOf: '$block',
            allowIn: 'details',
            isBlock: true,
            isLimit: true
        });
        schema.register('detailsContent', {
            allowContentOf: '$root',
            allowIn: 'details',
            isBlock: true,
            isLimit: true
        });

        // Upcast
        conversion.for('upcast').elementToElement({
            model: 'details',
            view: 'details'
        });
        conversion.for('upcast').elementToElement({
            model: 'detailsSummary',
            view: 'summary'
        });
        conversion.for('upcast').elementToElement({
            model: 'detailsContent',
            view: {
                name: 'div',
                attributes: {
                    class: 'content'
                }
            }
        });
        // Downcast
        conversion.for('dataDowncast').elementToElement({
            model: 'details',
            view: 'details'
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'detailsSummary',
            view: 'summary'
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'detailsContent',
            view: {
                name: 'div',
                attributes: {
                    class: 'content'
                }
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'details',
            view: (element, writer) => toDetailsWidget(writer.createContainerElement('details'), writer, t('Details'))
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'detailsSummary',
            view: summaryEditingDowncast
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'detailsContent',
            view: contentEditingDowncast
        });
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

/**
 * Downcasts a given model element to a details summary editable
 *
 * @private
 *
 * @param {module:engine/model/element~Element} element
 * @param {module:engine/view/downcastwriter~DowncastWriter} writer
 *
 * @returns {module:engine/view/editableelement~EditableElement}
 */
function summaryEditingDowncast(element, writer) {
    const summary = writer.createContainerElement('summary');

    return toWidgetEditable(summary, writer);
}

/**
 * Downcasts a given model element to a details content editable
 *
 * @private
 *
 * @param {module:engine/model/element~Element} element
 * @param {module:engine/view/downcastwriter~DowncastWriter} writer
 *
 * @returns {module:engine/view/editableelement~EditableElement}
 */
function contentEditingDowncast(element, writer) {
    const content = writer.createContainerElement('div', {class: 'content'});

    return toWidgetEditable(content, writer);
}
