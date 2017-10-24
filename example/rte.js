'use strict';

(function (document, ClassicEditor, InlineEditor, BalloonEditor) {
    document.addEventListener('DOMContentLoaded', () => {
        const rte = document.querySelectorAll('.rte');

        for (let i = 0; i < rte.length; i++) {
            if (rte[i].getAttribute('data-rte') === 'inline') {
                InlineEditor.create(rte[i]);
            } else if (rte[i].getAttribute('data-rte') === 'balloon') {
                BalloonEditor.create(rte[i]);
            } else {
                ClassicEditor.create(rte[i]);
            }
        }
    });
})(document, ClassicEditor, InlineEditor, BalloonEditor);
