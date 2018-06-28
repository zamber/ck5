import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import icon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class MediaBrowserUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add('mediaBrowser', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: t('Insert media'),
                icon: icon,
                tooltip: true
            });
            view.on('execute', () => {
                editor.model.change(writer => {
                    const browser = editor.config.get('media.browser');

                    if (!browser || !browser.length) {
                        return;
                    }

                    const win = window.open(
                        browser,
                        'browser',
                        'location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes'
                    );

                    window.addEventListener('message', ev => {
                        if (ev.origin === win.origin && ev.data.id === 'ckMediaBrowser' && !!ev.data.src) {
                            editor.model.insertContent(writer.createElement('media', {src: ev.data.src}), editor.model.document.selection);
                        }
                    }, false);
                });
            });

            return view;
        });
    }
}
