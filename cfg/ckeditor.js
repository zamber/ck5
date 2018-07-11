import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import EditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Media from '../src/media';
import MediaBrowser from '../src/mediabrowser';
import MediaCaption from '../src/mediacaption';
import MediaStyle from '../src/mediastyle';
import MediaToolbar from '../src/mediatoolbar';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';

export default class Editor extends EditorBase {
}

Editor.build = {};
Editor.build.plugins = [
    Autoformat,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Italic,
    Link,
    List,
    Media,
    MediaBrowser,
    MediaCaption,
    MediaStyle,
    MediaToolbar,
    Paragraph,
    Table,
    TableToolbar,
    Underline
];
Editor.build.config = {
    heading: {
        options: [
            {
                model: 'paragraph',
                title: 'Paragraph',
                'class': 'ck-heading_paragraph'
            },
            {
                model: 'heading1',
                view: 'h2',
                title: 'Heading 1',
                'class': 'ck-heading_heading1'
            },
            {
                model: 'heading2',
                view: 'h3',
                title: 'Heading 2',
                'class': 'ck-heading_heading2'
            }
        ]
    },
    language: 'de',
    media: {
        browser: 'browser.html',
        styles: [
            'full',
            'alignLeft',
            'alignRight'
        ],
        toolbar: [
            'mediaStyle:alignLeft',
            'mediaStyle:full',
            'mediaStyle:alignRight',
            '|',
            'mediaTextAlternative'
        ]
    },
    table: {
        toolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    },
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
    }
};
