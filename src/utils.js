/**
 * @module details/utils
 */
import {isWidget, toWidget} from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * Converts a given view element to a details widget
 *
 * @param {module:engine/view/element~Element} element
 * @param {module:engine/view/downcastwriter~DowncastWriter} writer
 * @param {String} label
 *
 * @returns {module:engine/view/element~Element}
 */
export function toDetailsWidget(element, writer, label) {
    writer.setCustomProperty('details', true, element);

    return toWidget(element, writer, {label: label});
}

/**
 * Checks if a given view element is a details widget
 *
 * @param {module:engine/view/element~Element} element
 *
 * @returns {Boolean}
 */
export function isDetailsWidget(element) {
    return !!element.getCustomProperty('details') && isWidget(element);
}

/**
 * Checks if a details widget is the only selected element
 *
 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
 *
 * @returns {Boolean}
 */
export function isDetailsWidgetSelected(selection) {
    const element = selection.getSelectedElement();

    return !!element && isDetailsWidget(element);
}

/**
 * Checks if provided model element is a details element
 *
 * @param {module:engine/model/element~Element} element
 *
 * @returns {Boolean}
 */
export function isDetails(element) {
    return !!element && element.is('details');
}
