import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Image from '@ckeditor/ckeditor5-image/src/image'
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class ImageButton extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageButton';
    }

    /**
     * @inheritDoc
     */
    static get requires() {
        return [Image];
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add('image', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: t('Insert image'),
                icon: imageIcon,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            view.on('execute', () => {
                const url = prompt(t('Image URL'));

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
