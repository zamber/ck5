'use strict';

let ed, mod;

switch (process.env.editor) {
    case 'balloon':
        ed = '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
        mod = 'BalloonEditor';
        break;
    case 'classic':
        ed = '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
        mod = 'ClassicEditor';
        break;
    case 'inline':
        ed = '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
        mod = 'InlineEditor';
        break;
    default:
        throw 'Invalid Editor';
}

module.exports = {
    editor: ed,
    moduleName: mod,
    plugins: [
        '@ckeditor/ckeditor5-essentials/src/essentials',
        '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter',
        '@ckeditor/ckeditor5-autoformat/src/autoformat',
        '@ckeditor/ckeditor5-basic-styles/src/bold',
        '@ckeditor/ckeditor5-basic-styles/src/italic',
        '@ckeditor/ckeditor5-basic-styles/src/strikethrough',
        '@ckeditor/ckeditor5-basic-styles/src/underline',
        '@ckeditor/ckeditor5-block-quote/src/blockquote',
        '@ckeditor/ckeditor5-easy-image/src/easyimage',
        '@ckeditor/ckeditor5-heading/src/heading',
        '@ckeditor/ckeditor5-image/src/image',
        '@ckeditor/ckeditor5-image/src/imagecaption',
        '@ckeditor/ckeditor5-image/src/imagestyle',
        '@ckeditor/ckeditor5-image/src/imagetoolbar',
        '@ckeditor/ckeditor5-image/src/imageupload',
        '@ckeditor/ckeditor5-link/src/link',
        '@ckeditor/ckeditor5-list/src/list',
        '@ckeditor/ckeditor5-paragraph/src/paragraph'
    ],
    language: 'de',
    config: {
        toolbar: {
            items: [
                'undo',
                'redo',
                'heading',
                'bold',
                'italic',
                'link',
                'underline',
                'strikethrough',
                'bulletedList',
                'numberedList',
                'blockQuote',
                'imageUpload',
            ]
        },
        image: {
            toolbar: [ 'imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative' ]
        }
    }
};
