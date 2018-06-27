import Command from '@ckeditor/ckeditor5-core/src/command';

export default class MediaBrowserCommand extends Command {
    execute(options) {
        const editor = this.editor;
        const doc = editor.model.document;

        editor.model.change(writer => {
            const mediaElement = writer.createElement('media', {src: 'sample.jpg', alt: 'Sample JPG'});

            editor.model.insertContent(mediaElement, doc.selection);
        });
    }
}
