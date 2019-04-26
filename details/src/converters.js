/**
 * @module details/converters
 */
import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * Returns a function that converts the details view representation:
 *
 *     <details><summary>...</summary>...</details>
 *
 * to the model representation:
 *
 *     <details summary="...">...</details>
 *
 * The entire content of the `<details>` view element except the summary view element is being converted as children of
 * the `<details>` model element.
 *
 * @returns {Function}
 */
export function viewToModel() {
    return dispatcher => {
        dispatcher.on('element:details', (evt, data, conversionApi) => {
            if (!conversionApi.consumable.test(data.viewItem, {name: true})) {
                return;
            }

            const summary = data.viewItem.getChild(0);
            console.log(summary);

            if (!summary || summary.name !== 'summary' || !conversionApi.consumable.test(summary, {name: true})) {
                return;
            }

            const result = conversionApi.convertItem(summary, data.modelCursor);
            const model = first(result.modelRange.getItems());

            if (!model) {
                return;
            }

            conversionApi.writer.setAttribute('summary', 'Details', model);
            conversionApi.convertChildren(data.viewItem, conversionApi.writer.createPositionAt(model, 0));
            data.modelRange = result.modelRange;
            data.modelCursor = result.modelCursor;
        });
    };
}
