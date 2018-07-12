'use strict';

(function (document, window) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.opener) {
            return;
        }

        document.querySelectorAll('[data-media]').forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-media');

                if (src.length > 0) {
                    window.opener.postMessage({id: 'mediabrowser', src: src}, window.opener.origin);
                    window.close();
                }
            });
        });
    });
})(document, window);
