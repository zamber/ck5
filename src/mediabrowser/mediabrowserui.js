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
                    const win = window.open(
                        'browser.html',
                        'browser',
                        'location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes'
                    );

                    win.addEventListener('load', () => {
                        win.document.querySelectorAll('a[href]').forEach(a => {
                            a.addEventListener('click', ev => {
                                const mediaElement = writer.createElement('media', {src: a.getAttribute('href')});

                                ev.preventDefault();
                                editor.model.insertContent(mediaElement, editor.model.document.selection);
                                win.close();
                            });
                        });
                    });
                });
            });

            return view;
        });
    }
}
