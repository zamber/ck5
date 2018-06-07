import DetailsEditing from './detailsediting';
import DetailsUI from './detailsui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

export default class Details extends Plugin {
    static get requires() {
        return [DetailsEditing, DetailsUI, Widget];
    }

    static get pluginName() {
        return 'Details';
    }
}
