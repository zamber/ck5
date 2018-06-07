'use strict';

module.exports = {
    editor: '@ckeditor/ckeditor5-editor-inline/src/inlineeditor',
    moduleName: 'InlineEditor',
    plugins: [
        '@ckeditor/ckeditor5-essentials/src/essentials',
        '@ckeditor/ckeditor5-autoformat/src/autoformat',
        '@ckeditor/ckeditor5-heading/src/heading',
        '@ckeditor/ckeditor5-paragraph/src/paragraph',
        '@ckeditor/ckeditor5-basic-styles/src/bold',
        '@ckeditor/ckeditor5-basic-styles/src/italic',
        '@ckeditor/ckeditor5-basic-styles/src/underline',
        '@ckeditor/ckeditor5-link/src/link',
        '@ckeditor/ckeditor5-list/src/list',
        '@ckeditor/ckeditor5-block-quote/src/blockquote',
        '@ckeditor/ckeditor5-table/src/table',
        '@akilli/ckeditor5-details/src/details',
        '@akilli/ckeditor5-media/src/media',
        '@akilli/ckeditor5-media/src/mediacaption',
        '@akilli/ckeditor5-media/src/mediastyle',
        '@akilli/ckeditor5-media/src/mediatoolbar',
        '@akilli/ckeditor5-media/src/mediaupload'
    ],
    config: {
        language: 'de',
        toolbar: {
            items: [
                'undo',
                'redo',
                'heading',
                'bold',
                'italic',
                'underline',
                'link',
                'bulletedList',
                'numberedList',
                'blockQuote',
                'details',
                'mediaUpload',
                'insertTable',
                'insertRowBelow',
                'insertColumnAfter',

            ]
        },
        heading: {
            options: [
                {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                {model: 'heading1', view: 'h2', title: 'Heading 1', class: 'ck-heading_heading1'},
                {model: 'heading2', view: 'h3', title: 'Heading 2', class: 'ck-heading_heading2'}
            ]
        },
        media: {
            toolbar: ['mediaStyle:alignLeft', 'mediaStyle:full', 'mediaStyle:alignRight', '|', 'mediaTextAlternative'],
            styles: ['full', 'alignLeft', 'alignRight']
        }
    }
};
