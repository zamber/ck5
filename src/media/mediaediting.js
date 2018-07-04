/**
 * @module media/media/mediaediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import {downcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {modelToViewAttributeConverter, viewFigureToModel} from './converters';
import {toMediaWidget} from './utils';
import {upcastAttributeToAttribute, upcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

/**
 * Media Editing Plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaEditing extends Plugin {
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const t = editor.t;
        const conversion = editor.conversion;

        schema.register('media', {
            allowAttributes: ['alt', 'src'],
            allowWhere: '$block',
            isBlock: true,
            isObject: true
        });

        conversion.for('dataDowncast').add(downcastElementToElement({
            model: 'media',
            view: (modelElement, viewWriter) => createMediaViewElement(viewWriter)
        }));
        conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'media',
            view: (modelElement, viewWriter) => toMediaWidget(createMediaViewElement(viewWriter), viewWriter, t('media widget'))
        }));
        conversion.for('downcast')
            .add(modelToViewAttributeConverter('src'))
            .add(modelToViewAttributeConverter('alt'));
        conversion.for('upcast')
            .add(upcastElementToElement({
                model: (viewMedia, modelWriter) => modelWriter.createElement('media', {src: viewMedia.getAttribute('src')}),
                view: {
                    name: 'img',
                    attributes: {
                        src: true
                    }
                }
            }))
            .add(upcastAttributeToAttribute({
                model: 'alt',
                view: {
                    name: 'img',
                    key: 'alt'
                }
            }))
            .add(viewFigureToModel());
    }
}

/**
 * Creates a view element represeting the media.
 *
 * @private
 *
 * @param {module:engine/view/writer~Writer} viewWriter
 *
 * @returns {module:engine/view/containerelement~ContainerElement}
 */
function createMediaViewElement(viewWriter) {
    const img = viewWriter.createEmptyElement('img');
    const figure = viewWriter.createContainerElement('figure', {class: 'media'});

    viewWriter.insert(ViewPosition.createAt(figure), img);

    return figure;
}
