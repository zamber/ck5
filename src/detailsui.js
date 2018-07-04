/**
 * @module details/detailsui
 */
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import icon from '../theme/icons/details.svg';

/**
 * Details UI Plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class DetailsUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add('details', locale => {
            const command = editor.commands.get('details');
            const view = new ButtonView(locale);

            view.set({
                label: t('Details'),
                icon: icon,
                tooltip: true
            });
            view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
            this.listenTo(view, 'execute', () => editor.execute('details'));

            return view;
        });
    }
}
