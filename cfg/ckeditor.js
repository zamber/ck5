import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Details from '../src/details';
import EditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

export default class Editor extends EditorBase {
}

Editor.builtinPlugins = [
    Autoformat,
    BlockQuote,
    Bold,
    Details,
    Essentials,
    Heading,
    Italic,
    Link,
    List,
    Paragraph,
    Table,
    TableToolbar
];
Editor.defaultConfig = {
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
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            'details',
            'insertTable'
        ]
    }
};
