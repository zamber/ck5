import Command from '@ckeditor/ckeditor5-core/src/command';
import Position from '@ckeditor/ckeditor5-engine/src/model/position';

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
        const firstPosition = selection.getFirstPosition();
        const isRoot = firstPosition.parent === firstPosition.root;
        const insertPosition = isRoot ? Position.createAt(firstPosition) : Position.createAfter(firstPosition.parent);

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

function getInsertDetailsParent(position) {
    const parent = position.parent;

    return parent === parent.root ? parent : parent.parent;
}
