import DetailsCommand from './detailscommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

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
        conversion.elementToElement({model: 'details', view: 'details'});
        conversion.elementToElement({model: 'summary', view: 'summary'});
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
