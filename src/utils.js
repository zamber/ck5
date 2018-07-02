import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import {isWidget, toWidget} from '@ckeditor/ckeditor5-widget/src/utils';

const symbol = Symbol('isDetails');

export function toDetailsWidget(element, writer, label) {
    writer.setCustomProperty(symbol, true, element);

    return toWidget(element, writer, {
        label: label
    });
}

export function isDetailsWidget(element) {
    return !!element.getCustomProperty(symbol) && isWidget(element);
}

export function isDetailsWidgetSelected(sel) {
    const element = sel.getSelectedElement();

    return !!element && isDetailsWidget(element);
}

export function isDetails(element) {
    return element instanceof ModelElement && element.name === 'details';
}
