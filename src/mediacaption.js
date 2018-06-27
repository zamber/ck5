import MediaCaptionEditing from './mediacaption/mediacaptionediting';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import '../theme/mediacaption.css';

export default class MediaCaption extends Plugin {
    static get requires() {
        return [MediaCaptionEditing];
    }

    static get pluginName() {
        return 'MediaCaption';
    }
}
