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
            isObject: true,
            isBlock: true,
            allowWhere: '$block',
            allowAttributes: ['alt', 'src']
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
                view: {
                    name: 'img',
                    attributes: {
                        src: true
                    }
                },
                model: (viewMedia, modelWriter) => modelWriter.createElement('media', {src: viewMedia.getAttribute('src')})
            }))
            .add(upcastAttributeToAttribute({
                view: {
                    name: 'img',
                    key: 'alt'
                },
                model: 'alt'
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
