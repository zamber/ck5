/**
 * @module details/detailsediting
 */
import DetailsCommand from './detailscommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {toDetailsWidget} from './utils';

/**
 * Details Editing Plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class DetailsEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const conversion = editor.conversion;
        const t = editor.t;

        editor.commands.add('details', new DetailsCommand(editor));

        // Schema
        schema.register('details', {
            allowWhere: '$block',
            isBlock: true,
            isLimit: true,
            isObject: true
        });
        schema.register('detailsSummary', {
            allowContentOf: '$block',
            allowIn: 'details',
            isBlock: true,
            isLimit: true
        });
        schema.register('detailsContent', {
            allowContentOf: '$root',
            allowIn: 'details',
            isBlock: true,
            isLimit: true
        });

        // Element
        conversion.for('dataDowncast').elementToElement({
            model: 'details',
            view: 'details'
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'details',
            view: (element, writer) => toDetailsWidget(writer.createContainerElement('details'), writer, t('Details'))
        });
        conversion.for('upcast').elementToElement({
            model: 'details',
            view: 'details'
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'detailsSummary',
            view: 'summary'
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'detailsSummary',
            view: 'summary'
        });
        conversion.for('upcast').elementToElement({
            model: 'detailsSummary',
            view: 'summary'
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'detailsContent',
            view: {
                name: 'div',
                attributes: {
                    class: 'content'
                }
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'detailsContent',
            view: {
                name: 'div',
                attributes: {
                    class: 'content'
                }
            }
        });
        conversion.for('upcast').elementToElement({
            model: 'detailsContent',
            view: {
                name: 'div',
                attributes: {
                    class: 'content'
                }
            }
        });
    }

    /**
     * @inheritDoc
     */
    afterInit() {
        const editor = this.editor;
        const model = editor.model;

        this.listenTo(editor.editing.view.document, 'enter', (evt, data) => {
            const doc = editor.model.document;
            const positionParent = doc.selection.getLastPosition().parent;

            if (positionParent.parent && positionParent.parent.name === 'details' && doc.selection.isCollapsed && positionParent.isEmpty) {
                model.change(writer => {
                    writer.insert(positionParent, positionParent.parent, 'after');
                });
                editor.editing.view.scrollToTheSelection();

                data.preventDefault();
                evt.stop();
            }
        });
    }
}
