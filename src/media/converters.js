/**
 * @module media/media/converters
 */
import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import first from '@ckeditor/ckeditor5-utils/src/first';
import {getTypeFromElement} from './utils';

/**
 * Returns a function that converts the media view representation:
 *
 *     <figure class="media"><img src="..." alt="..."></figure>
 *
 * to the model representation:
 *
 *     <media type="..." src="..." alt="..."></media>
 *
 * The entire content of the `<figure>` element except the media view element is being converted as children of the
 * `<media>` model element.
 *
 * @returns {Function}
 */
export function viewFigureToModel() {
    return dispatcher => {
        dispatcher.on('element:figure', function (evt, data, conversionApi) {
            if (!conversionApi.consumable.test(data.viewItem, {name: true, classes: 'media'})) {
                return;
            }

            const view = data.viewItem.getChild(0);
            let type;

            if (!view || !(type = getTypeFromElement(view.name)) || !view.hasAttribute('src') || !conversionApi.consumable.test(view, {name: true})) {
                return;
            }

            const result = conversionApi.convertItem(view, data.modelCursor);
            const model = first(result.modelRange.getItems());

            if (!model) {
                return;
            }

            conversionApi.writer.setAttribute('type', type.id, model);
            conversionApi.convertChildren(data.viewItem, ModelPosition.createAt(model));
            data.modelRange = result.modelRange;
            data.modelCursor = result.modelCursor;
        });
    };
}

/**
 * Converts model to view attributes
 *
 * @param {String} attributeKey
 *
 * @returns {Function}
 */
export function modelToViewAttributeConverter(attributeKey) {
    return dispatcher => {
        dispatcher.on(`attribute:${attributeKey}:media`, converter);
    };

    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }

        const writer = conversionApi.writer;
        const figure = conversionApi.mapper.toViewElement(data.item);
        const media = figure.getChild(0);

        if (data.attributeNewValue !== null) {
            writer.setAttribute(data.attributeKey, data.attributeNewValue, media);
        } else {
            writer.removeAttribute(data.attributeKey, media);
        }
    }
}
