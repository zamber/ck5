import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import icon from '../theme/icons/details.svg';

export default class DetailsUI extends Plugin {
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

            // Bind button model to command.
            view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            // Execute command.
            this.listenTo(view, 'execute', () => editor.execute('details'));

            return view;
        });
    }
}
