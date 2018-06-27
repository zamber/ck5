/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import AutoformatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
import BlockquotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import TablePlugin from '@ckeditor/ckeditor5-table/src/table';
import TabletoolbarPlugin from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import MediaPlugin from '../src/media';
import MediacaptionPlugin from '../src/mediacaption';
import MediastylePlugin from '../src/mediastyle';
import MediatoolbarPlugin from '../src/mediatoolbar';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.build = {
    plugins: [
        EssentialsPlugin,
        AutoformatPlugin,
        HeadingPlugin,
        ParagraphPlugin,
        BoldPlugin,
        ItalicPlugin,
        UnderlinePlugin,
        LinkPlugin,
        ListPlugin,
        BlockquotePlugin,
        TablePlugin,
        TabletoolbarPlugin,
        MediaPlugin,
        MediacaptionPlugin,
        MediastylePlugin,
        MediatoolbarPlugin
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
                'insertTable'
            ]
        },
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
        media: {
            toolbar: [
                'mediaStyle:alignLeft',
                'mediaStyle:full',
                'mediaStyle:alignRight',
                '|',
                'mediaTextAlternative'
            ],
            styles: [
                'full',
                'alignLeft',
                'alignRight'
            ]
        },
        table: {
            toolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        }
    }
};
