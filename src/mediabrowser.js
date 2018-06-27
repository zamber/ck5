import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaBrowserEditing from './mediabrowser/mediabrowserediting';
import MediaBrowserUI from './mediabrowser/mediabrowserui';

export default class MediaBrowser extends Plugin {
    static get requires() {
        return [MediaBrowserEditing, MediaBrowserUI];
    }

    static get pluginName() {
        return 'MediaBrowser';
    }
}
