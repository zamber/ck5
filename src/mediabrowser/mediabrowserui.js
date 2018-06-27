import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import icon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class MediaBrowserUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add('mediaBrowser', locale => {
            const view = new ButtonView(locale);
            const command = editor.commands.get('mediaBrowser');

            view.set({
                label: t('Insert media'),
                icon: icon,
                tooltip: true
            });
            view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
            this.listenTo(view, 'execute', () => editor.execute('mediaBrowser'));

            return view;
        });
    }
}
