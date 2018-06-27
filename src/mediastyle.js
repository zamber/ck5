import MediaStyleEditing from './mediastyle/mediastyleediting';
import MediaStyleUI from './mediastyle/mediastyleui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class MediaStyle extends Plugin {
    static get requires() {
        return [MediaStyleEditing, MediaStyleUI];
    }

    static get pluginName() {
        return 'MediaStyle';
    }
}
