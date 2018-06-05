import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaStyleEditing from "./mediastyle/mediastyleediting";
import MediaStyleUI from "./mediastyle/mediastyleui";

export default class MediaStyle extends Plugin {
    static get requires() {
        return [MediaStyleEditing, MediaStyleUI];
    }

    static get pluginName() {
        return 'MediaStyle';
    }
}
