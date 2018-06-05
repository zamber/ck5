import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import {
    viewFigureToModel,
    modelToViewAttributeConverter,
    srcsetAttributeConverter
} from './converters';

import {toMediaWidget} from './utils';
import {downcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {
    upcastElementToElement,
    upcastAttributeToAttribute
} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';

export default class MediaEditing extends Plugin {
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const t = editor.t;
        const conversion = editor.conversion;

        // Configure schema.
        schema.register('media', {
            isObject: true,
            isBlock: true,
            allowWhere: '$block',
            allowAttributes: ['alt', 'src', 'srcset']
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
            .add(modelToViewAttributeConverter('alt'))
            .add(srcsetAttributeConverter());

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
            .add(upcastAttributeToAttribute({
                view: {
                    name: 'img',
                    key: 'srcset'
                },
                model: {
                    key: 'srcset',
                    value: viewMedia => {
                        const value = {
                            data: viewMedia.getAttribute('srcset')
                        };

                        if (viewMedia.hasAttribute('width')) {
                            value.width = viewMedia.getAttribute('width');
                        }

                        return value;
                    }
                }
            }))
            .add(viewFigureToModel());
    }
}

export function createMediaViewElement(writer) {
    const emptyElement = writer.createEmptyElement('img');
    const figure = writer.createContainerElement('figure', {class: 'media'});

    writer.insert(ViewPosition.createAt(figure), emptyElement);

    return figure;
}
