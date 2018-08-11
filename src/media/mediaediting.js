/**
 * @module media/media/mediaediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import {downcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {modelToViewAttributeConverter, viewFigureToModel} from './converters';
import {getType, getTypeIds, toMediaWidget} from './utils';
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
        const conversion = editor.conversion;
        const types = getTypeIds();

        schema.register('media', {
            allowAttributes: ['alt', 'height', 'src', 'type', 'width'],
            allowWhere: '$block',
            isBlock: true,
            isObject: true
        });

        conversion.for('dataDowncast').add(downcastElementToElement({model: 'media', view: createMediaViewElement}));
        conversion.for('editingDowncast').add(downcastElementToElement({
            model: 'media',
            view: (modelElement, viewWriter) => toMediaWidget(createMediaViewElement(modelElement, viewWriter), viewWriter)
        }));
        ['alt', 'height', 'src', 'width'].forEach(attr => conversion.for('downcast').add(modelToViewAttributeConverter(attr)));

        types.forEach(item => {
            const type = getType(item);
            conversion.for('upcast').add(upcastElementToElement({
                model: (viewMedia, modelWriter) => modelWriter.createElement('media', {src: viewMedia.getAttribute('src'), 'type': type.id}),
                view: {
                    name: type.element,
                    attributes: {
                        src: true
                    }
                }
            }));
        });
        conversion.for('upcast').add(upcastAttributeToAttribute({
            model: 'alt',
                view: {
                    name: 'img',
                    key: 'alt'
                }
        }));
        ['height', 'width'].forEach(attr => {
            types.forEach(item => {
                const type = getType(item);
                conversion.for('upcast').add(upcastAttributeToAttribute({
                    model: attr,
                    view: {
                        name: type.element,
                        key: attr
                    }
                }));
            });
        });
        conversion.for('upcast').add(viewFigureToModel());
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
    const type = getType(modelElement.getAttribute('type'));
    const figure = viewWriter.createContainerElement('figure', {class: type.id});
    let media;

    if (type.id === 'image') {
        media = viewWriter.createEmptyElement(type.element);
    } else if (['audio', 'video'].includes(type.id)) {
        media = viewWriter.createContainerElement(type.element, {controls: 'controls'});
    } else if (type.id === 'iframe') {
        media = viewWriter.createContainerElement(type.element, {allowfullscreen: 'allowfullscreen'});
    }

    viewWriter.insert(ViewPosition.createAt(figure), media);

    return figure;
}
