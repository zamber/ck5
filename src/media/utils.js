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
 * Media types
 *
 * @type {Object}
 */
const mediaTypes = {
    audio: {
        id: 'audio',
        element: 'audio',
        mime: [
            'audio/aac', 'audio/flac', 'audio/mp3', 'audio/mpeg', 'audio/mpeg3', 'audio/ogg', 'audio/wav', 'audio/wave', 'audio/webm',
            'audio/x-aac', 'audio/x-flac', 'audio/x-mp3', 'audio/x-mpeg', 'audio/x-mpeg3', 'audio/x-pn-wav', 'audio/x-wav'
        ]
    },
    iframe: {
        id: 'iframe',
        element: 'iframe',
        mime: ['text/html']
    },
    image: {
        id: 'image',
        element: 'img',
        mime: ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
    },
    video: {
        id: 'video',
        element: 'video',
        mime: ['video/mp4', 'video/ogg', 'video/webm']
    }
};

/**
 * Converts a given {@link module:engine/view/element~Element} to a media widget
 *
 * @param {module:engine/view/element~Element} viewElement
 * @param {module:engine/view/writer~Writer} viewWriter
 *
 * @returns {module:engine/view/element~Element}
 */
export function toMediaWidget(viewElement, viewWriter) {
    viewWriter.setCustomProperty(symbol, true, viewElement);

    return toWidget(viewElement, viewWriter);
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
 * Checks if a given element is a `<figure>` element with the media type class set
 *
 * @param {module:engine/view/element~Element} viewElement
 *
 * @returns {Boolean}
 */
export function isMediaElement(viewElement) {
    return viewElement.name === 'figure' && Array.from(viewElement.getClassNames()).some(item => mediaTypes.hasOwnProperty(item));
}

/**
 * Returns all media types IDs
 *
 * @return {string[]}
 */
export function getTypeIds() {
    return Object.getOwnPropertyNames(mediaTypes);
}

/**
 * Returns given media type or null
 *
 * @param {string} type
 *
 * @return {?Object}
 */
export function getType(type) {
    return mediaTypes[type] || null;
}

/**
 * Returns given media type from given element or null
 *
 * @param {string} element
 *
 * @return {?Object}
 */
export function getTypeFromElement(element) {
    const ids = getTypeIds();

    for (let i = 0; i < ids.length; ++i) {
        if (mediaTypes[ids[i]].element === element) {
            return mediaTypes[ids[i]];
        }
    }

    return null;
}

/**
 * Returns media type from given URL or null
 *
 * @param {string} url
 *
 * @return {?Object}
 */
export function getTypeFromUrl(url) {
    const xhr = new XMLHttpRequest();

    try {
        xhr.open('HEAD', url, false);
        xhr.send();
    } catch (e) {
        console.log(e);
        return null;
    }

    if (xhr.readyState === xhr.DONE && xhr.status >= 200 && xhr.status < 300) {
        const mime = xhr.getResponseHeader('Content-Type').split(';')[0].trim();
        const ids = getTypeIds();

        for (let i = 0; i < ids.length; ++i) {
            if (mediaTypes[ids[i]].mime.includes(mime)) {
                return mediaTypes[ids[i]];
            }
        }
    }

    return null;
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
