import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ModelSelection from '@ckeditor/ckeditor5-engine/src/model/selection';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class MediaUploadCommand extends Command {
    execute(options) {
        const editor = this.editor;
        const doc = editor.model.document;
        const file = options.file;
        const fileRepository = editor.plugins.get(FileRepository);

        editor.model.change(writer => {
            const loader = fileRepository.createLoader(file);

            // Do not throw when upload adapter is not set. FileRepository will log an error anyway.
            if (!loader) {
                return;
            }

            const mediaElement = new ModelElement('media', {
                uploadId: loader.id
            });

            let insertAtSelection;

            if (options.insertAt) {
                insertAtSelection = new ModelSelection([new ModelRange(options.insertAt)]);
            } else {
                insertAtSelection = doc.selection;
            }

            editor.model.insertContent(mediaElement, insertAtSelection);

            // Inserting an media might've failed due to schema regulations.
            if (mediaElement.parent) {
                writer.setSelection(ModelRange.createOn(mediaElement));
            }
        });
    }
}
