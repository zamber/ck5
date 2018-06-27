import MediaBrowserCommand from './mediabrowsercommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class MediaBrowserEditing extends Plugin {
    init() {
        const editor = this.editor;

        editor.commands.add('mediaBrowser', new MediaBrowserCommand(editor));
    }
}
