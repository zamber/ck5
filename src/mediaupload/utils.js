import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';

export function isMediaType(file) {
    const types = /^image\/(jpeg|png|gif|bmp)$/;

    return types.test(file.type);
}

export function findOptimalInsertionPosition(selection) {
    const selectedElement = selection.getSelectedElement();

    if (selectedElement) {
        return ModelPosition.createAfter(selectedElement);
    }

    const firstBlock = selection.getSelectedBlocks().next().value;

    if (firstBlock) {
        // If inserting into an empty block – return position in that block. It will get
        // replaced with the media by insertContent(). #42.
        if (firstBlock.isEmpty) {
            return ModelPosition.createAt(firstBlock);
        }

        const positionAfter = ModelPosition.createAfter(firstBlock);

        // If selection is at the end of the block - return position after the block.
        if (selection.focus.isTouching(positionAfter)) {
            return positionAfter;
        }

        // Otherwise return position before the block.
        return ModelPosition.createBefore(firstBlock);
    }

    return selection.focus;
}
