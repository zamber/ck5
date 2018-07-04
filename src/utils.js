/**
 * @module details/utils
 */
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import {isWidget, toWidget} from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * Details widget symbol
 *
 * @type {symbol}
 */
const symbol = Symbol('isDetails');

/**
 * Converts a given {@link module:engine/view/element~Element} to a details widget
 *
 * @param {module:engine/view/element~Element} viewElement
 * @param {module:engine/view/writer~Writer} viewWriter
 * @param {String} label
 *
 * @returns {module:engine/view/element~Element}
 */
export function toDetailsWidget(viewElement, viewWriter, label) {
    viewWriter.setCustomProperty(symbol, true, viewElement);

    return toWidget(viewElement, viewWriter, {
        label: label
    });
}

/**
 * Checks if a given view element is a details widget.
 *
 * @param {module:engine/view/element~Element} viewElement
 *
 * @returns {Boolean}
 */
export function isDetailsWidget(viewElement) {
    return !!viewElement.getCustomProperty(symbol) && isWidget(viewElement);
}

/**
 * Checks if a details widget is the only selected element.
 *
 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
 *
 * @returns {Boolean}
 */
export function isDetailsWidgetSelected(selection) {
    const viewElement = selection.getSelectedElement();

    return !!viewElement && isDetailsWidget(viewElement);
}

/**
 * Checks if provided model element is an instance of {@link module:engine/model/element~Element} with name `details`
 *
 * @param {module:engine/model/element~Element} modelElement
 *
 * @returns {Boolean}
 */
export function isDetails(modelElement) {
    return modelElement instanceof ModelElement && modelElement.name === 'details';
}
