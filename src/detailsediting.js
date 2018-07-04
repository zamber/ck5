import DetailsCommand from './detailscommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import {downcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {toWidget, toWidgetEditable} from '@ckeditor/ckeditor5-widget/src/utils';
import {upcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

export default class DetailsEditing extends Plugin {
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const conversion = editor.conversion;

        editor.commands.add('details', new DetailsCommand(editor));
        schema.register('details', {
            allowAttributes: ['summary'],
            allowContentOf: '$root',
            allowIn: '$root',
            allowWhere: '$block',
            isBlock: true,
            isObject: true
        });
        conversion.for('upcast').add(upcastElementToElement({
            model: detailsUpcast,
            view: 'details'
        }));
        conversion.for('dataDowncast').add(downcastElementToElement({
            model: 'details',
            view: detailsDataDowncast
        }));
        conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'details',
            view: detailsEditingDowncast
        }));
    }

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

function detailsUpcast(viewElement, modelWriter) {
    const details = modelWriter.createElement('details');

    console.log(viewElement);

    return details;
}

function detailsDataDowncast(modelElement, viewWriter) {
    const details = viewWriter.createContainerElement('details');
    const summary = viewWriter.createContainerElement('summary');
    const summaryText = viewWriter.createText(modelElement.getAttribute('summary'));

    viewWriter.insert(ViewPosition.createAt(details), summary);
    viewWriter.insert(ViewPosition.createAt(summary), summaryText);

    return details;
}

function detailsEditingDowncast(modelElement, viewWriter) {
    const details = viewWriter.createContainerElement('details');
    const summary = viewWriter.createContainerElement('summary');
    const summaryText = viewWriter.createText(modelElement.getAttribute('summary'));
    const content = viewWriter.createEditableElement('div', {class: 'content'});

    console.log(modelElement);

    viewWriter.insert(ViewPosition.createAt(details), summary);
    toWidgetEditable(summary, viewWriter);
    viewWriter.insert(ViewPosition.createAt(summary), summaryText);
    viewWriter.insert(ViewPosition.createAfter(summary), content);
    toWidgetEditable(content, viewWriter);

    return toWidget(details, viewWriter);
}
