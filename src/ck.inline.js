/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import InlineEditorBase from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import AutoformatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockquotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ImagePlugin from '@ckeditor/ckeditor5-image/src/image';
import ImagecaptionPlugin from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImagestylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImagetoolbarPlugin from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import ImageuploadPlugin from '@ckeditor/ckeditor5-upload/src/imageupload';
import ImagebuttonPlugin from '../plugin/image/src/imagebutton';

export default class InlineEditor extends InlineEditorBase {}

InlineEditor.build = {
    plugins: [
        EssentialsPlugin,
        AutoformatPlugin,
        BoldPlugin,
        ItalicPlugin,
        BlockquotePlugin,
        HeadingPlugin,
        ImagePlugin,
        ImagecaptionPlugin,
        ImagestylePlugin,
        ImagetoolbarPlugin,
        LinkPlugin,
        ListPlugin,
        ParagraphPlugin,
        ImageuploadPlugin,
        ImagebuttonPlugin
    ],
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
                'image'
            ]
        },
        image: {
            toolbar: [
                'imageTextAlternative',
                '|',
                'imageStyleAlignLeft',
                'imageStyleFull',
                'imageStyleAlignRight'
            ],
            styles: [
                'imageStyleFull',
                'imageStyleAlignLeft',
                'imageStyleAlignRight'
            ]
        },
        heading: {
            options: [
                {
                    modelElement: 'paragraph',
                    title: 'Paragraph'
                },
                {
                    modelElement: 'heading1',
                    viewElement: 'h1',
                    title: 'Heading 1'
                },
                {
                    modelElement: 'heading2',
                    viewElement: 'h2',
                    title: 'Heading 2'
                },
                {
                    modelElement: 'heading3',
                    viewElement: 'h3',
                    title: 'Heading 3'
                }
            ]
        }
    }
};
