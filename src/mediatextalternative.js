import MediaTextAlternativeEditing from './mediatextalternative/mediatextalternativeediting';
import MediaTextAlternativeUI from './mediatextalternative/mediatextalternativeui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class MediaTextAlternative extends Plugin {
    static get requires() {
        return [MediaTextAlternativeEditing, MediaTextAlternativeUI];
    }

    static get pluginName() {
        return 'MediaTextAlternative';
    }
}
