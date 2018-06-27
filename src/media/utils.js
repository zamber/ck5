import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import {isWidget, toWidget} from '@ckeditor/ckeditor5-widget/src/utils';

const mediaSymbol = Symbol('isMedia');

export function toMediaWidget(viewElement, writer, label) {
    writer.setCustomProperty(mediaSymbol, true, viewElement);

    return toWidget(viewElement, writer, {
        label: function () {
            const mediaElement = viewElement.getChild(0);
            const altText = mediaElement.getAttribute('alt');

            return altText ? `${altText} ${label}` : label;
        }
    });
}

export function isMediaWidget(viewElement) {
    return !!viewElement.getCustomProperty(mediaSymbol) && isWidget(viewElement);
}

export function isMediaWidgetSelected(selection) {
    const viewElement = selection.getSelectedElement();

    return !!viewElement && isMediaWidget(viewElement);
}

export function isMedia(modelElement) {
    return modelElement instanceof ModelElement && modelElement.name === 'media';
}
