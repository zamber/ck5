/**
 * @module media/media/mediaediting
 */
import MediaLoadObserver from './medialoadobserver';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { modelToViewAttribute, viewToModel, setConstantTags } from './converters';
import { ChartElementCommand } from './chartElementCommand';
import {getType, getTypeIds, toMediaWidget} from './utils';

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

        const modelTag = 'chart';
        const htmlTag = 'iframe';

        // const types = getTypeIds();

        // Observer

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! POSSIBLE CORE OF THIS ISSUE
        // COMMENTED OUT AS IT'S NOT IN OUR CODEBASE
        // editor.editing.view.addObserver(MediaLoadObserver);

        // Schema
        schema.register('media', {
            allowAttributes: ['height', 'src', 'width'],
            // allowWhere: '$block', ??????????
            allowIn: '$block',
            isBlock: true,
            isObject: true
        });

        // Element
        // conversion.for('upcast').add(viewToModel());
        conversion.for('dataDowncast').elementToElement({
            model: 'media',
            view: createChartViewElementForEditing
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'media',
            view: (element, writer) => createChartViewElementForEditing(element, writer)
        });

        conversion.for('downcast')
        .add(modelToViewAttribute('src'))
        .add(modelToViewAttribute('width'))
        .add(modelToViewAttribute('height'))
        .add(setConstantTags());

        // Upcasting view -> model (ran when instantiating)
        conversion.for('upcast')
        .elementToElement({
            view: {
                name: htmlTag,
                attributes: {
                    src: true
                }
            },
            model: (viewImage, modelWriter) => modelWriter.createElement('media', {
                src: viewImage.getAttribute('src')
            })
        })
        .attributeToAttribute({
            view: {
                name: htmlTag,
                key: 'width'
            },
            model: 'width'
        })
        .attributeToAttribute({
            view: {
                name: htmlTag,
                key: 'height'
            },
            model: 'height'
        })
        .add(viewToModel());

    // command
    const command = 'chart-element';
    editor.commands.add(command, new ChartElementCommand(editor));

        // Attributes
        // types.forEach(item => {
        //     const type = getType(item);
        //     conversion.for('upcast').elementToElement({
        //         model: (element, writer) => writer.createElement('media', {src: element.getAttribute('src'), 'type': type.id}),
        //         view: {
        //             name: type.element,
        //             attributes: {
        //                 src: true
        //             }
        //         }
        //     });
        // });
        // conversion.for('upcast').attributeToAttribute({
        //     model: 'alt',
        //         view: {
        //             name: 'img',
        //             key: 'alt'
        //         }
        // });
        // ['height', 'width'].forEach(attr => {
        //     types.forEach(item => {
        //         const type = getType(item);
        //         conversion.for('upcast').attributeToAttribute({
        //             model: attr,
        //             view: {
        //                 name: type.element,
        //                 key: attr
        //             }
        //         });
        //     });
        // });
        // ['alt', 'height', 'src', 'width'].forEach(attr => conversion.for('downcast').add(modelToViewAttribute(attr)));
    }
}

export function createChartViewElementForEditing(modelElement, viewWriter) {
    // store stuff
    const shouldEditingBeDisabled = false;
    return (
        shouldEditingBeDisabled
            ? createChartViewElement(viewWriter)
            : toChartWidget(createChartViewElement(viewWriter), viewWriter)
    );
}

// our shitty solution
export function createChartViewElement(writer) {
    const emptyElement = writer.createEmptyElement('iframe');
    const figure = writer.createContainerElement('media', { class: 'chart chart-element chart-element--center' });

    writer.insert(writer.createPositionAt(figure, 0), emptyElement);
    return figure;
}


/**
 * Creates a view element represeting the media.
 *
 * @private
 *
 * @param {module:engine/model/element~Element} element
 * @param {module:engine/view/downcastwriter~DowncastWriter} writer
 *
 * @returns {module:engine/view/containerelement~ContainerElement}
 */


// function createMediaViewElement(element, writer) {
//     const type = getType(element.getAttribute('type'));
//     const figure = writer.createContainerElement('figure', {class: type.id});
//     let media;

//     if (type.id === 'image') {
//         media = writer.createEmptyElement(type.element);
//     } else if (['audio', 'video'].includes(type.id)) {
//         media = writer.createContainerElement(type.element, {controls: 'controls'});
//     } else if (type.id === 'iframe') {
//         media = writer.createContainerElement(type.element, {allowfullscreen: 'allowfullscreen'});
//     }

//     writer.insert(writer.createPositionAt(figure, 0), media);

//     return figure;
// }
