import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaUploadEditing from "./mediaupload/mediauploadediting";
import MediaUploadUI from "./mediaupload/mediauploadui";
import MediaUploadProgress from "./mediaupload/mediauploadprogress";

export default class MediaUpload extends Plugin {
    static get requires() {
        return [MediaUploadEditing, MediaUploadUI, MediaUploadProgress];
    }

    static get pluginName() {
        return 'MediaUpload';
    }
}
