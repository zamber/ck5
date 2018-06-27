import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaBrowserUI from './mediabrowser/mediabrowserui';

export default class MediaBrowser extends Plugin {
    static get requires() {
        return [MediaBrowserUI];
    }

    static get pluginName() {
        return 'MediaBrowser';
    }
}
