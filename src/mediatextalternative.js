import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaTextAlternativeEditing from "./mediatextalternative/mediatextalternativeediting";
import MediaTextAlternativeUI from "./mediatextalternative/mediatextalternativeui";

export default class MediaTextAlternative extends Plugin {
    static get requires() {
        return [MediaTextAlternativeEditing, MediaTextAlternativeUI];
    }

    static get pluginName() {
        return 'MediaTextAlternative';
    }
}
