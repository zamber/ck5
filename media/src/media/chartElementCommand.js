import Command from '@ckeditor/ckeditor5-core/src/command';

export class ChartElementCommand extends Command {

    execute(data) {
        const model = this.editor.model;
        const url = this.buildUrl(data);
        const dropPosition = this.createDropPosition(data.position);

        if (url) {
            model.change(writer => {
                const elem = writer.createElement('chart', {
                    src: url,
                    width: '640',
                    height: '480'
                });

                if (dropPosition) {
                    model.insertContent(elem, dropPosition);
                    if (elem.parent) {
                        writer.setSelection(elem, 'on');
                    }
                }
            });
        }
    }

    createDropPosition(currentPos) {
        let path = [];
        const element = document.elementFromPoint(currentPos.pageX, currentPos.pageY);
        this.editor.sourceElement.childNodes.forEach((el, i) => {
            if (el.contains(element)) {
                path.push(i);
            }
        });
        if (!path.length) {
            path.push(0);
        }
        if (element.nodeName === 'TD'
            && element instanceof HTMLTableDataCellElement
            && element.parentElement instanceof HTMLTableRowElement
        ) {
            path = [...path, element.parentElement.rowIndex, element.cellIndex, 0, 0];
        } else if (element.textContent) {
            path.push(this.calculateCaretPosition(currentPos));
        }

        return this.editor.model.createPositionFromPath(this.editor.model.document.roots._itemMap.get('main'), path);
    }

    calculateCaretPosition(currentPos) {
        let length = document.caretRangeFromPoint(currentPos.pageX, currentPos.pageY).startOffset;
        let prevSibling = document.caretRangeFromPoint(currentPos.pageX, currentPos.pageY).startContainer.previousSibling;

        while (prevSibling) {
            if (prevSibling.nodeName === '#text') {
                length += prevSibling.textContent.length + 1;
            }

            if (prevSibling.nodeName === 'FIGURE' && prevSibling.previousSibling && prevSibling.previousSibling.nodeName === 'FIGURE') {
                length++; // it seems like ckeditor  has its own logic to calculate position, where there is more than one iframe in a row so we need to add them to calculate correct position
            }

            prevSibling = prevSibling.previousSibling;

        }
        return length;
    }

    buildUrl(data) {
        return 'buildUrl'
    }
}
