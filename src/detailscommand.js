/**
 * @module details/detailscommand
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import {findOptimalInsertionPosition} from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * Details Command
 *
 * @extends module:core/command~Command
 */
export default class DetailsCommand extends Command {
    /**
     * @inheritDoc
     */
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const schema = model.schema;
        const validParent = getInsertDetailsParent(selection.getFirstPosition());

        this.isEnabled = schema.checkChild(validParent, 'details');
    }

    /**
     * @inheritDoc
     */
    execute() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const insertPosition = findOptimalInsertionPosition(selection, model);

        model.change(writer => {
            const details = writer.createElement('details');
            const summary = writer.createElement('detailsSummary');
            const content = writer.createElement('detailsContent');
            const paragraph = writer.createElement('paragraph');

            writer.append(writer.createText('Summary'), summary);
            writer.append(summary, details);
            writer.append(writer.createText('Content'), paragraph);
            writer.append(paragraph, content);
            writer.append(content, details);
            writer.insert(details, insertPosition);
        });
    }
}

/**
 * Returns valid parent to insert details
 *
 * @private
 *
 * @param {module:engine/model/position~Position} position
 *
 * @returns {module:engine/model/element~Element}
 */
function getInsertDetailsParent(position) {
    const parent = position.parent;

    return parent === parent.root ? parent : parent.parent;
}
