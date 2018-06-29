import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import {isWidget, toWidget} from '@ckeditor/ckeditor5-widget/src/utils';

const symbol = Symbol('isMedia');

export function toMediaWidget(element, writer, label) {
    writer.setCustomProperty(symbol, true, element);

    return toWidget(element, writer, {
        label: function () {
            const media = element.getChild(0);
            const altText = media.getAttribute('alt');

            return altText ? `${altText} ${label}` : label;
        }
    });
}

export function isMediaWidget(element) {
    return !!element.getCustomProperty(symbol) && isWidget(element);
}

export function isMediaWidgetSelected(sel) {
    const element = sel.getSelectedElement();

    return !!element && isMediaWidget(element);
}

export function isMedia(element) {
    return element instanceof ModelElement && element.name === 'media';
}

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

export function repositionContextualBalloon(editor) {
    const balloon = editor.plugins.get('ContextualBalloon');

    if (isMediaWidgetSelected(editor.editing.view.document.selection)) {
        balloon.updatePosition(getBalloonPositionData(editor));
    }
}
