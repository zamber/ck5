/**
 * @module media/mediacaption/utils
 */
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import {attachPlaceholder} from '@ckeditor/ckeditor5-engine/src/view/placeholder';
import {isMediaElement} from '../media/utils';
import {toWidgetEditable} from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * Media caption symbol
 *
 * @type {symbol}
 */
const symbol = Symbol('mediaCaption');

/**
 * Returns a function that creates a caption editable element for the given {@link module:engine/view/document~Document}.
 *
 * @param {module:engine/view/view~View} view
 * @param {String} placeholderText
 *
 * @returns {Function}
 */
export function captionElementCreator(view, placeholderText) {
    return writer => {
        const editable = writer.createEditableElement('figcaption');
        writer.setCustomProperty(symbol, true, editable);
        attachPlaceholder(view, editable, placeholderText);

        return toWidgetEditable(editable, writer);
    };
}

/**
 * Returns `true` if a given view element is the media caption editable.
 *
 * @param {module:engine/view/element~Element} viewElement
 *
 * @returns {Boolean}
 */
export function isCaption(viewElement) {
    return !!viewElement.getCustomProperty(symbol);
}

/**
 * Returns the caption model element from a given media element or `null` if no caption is found.
 *
 * @param {module:engine/model/element~Element} modelMedia
 *
 * @returns {module:engine/model/element~Element|null}
 */
export function getCaptionFromMedia(modelMedia) {
    for (const node of modelMedia.getChildren()) {
        if (node instanceof ModelElement && node.name === 'caption') {
            return node;
        }
    }

    return null;
}

/**
 * {@link module:engine/view/matcher~Matcher} pattern. Checks if a given element is a `<figcaption>` element that is
 * placed inside the media `<figure>` element.
 *
 * @param {module:engine/view/element~Element} element
 *
 * @returns {Object|null}
 */
export function matchMediaCaption(element) {
    return element.name === 'figcaption' && isMediaElement(element.parent) ? {name: true} : null;
}
