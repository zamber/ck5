import Command from '@ckeditor/ckeditor5-core/src/command';
import {isMedia} from '../media/utils';

export default class MediaTextAlternativeCommand extends Command {
    refresh() {
        const element = this.editor.model.document.selection.getSelectedElement();

        this.isEnabled = isMedia(element);

        if (isMedia(element) && element.hasAttribute('alt')) {
            this.value = element.getAttribute('alt');
        } else {
            this.value = false;
        }
    }

    execute(options) {
        const model = this.editor.model;
        const mediaElement = model.document.selection.getSelectedElement();

        model.change(writer => {
            writer.setAttribute('alt', options.newValue, mediaElement);
        });
    }
}
