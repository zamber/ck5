import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaStyleCommand from './mediastylecommand';
import MediaEditing from '../media/mediaediting';
import {viewToModelStyleAttribute, modelToViewStyleAttribute} from './converters';
import {normalizeMediaStyles} from './utils';

export default class MediaStyleEditing extends Plugin {
    static get requires() {
        return [MediaEditing];
    }

    static get pluginName() {
        return 'MediaStyleEditing';
    }

    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const data = editor.data;
        const editing = editor.editing;

        // Define default configuration.
        editor.config.define('media.styles', ['full', 'side']);

        // Get configuration.
        const styles = normalizeMediaStyles(editor.config.get('media.styles'));

        // Allow mediaStyle attribute in media.
        // We could call it 'style' but https://github.com/ckeditor/ckeditor5-engine/issues/559.
        schema.extend('media', {allowAttributes: 'mediaStyle'});

        // Converters for mediaStyle attribute from model to view.
        const modelToViewConverter = modelToViewStyleAttribute(styles);
        editing.downcastDispatcher.on('attribute:mediaStyle:media', modelToViewConverter);
        data.downcastDispatcher.on('attribute:mediaStyle:media', modelToViewConverter);

        // Converter for figure element from view to model.
        data.upcastDispatcher.on('element:figure', viewToModelStyleAttribute(styles), {priority: 'low'});

        // Register mediaStyle command.
        editor.commands.add('mediaStyle', new MediaStyleCommand(editor, styles));
    }
}
