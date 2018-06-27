import MediaEditing from '../media/mediaediting';
import MediaStyleCommand from './mediastylecommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {modelToViewStyleAttribute, viewToModelStyleAttribute} from './converters';
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

        editor.config.define('media.styles', ['full', 'side']);

        const styles = normalizeMediaStyles(editor.config.get('media.styles'));

        schema.extend('media', {allowAttributes: 'mediaStyle'});

        const modelToViewConverter = modelToViewStyleAttribute(styles);

        editing.downcastDispatcher.on('attribute:mediaStyle:media', modelToViewConverter);
        data.downcastDispatcher.on('attribute:mediaStyle:media', modelToViewConverter);
        data.upcastDispatcher.on('element:figure', viewToModelStyleAttribute(styles), {priority: 'low'});
        editor.commands.add('mediaStyle', new MediaStyleCommand(editor, styles));
    }
}
