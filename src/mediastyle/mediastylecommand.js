import Command from '@ckeditor/ckeditor5-core/src/command';
import {isMedia} from '../media/utils';

export default class MediaStyleCommand extends Command {
    constructor(editor, styles) {
        super(editor);

        this._defaultStyle = false;
        this.styles = styles.reduce((styles, style) => {
            styles[style.name] = style;

            if (style.isDefault) {
                this._defaultStyle = style.name;
            }

            return styles;
        }, {});
    }

    refresh() {
        const element = this.editor.model.document.selection.getSelectedElement();

        this.isEnabled = isMedia(element);

        if (!element) {
            this.value = false;
        } else if (element.hasAttribute('mediaStyle')) {
            const attributeValue = element.getAttribute('mediaStyle');
            this.value = this.styles[attributeValue] ? attributeValue : false;
        } else {
            this.value = this._defaultStyle;
        }
    }

    execute(options) {
        const styleName = options.value;

        const model = this.editor.model;
        const mediaElement = model.document.selection.getSelectedElement();

        model.change(writer => {
            if (this.styles[styleName].isDefault) {
                writer.removeAttribute('mediaStyle', mediaElement);
            } else {
                writer.setAttribute('mediaStyle', styleName, mediaElement);
            }
        });
    }
}
