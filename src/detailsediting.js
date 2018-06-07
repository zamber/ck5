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
            isBlock: true,
            isObject: true
        });
    }
}
