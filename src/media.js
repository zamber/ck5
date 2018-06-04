import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';


export default class Media extends Plugin {
    static get requires() {
        return [Widget];
    }

    static get pluginName() {
        return 'Media';
    }
}
