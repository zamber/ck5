import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import icon from '../theme/icons/details.svg';

export default class DetailsUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add('details', locale => {
            const command = editor.commands.get('details');
            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: t('Details'),
                icon: icon,
                tooltip: true
            });

            // Bind button model to command.
            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            // Execute command.
            this.listenTo(buttonView, 'execute', () => editor.execute('details'));

            return buttonView;
        });
    }
}
