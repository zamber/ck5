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
                    const mediaElement = writer.createElement('media', {src: 'sample.jpg', alt: 'Sample JPG'});

                    editor.model.insertContent(mediaElement, editor.model.document.selection);
                });
            });

            return view;
        });
    }
}
