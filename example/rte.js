'use strict';

(function (document, ClassicEditor, InlineEditor, BalloonEditor) {
    document.addEventListener('DOMContentLoaded', () => {
        const rte = document.querySelector('#rte');

        if (!rte) {
            return;
        }

        let editor;

        if (rte.getAttribute('data-rte') === 'inline') {
            InlineEditor
                .create(rte)
                .then(ed => {
                    editor = ed;
                });
        } else if (rte.getAttribute('data-rte') === 'balloon') {
            BalloonEditor
                .create(rte)
                .then(ed => {
                    editor = ed;
                });
        } else {
            ClassicEditor
                .create(rte)
                .then(ed => {
                    editor = ed;
                });
        }

        const save = document.querySelector('#save');
        save.addEventListener('click', function () {
            console.log(editor.getData());
        });
    });
})(document, ClassicEditor, InlineEditor, BalloonEditor);
