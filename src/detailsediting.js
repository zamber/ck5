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
            allowIn: '$root',
            allowWhere: '$block',
            allowContentOf: '$root',
            isBlock: true,
            isObject: true
        });
        schema.register('summary', {
            allowIn: 'details',
            isBlock: true
        });
        conversion.for('upcast').add(upcastElementToElement({
            model: 'details',
            view: 'details'
        }));
        conversion.for('dataDowncast').add(downcastElementToElement({
            model: 'details',
            view: 'details'
        }));
        conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'details',
            view: toDetailsEditingElement
        }));
        conversion.elementToElement({
            model: 'summary',
            view: 'summary'
        });
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

function toDetailsEditingElement(model, writer) {
    const details = writer.createContainerElement('details');
    const p = writer.createEditableElement('p', {class: 'summary'});
    const div = writer.createEditableElement('div', {class: 'content'});

    for (let child of model.getChildren()) {
        console.log(child);
    }

    writer.insert(ViewPosition.createAt(details), p);
    toWidgetEditable(p, writer);
    writer.insert(ViewPosition.createAfter(p), div);
    toWidgetEditable(div, writer);

    return toWidget(details, writer);
}
