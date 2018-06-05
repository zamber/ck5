import MediaTextAlternativeCommand from './mediatextalternativecommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class MediaTextAlternativeEditing extends Plugin {
    init() {
        this.editor.commands.add('mediaTextAlternative', new MediaTextAlternativeCommand(this.editor));
    }
}
