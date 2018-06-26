'use strict';

(function (document, ClassicEditor) {
    document.addEventListener('DOMContentLoaded', () => {
        let editor;

        ClassicEditor
            .create(document.querySelector('#rte'))
            .then(ed => {
                editor = ed;
                console.log(ed);
            });
        document.querySelector('#save').addEventListener('click', function () {
            console.log(editor.getData());
        });
    });
})(document, ClassicEditor);
