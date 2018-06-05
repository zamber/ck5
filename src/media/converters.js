import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import first from '@ckeditor/ckeditor5-utils/src/first';

export function viewFigureToModel() {
    return dispatcher => {
        dispatcher.on('element:figure', function (evt, data, conversionApi) {
            // Do not convert if this is not an "media figure".
            if (!conversionApi.consumable.test(data.viewItem, {name: true, classes: 'media'})) {
                return;
            }

            // Find an media element inside the figure element.
            const view = Array.from(data.viewItem.getChildren()).find(viewChild => viewChild.is('img'));

            // Do not convert if media element is absent, is missing src attribute or was already converted.
            if (!view || !view.hasAttribute('src') || !conversionApi.consumable.test(view, {name: true})) {
                return;
            }

            // Convert view media to model media.
            const result = conversionApi.convertItem(view, data.modelCursor);

            // Get media element from conversion result.
            const model = first(result.modelRange.getItems());

            // When media wasn't successfully converted then finish conversion.
            if (!model) {
                return;
            }

            // Convert rest of the figure element's children as a media children.
            conversionApi.convertChildren(data.viewItem, ModelPosition.createAt(model));

            // Set media range as conversion result.
            data.modelRange = result.modelRange;

            // Continue conversion where media conversion ends.
            data.modelCursor = result.modelCursor;
        });
    };
}

export function srcsetAttributeConverter() {
    return dispatcher => {
        dispatcher.on('attribute:srcset:media', converter);
    };

    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }

        const writer = conversionApi.writer;
        const figure = conversionApi.mapper.toViewElement(data.item);
        const img = figure.getChild(0);

        if (data.attributeNewValue === null) {
            const srcset = data.attributeOldValue;

            if (srcset.data) {
                writer.removeAttribute('srcset', img);
                writer.removeAttribute('sizes', img);

                if (srcset.width) {
                    writer.removeAttribute('width', img);
                }
            }
        } else {
            const srcset = data.attributeNewValue;

            if (srcset.data) {
                writer.setAttribute('srcset', srcset.data, img);
                writer.setAttribute('sizes', '100vw', img);

                if (srcset.width) {
                    writer.setAttribute('width', srcset.width, img);
                }
            }
        }
    }
}

export function modelToViewAttributeConverter(attributeKey) {
    return dispatcher => {
        dispatcher.on(`attribute:${ attributeKey }:media`, converter);
    };

    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }

        const writer = conversionApi.writer;
        const figure = conversionApi.mapper.toViewElement(data.item);
        const img = figure.getChild(0);

        if (data.attributeNewValue !== null) {
            writer.setAttribute(data.attributeKey, data.attributeNewValue, img);
        } else {
            writer.removeAttribute(data.attributeKey, img);
        }
    }
}
