import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class Media extends Plugin {
    static get pluginName() {
        return 'Media';
    }

    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('media', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Insert media',
                icon: imageIcon,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            view.on('execute', () => {
                const url = prompt('Media URL');

                if (!url) {
                    return;
                }

                editor.document.enqueueChanges(() => {
                    const element = new ModelElement('image', {
                        src: url
                    });

                    // Insert the image in the current selection location.
                    editor.data.insertContent(element, editor.document.selection);
                });
            });

            return view;
        });
    }
}
