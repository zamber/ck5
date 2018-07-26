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
            allowAttributes: ['alt', 'src', 'type'],
            allowWhere: '$block',
            isBlock: true,
            isObject: true
        });

        conversion.for('dataDowncast').add(downcastElementToElement({
            model: 'media',
            view: createMediaViewElement
        }));
        conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'media',
            view: (modelElement, viewWriter) => toMediaWidget(createMediaViewElement(modelElement, viewWriter), viewWriter, t('media widget'))
        }));
        conversion.for('downcast')
            .add(modelToViewAttributeConverter('src'))
            .add(modelToViewAttributeConverter('alt'));
        conversion.for('upcast')
            .add(upcastElementToElement({
                model: (viewMedia, modelWriter) => modelWriter.createElement('media', {src: viewMedia.getAttribute('src'), 'type': 'audio'}),
                view: {
                    name: 'audio',
                    attributes: {
                        src: true
                    }
                }
            }))
            .add(upcastElementToElement({
                model: (viewMedia, modelWriter) => modelWriter.createElement('media', {src: viewMedia.getAttribute('src'), 'type': 'iframe'}),
                view: {
                    name: 'iframe',
                    attributes: {
                        src: true
                    }
                }
            }))
            .add(upcastElementToElement({
                model: (viewMedia, modelWriter) => modelWriter.createElement('media', {src: viewMedia.getAttribute('src'), 'type': 'image'}),
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
            .add(upcastElementToElement({
                model: (viewMedia, modelWriter) => modelWriter.createElement('media', {src: viewMedia.getAttribute('src'), 'type': 'video'}),
                view: {
                    name: 'video',
                    attributes: {
                        src: true
                    }
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
 * @param {module:engine/model/element~Element} modelElement
 * @param {module:engine/view/writer~Writer} viewWriter
 *
 * @returns {module:engine/view/containerelement~ContainerElement}
 */
function createMediaViewElement(modelElement, viewWriter) {
    const type = modelElement.getAttribute('type');
    const figure = viewWriter.createContainerElement('figure', {class: 'media ' + type});
    const media = viewWriter.createEmptyElement(type === 'image' ? 'img' : type);

    viewWriter.insert(ViewPosition.createAt(figure), media);

    return figure;
}
