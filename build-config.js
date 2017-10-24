'use strict';

var ed, mod;

if (process.env.editor === 'inline') {
    ed = '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
    mod = 'InlineEditor';
} else if (process.env.editor === 'balloon') {
    ed = '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
    mod = 'BalloonEditor';
} else {
    ed = '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    mod = 'ClassicEditor';
}

module.exports = {
    editor: ed,
    moduleName: mod,
    plugins: [
        '@ckeditor/ckeditor5-essentials/src/essentials',
        '@ckeditor/ckeditor5-autoformat/src/autoformat',
        '@ckeditor/ckeditor5-basic-styles/src/bold',
        '@ckeditor/ckeditor5-basic-styles/src/italic',
        '@ckeditor/ckeditor5-block-quote/src/blockquote',
        '@ckeditor/ckeditor5-heading/src/heading',
        '@ckeditor/ckeditor5-image/src/image',
        '@ckeditor/ckeditor5-image/src/imagecaption',
        '@ckeditor/ckeditor5-image/src/imagestyle',
        '@ckeditor/ckeditor5-image/src/imagetoolbar',
        '@ckeditor/ckeditor5-link/src/link',
        '@ckeditor/ckeditor5-list/src/list',
        '@ckeditor/ckeditor5-paragraph/src/paragraph',
        '@ckeditor/ckeditor5-upload/src/imageupload',
        '../plugin/media/src/media',
    ],
    language: 'de',
    config: {
        toolbar: {
            items: [
                'undo',
                'redo',
                'headings',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'blockQuote',
                'media'
            ]
        },
        image: {
            toolbar: ['imageTextAlternative', '|', 'imageStyleAlignLeft', 'imageStyleFull', 'imageStyleAlignRight'],
            styles: ['imageStyleFull', 'imageStyleAlignLeft', 'imageStyleAlignRight']
        },
        heading: {
            options: [
                {modelElement: 'paragraph', title: 'Paragraph'},
                {modelElement: 'heading1', viewElement: 'h1', title: 'Heading 1'},
                {modelElement: 'heading2', viewElement: 'h2', title: 'Heading 2'},
                {modelElement: 'heading3', viewElement: 'h3', title: 'Heading 3'}
            ]
        }
    }
};
