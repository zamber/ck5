/**
 * @module media/media/converters
 */
import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * Returns a function that converts the media view representation:
 *
 *     <figure class="media"><img src="..." alt="...">...</figure>
 *
 * to the model representation:
 *
 *     <media type="..." src="..." alt="...">...</media>
 *
 * The entire content of the `<figure>` element except the media view element is being converted as children of the
 * `<media>` model element.
 *
 * @returns {Function}
 */
export function viewToModel() {
    return dispatcher => {
        dispatcher.on('element:figure', (evt, data, conversionApi) => {
            if (!conversionApi.consumable.test(data.viewItem, { name: true, classes: 'chart' })) {
                return;
            }
        
            const viewImage = Array.from(data.viewItem.getChildren()).find((viewChild) => viewChild.is('iframe'));
        
            if (!viewImage || !viewImage.hasAttribute('src') || !conversionApi.consumable.test(viewImage, { name: true })) {
                return;
            }
        
            const conversionResult = conversionApi.convertItem(data.viewItem.getChild(0), data.modelCursor);
            
            const modelChart = first(conversionResult.modelRange.getItems());
        
            if (!modelChart) {
                return;
            }
        
            conversionApi.convertChildren(data.viewItem, conversionApi.writer.createPositionAt(modelChart, 0));
        
            data.modelRange = conversionResult.modelRange;
            data.modelCursor = conversionResult.modelCursor;
        });
    };
}

/**
 * Converts model to view attributes
 *
 * @param {String} key
 *
 * @returns {Function}
 */
export function modelToViewAttribute(key) {
    return dispatcher => {
        dispatcher.on(`attribute:${key}:media`, (evt, data, conversionApi) => {
            if (!conversionApi.consumable.consume(data.item, evt.name)) {
                return;
            }

            const figure = conversionApi.mapper.toViewElement(data.item);
            const media = figure.getChild(0);

            if (data.attributeNewValue !== null) {
                conversionApi.writer.setAttribute(data.attributeKey, data.attributeNewValue, media);
            } else {
                conversionApi.writer.removeAttribute(data.attributeKey, media);
            }
        });
    }
}

/**
 * Converts model to view attributes
 *
 * @param {String} key
 *
 * @returns {Function}
 */
export function setConstantTags() {
    return dispatcher => {
        dispatcher.on(`element:iframe`, (evt, data, conversionApi) => {
            if (!conversionApi.consumable.consume(data.item, evt.name)) {
                return;
            }
        
            const writer = conversionApi.writer;
            const figure = conversionApi.mapper.toViewElement(data.item);
            const iframe = figure.getChild(0);
        
            writer.setAttribute('sandbox', 'allow-same-origin allow-scripts', iframe);
            writer.setAttribute('style', 'border: 1px solid black', iframe);
        });
    }
}
