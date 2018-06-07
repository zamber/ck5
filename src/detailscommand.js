import Command from '@ckeditor/ckeditor5-core/src/command';
import Position from '@ckeditor/ckeditor5-engine/src/model/position';

export default class DetailsCommand extends Command {
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const schema = model.schema;
        const validParent = getInsertDetailsParent(selection.getFirstPosition());

        this.isEnabled = schema.checkChild(validParent, 'table');
    }

    execute() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const firstPosition = selection.getFirstPosition();
        const isRoot = firstPosition.parent === firstPosition.root;
        const insertPosition = isRoot ? Position.createAt(firstPosition) : Position.createAfter(firstPosition.parent);

        model.change(writer => {
            const details = writer.createElement('details');
            writer.insert(details, insertPosition);
        });
    }
}

function getInsertDetailsParent(position) {
    const parent = position.parent;

    return parent === parent.root ? parent : parent.parent;
}
