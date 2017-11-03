'use strict';

(function (document, BalloonEditor) {
    document.addEventListener('DOMContentLoaded', () => {
        const save = document.querySelector('#save');
        const rte = document.querySelector('#rte');
        let editor;

        if (!rte) {
            return;
        }

        BalloonEditor
            .create(rte)
            .then(ed => {
                editor = ed;
                console.log(ed);
            });
        save.addEventListener('click', function () {
            console.log(editor.getData());
        });
    });
})(document, BalloonEditor);
