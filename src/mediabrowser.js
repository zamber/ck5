import MediaBrowserUI from './mediabrowser/mediabrowserui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class MediaBrowser extends Plugin {
    static get requires() {
        return [MediaBrowserUI];
    }

    static get pluginName() {
        return 'MediaBrowser';
    }
}
