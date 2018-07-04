/**
 * @module media/media/utils
 */
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import {isWidget, toWidget} from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * Media widget symbol
 *
 * @type {symbol}
 */
const symbol = Symbol('isMedia');

/**
 * Converts a given {@link module:engine/view/element~Element} to a media widget
 *
 * @param {module:engine/view/element~Element} viewElement
 * @param {module:engine/view/writer~Writer} viewWriter
 * @param {String} label
 *
 * @returns {module:engine/view/element~Element}
 */
export function toMediaWidget(viewElement, viewWriter, label) {
    viewWriter.setCustomProperty(symbol, true, viewElement);

    return toWidget(viewElement, viewWriter, {
        label: function () {
            const media = viewElement.getChild(0);
            const altText = media.getAttribute('alt');

            return altText ? `${altText} ${label}` : label;
        }
    });
}

/**
 * Checks if a given view element is a media widget.
 *
 * @param {module:engine/view/element~Element} viewElement
 *
 * @returns {Boolean}
 */
export function isMediaWidget(viewElement) {
    return !!viewElement.getCustomProperty(symbol) && isWidget(viewElement);
}

/**
 * Checks if a media widget is the only selected element.
 *
 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
 *
 * @returns {Boolean}
 */
export function isMediaWidgetSelected(selection) {
    const viewElement = selection.getSelectedElement();

    return !!viewElement && isMediaWidget(viewElement);
}

/**
 * Checks if provided model element is an instance of {@link module:engine/model/element~Element} with name `media`
 *
 * @param {module:engine/model/element~Element} modelElement
 *
 * @returns {Boolean}
 */
export function isMedia(modelElement) {
    return modelElement instanceof ModelElement && modelElement.name === 'media';
}

/**
 * Returns the positioning options that control the geometry of the
 * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon} with respect to the selected element in the
 * editor content.
 *
 * @param {module:core/editor/editor~Editor} editor
 *
 * @returns {module:utils/dom/position~Options}
 */
export function getBalloonPositionData(editor) {
    const editingView = editor.editing.view;
    const defaultPositions = BalloonPanelView.defaultPositions;

    return {
        target: editingView.domConverter.viewToDom(editingView.document.selection.getSelectedElement()),
        positions: [
            defaultPositions.northArrowSouth,
            defaultPositions.northArrowSouthWest,
            defaultPositions.northArrowSouthEast,
            defaultPositions.southArrowNorth,
            defaultPositions.southArrowNorthWest,
            defaultPositions.southArrowNorthEast
        ]
    };
}

/**
 * A helper utility that positions the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon} instance with
 * respect to the media in the editor content, if one is selected.
 *
 * @param {module:core/editor/editor~Editor} editor
 */
export function repositionContextualBalloon(editor) {
    const balloon = editor.plugins.get('ContextualBalloon');

    if (isMediaWidgetSelected(editor.editing.view.document.selection)) {
        balloon.updatePosition(getBalloonPositionData(editor));
    }
}
