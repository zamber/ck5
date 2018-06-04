import Plugin from '@ckeditor/ckeditor5-core/src/plugin';


export default class Details extends Plugin {
    static get requires() {
        return [];
    }

    static get pluginName() {
        return 'Details';
    }
}
