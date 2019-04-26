/**
 * @module details/detailsediting
 */
import DetailsCommand from './detailscommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {viewToModel} from './converters';
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
            allowAttributes: ['summary'],
            allowContentOf: '$root',
            allowWhere: '$block',
            isBlock: true,
            isLimit: true,
            isObject: true
        });

        // Element
        conversion.for('upcast').add(viewToModel());
        conversion.for('dataDowncast').elementToElement({
            model: 'details',
            view: detailsDataDowncast
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'details',
            view: (element, writer) => toDetailsWidget(detailsEditingDowncast(element, writer), writer, t('Details'))
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
 * Creates a view element represeting the details.
 *
 * @private
 *
 * @param {module:engine/model/element~Element} element
 * @param {module:engine/view/downcastwriter~DowncastWriter} writer
 *
 * @returns {module:engine/view/containerelement~ContainerElement}
 */
function detailsDataDowncast(element, writer) {
    const details = writer.createContainerElement('details');
    const summary = writer.createContainerElement('summary');
    const text = writer.createText(details.getAttribute('summary') || 'Details');

    writer.insert(writer.createPositionAt(details, 0), summary);
    writer.insert(writer.createPositionAt(summary, 0), text);

    return details;
}

/**
 * Creates a editable view element represeting the details.
 *
 * @private
 *
 * @param {module:engine/model/element~Element} element
 * @param {module:engine/view/downcastwriter~DowncastWriter} writer
 *
 * @returns {module:engine/view/containerelement~ContainerElement}
 */
function detailsEditingDowncast(element, writer) {
    const details = writer.createContainerElement('details');
    const summary = writer.createEditableElement('summary');
    const text = writer.createText(details.getAttribute('summary') || 'Details');

    writer.insert(writer.createPositionAt(details, 0), toWidgetEditable(summary, writer));
    writer.insert(writer.createPositionAt(summary, 0), text);

    return details;
}
