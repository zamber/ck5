# ckeditor5-media

This media widget for CKEditor 5 can embed image (`<img>`), audio (`<audio>`), video (`<video>`) and iframe (`<iframe>`) elements wrapped within a figure (`<figure>`) element and optionally with a caption (`<figcaption>`). It also provides a minimal API to integrate a media browser by the use of the [window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) function.

This widget will add the CSS class `media` and one of `image`, `audio`, `video` or `iframe` to the figure element. It also supports alignment by setting an appropriate CSS class (`left` or `right`) and attributes `width`, `height` and `alt`. The `controls`(audio and video) and `allowfullscreen` (iframe) are automatically set. 

## Media Browser

You can implement your media browser as you wish, the only two requirements are that you configure the URL to your media browser as `media.browser` p.e.

    const editorConfig = {
        ...
        media: {
            ...
            browser: '/url/to/mediabrowser',
            ...
        },
        ...
    })

and that your media browser notifies the editor by posting a message p.e. like

    // NOTE: window.opener.origin is only accessible on the same domain
    window.opener.postMessage({
        alt: 'Optional alternative text',
        src: '/url/to/media'
    }, window.opener.origin);

## Examples

You can see this plugin and a minimalistic media browser in action with

1. [CKEditor 5 Balloon](https://akilli.github.io/rte/ck5-balloon/)
2. [CKEditor 5 Classic](https://akilli.github.io/rte/ck5-classic/)
3. [CKEditor 5 Inline](https://akilli.github.io/rte/ck5-inline/)


You can find source code of the minimalistic media browser example @ https://github.com/akilli/rte/tree/master/browser 
