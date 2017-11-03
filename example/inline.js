'use strict';

(function (document, InlineEditor) {
    document.addEventListener('DOMContentLoaded', () => {
        const save = document.querySelector('#save');
        const rte = document.querySelector('#rte');
        let editor;

        if (!rte) {
            return;
        }

        InlineEditor
            .create(rte)
            .then(ed => {
                editor = ed;
            });
        save.addEventListener('click', function () {
            console.log(editor.getData());
        });
    });
})(document, InlineEditor);
