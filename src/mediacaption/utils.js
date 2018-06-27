import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import {attachPlaceholder} from '@ckeditor/ckeditor5-engine/src/view/placeholder';
import {toWidgetEditable} from '@ckeditor/ckeditor5-widget/src/utils';

const symbol = Symbol('mediaCaption');

export function captionElementCreator(view, placeholderText) {
    return writer => {
        const editable = writer.createEditableElement('figcaption');
        writer.setCustomProperty(symbol, true, editable);
        attachPlaceholder(view, editable, placeholderText);

        return toWidgetEditable(editable, writer);
    };
}

export function isCaption(element) {
    return !!element.getCustomProperty(symbol);
}

export function getCaptionFromMedia(element) {
    for (const node of element.getChildren()) {
        if (node instanceof ModelElement && node.name === 'caption') {
            return node;
        }
    }

    return null;
}

export function matchMediaCaption(element) {
    const parent = element.parent;

    if (element.name === 'figcaption' && parent && parent.name === 'figure' && parent.hasClass('media')) {
        return {name: true};
    }

    return null;
}
