import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import mediaIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import {isMediaType, findOptimalInsertionPosition} from './utils';

export default class MediaUploadUI extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = editor.t;

        // Setup `mediaUpload` button.
        editor.ui.componentFactory.add('mediaUpload', locale => {
            const view = new FileDialogButtonView(locale);
            const command = editor.commands.get('mediaUpload');

            view.set({
                acceptedType: 'image/*',
                allowMultipleFiles: true
            });

            view.buttonView.set({
                label: t('Insert media'),
                icon: mediaIcon,
                tooltip: true
            });

            view.buttonView.bind('isEnabled').to(command);

            view.on('done', (evt, files) => {
                for (const file of Array.from(files)) {
                    const insertAt = findOptimalInsertionPosition(editor.model.document.selection);

                    if (isMediaType(file)) {
                        editor.execute('mediaUpload', {file, insertAt});
                    }
                }
            });

            return view;
        });
    }
}
