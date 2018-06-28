'use strict';

module.exports = {
    editor: '@ckeditor/ckeditor5-editor-classic/src/classiceditor',
    moduleName: 'ClassicEditor',
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
        '@ckeditor/ckeditor5-table/src/tabletoolbar',
        '@akilli/ckeditor5-media/src/media',
        '@akilli/ckeditor5-media/src/mediabrowser',
        '@akilli/ckeditor5-media/src/mediacaption',
        '@akilli/ckeditor5-media/src/mediastyle',
        '@akilli/ckeditor5-media/src/mediatoolbar'
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
                'mediaBrowser',
                'insertTable'
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
            browser: 'browser.html',
            toolbar: ['mediaStyle:alignLeft', 'mediaStyle:full', 'mediaStyle:alignRight', '|', 'mediaTextAlternative'],
            styles: ['full', 'alignLeft', 'alignRight']
        },
        table: {
            toolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
    }
};
