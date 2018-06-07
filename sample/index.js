'use strict';

(function (document, BalloonEditor) {
    document.addEventListener('DOMContentLoaded', () => {
        let editor;

        BalloonEditor
            .create(document.querySelector('#rte'))
            .then(ed => {
                editor = ed;
                console.log(ed);
            });
        document.querySelector('#save').addEventListener('click', function () {
            console.log(editor.getData());
        });
    });
})(document, BalloonEditor);
