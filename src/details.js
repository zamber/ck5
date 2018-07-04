import DetailsEditing from './detailsediting';
import DetailsUI from './detailsui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import '../theme/details.css';

/**
 * Details Plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class Details extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [DetailsEditing, DetailsUI, Widget];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'Details';
    }
}
