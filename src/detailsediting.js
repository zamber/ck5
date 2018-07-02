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
        const command = editor.commands.get('details');

        this.listenTo(this.editor.editing.view.document, 'enter', (evt, data) => {
            const doc = this.editor.model.document;
            const positionParent = doc.selection.getLastPosition().parent;

            if (doc.selection.isCollapsed && positionParent.isEmpty && command.value) {
                this.editor.execute('details');
                this.editor.editing.view.scrollToTheSelection();

                data.preventDefault();
                evt.stop();
            }
        });
    }
}
