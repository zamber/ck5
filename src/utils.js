import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import {isWidget, toWidget} from '@ckeditor/ckeditor5-widget/src/utils';

const symbol = Symbol('isDetails');

export function toDetailsWidget(viewElement, viewWriter, label) {
    viewWriter.setCustomProperty(symbol, true, viewElement);

    return toWidget(viewElement, viewWriter, {
        label: label
    });
}

export function isDetailsWidget(viewElement) {
    return !!viewElement.getCustomProperty(symbol) && isWidget(viewElement);
}

export function isDetailsWidgetSelected(selection) {
    const viewElement = selection.getSelectedElement();

    return !!viewElement && isDetailsWidget(viewElement);
}

export function isDetails(modelElement) {
    return modelElement instanceof ModelElement && modelElement.name === 'details';
}
