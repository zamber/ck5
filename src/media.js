import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import MediaEditing from "./media/mediaediting";
import MediaTextAlternative from "./mediatextalternative";
import '../theme/media.css';

export default class Media extends Plugin {
    static get requires() {
        return [MediaEditing, MediaTextAlternative, Widget];
    }

    static get pluginName() {
        return 'Media';
    }
}
