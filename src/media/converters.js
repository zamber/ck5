import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import first from '@ckeditor/ckeditor5-utils/src/first';

export function viewFigureToModel() {
    return dispatcher => {
        dispatcher.on('element:figure', function (evt, data, conversionApi) {
            if (!conversionApi.consumable.test(data.viewItem, {name: true, classes: 'media'})) {
                return;
            }

            const view = Array.from(data.viewItem.getChildren()).find(viewChild => viewChild.is('img'));

            if (!view || !view.hasAttribute('src') || !conversionApi.consumable.test(view, {name: true})) {
                return;
            }

            const result = conversionApi.convertItem(view, data.modelCursor);
            const model = first(result.modelRange.getItems());

            if (!model) {
                return;
            }

            conversionApi.convertChildren(data.viewItem, ModelPosition.createAt(model));
            data.modelRange = result.modelRange;
            data.modelCursor = result.modelCursor;
        });
    };
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
        const media = figure.getChild(0);

        if (data.attributeNewValue !== null) {
            writer.setAttribute(data.attributeKey, data.attributeNewValue, media);
        } else {
            writer.removeAttribute(data.attributeKey, media);
        }
    }
}
