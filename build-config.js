'use strict';

module.exports = {
    editor: '@ckeditor/ckeditor5-editor-classic/src/classiceditor',
    moduleName: 'ClassicEditor',
    plugins: [
        '@ckeditor/ckeditor5-essentials/src/essentials',
        '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter',
        '@ckeditor/ckeditor5-autoformat/src/autoformat',
        '@ckeditor/ckeditor5-basic-styles/src/bold',
        '@ckeditor/ckeditor5-basic-styles/src/italic',
        '@ckeditor/ckeditor5-block-quote/src/blockquote',
        '@ckeditor/ckeditor5-easy-image/src/easyimage',
        '@ckeditor/ckeditor5-heading/src/heading',
        '@ckeditor/ckeditor5-image/src/image',
        '@ckeditor/ckeditor5-image/src/imagecaption',
        '@ckeditor/ckeditor5-image/src/imagestyle',
        '@ckeditor/ckeditor5-image/src/imagetoolbar',
        '@ckeditor/ckeditor5-link/src/link',
        '@ckeditor/ckeditor5-list/src/list',
        '@ckeditor/ckeditor5-paragraph/src/paragraph',
        '@ckeditor/ckeditor5-upload/src/imageupload',
    ],
    language: 'de',
    config: {
        toolbar: {
            items: [
                'headings',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'blockQuote',
                'undo',
                'redo'
            ]
        },
        image: {
            toolbar: ['imageStyleFull', 'imageStyleSide', '|', 'imageTextAlternative']
        }
    }
};
