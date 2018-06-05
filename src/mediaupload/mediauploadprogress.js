import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import uploadingPlaceholder from '../../theme/icons/media_placeholder.svg';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import ViewRange from '@ckeditor/ckeditor5-engine/src/view/range';

import '../../theme/mediauploadprogress.css';

export default class MediaUploadProgress extends Plugin {
    constructor(editor) {
        super(editor);

        this.placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(uploadingPlaceholder);
    }

    init() {
        const editor = this.editor;

        // Upload status change - update media's view according to that status.
        editor.editing.downcastDispatcher.on('attribute:uploadStatus:media', (...args) => this.uploadStatusChange(...args));
    }

    uploadStatusChange(evt, data, conversionApi) {
        const editor = this.editor;
        const modelMedia = data.item;
        const uploadId = modelMedia.getAttribute('uploadId');

        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }

        const fileRepository = editor.plugins.get(FileRepository);
        const status = uploadId ? data.attributeNewValue : null;
        const placeholder = this.placeholder;
        const viewFigure = editor.editing.mapper.toViewElement(modelMedia);
        const viewWriter = conversionApi.writer;

        if (status === 'reading') {
            // Start "appearing" effect and show placeholder with infinite progress bar on the top
            // while media is read from disk.
            _startAppearEffect(viewFigure, viewWriter);
            _showPlaceholder(placeholder, viewFigure, viewWriter);

            return;
        }

        // Show progress bar on the top of the media when media is uploading.
        if (status === 'uploading') {
            const loader = fileRepository.loaders.get(uploadId);

            _startAppearEffect(viewFigure, viewWriter);

            if (!loader) {
                // There is no loader associated with uploadId - this means that media came from external changes.
                // In such cases we still want to show the placeholder until media is fully uploaded.
                _showPlaceholder(placeholder, viewFigure, viewWriter);
            } else {
                // Hide placeholder and initialize progress bar showing upload progress.
                _hidePlaceholder(viewFigure, viewWriter);
                _showProgressBar(viewFigure, viewWriter, loader, editor.editing.view);
            }

            return;
        }

        // Clean up.
        _hideProgressBar(viewFigure, viewWriter);
        _hidePlaceholder(viewFigure, viewWriter);
        _stopAppearEffect(viewFigure, viewWriter);
    }
}

// Symbol added to progress bar UIElement to distinguish it from other elements.
const progressBarSymbol = Symbol('progress-bar');

function _startAppearEffect(viewFigure, writer) {
    if (!viewFigure.hasClass('ck-appear')) {
        writer.addClass('ck-appear', viewFigure);
    }
}

function _stopAppearEffect(viewFigure, writer) {
    writer.removeClass('ck-appear', viewFigure);
}

function _showPlaceholder(placeholder, viewFigure, writer) {
    if (!viewFigure.hasClass('ck-media-upload-placeholder')) {
        writer.addClass('ck-media-upload-placeholder', viewFigure);
    }

    if (!viewFigure.hasClass('ck-infinite-progress')) {
        writer.addClass('ck-infinite-progress', viewFigure);
    }

    const viewImg = viewFigure.getChild(0);

    if (viewImg.getAttribute('src') !== placeholder) {
        writer.setAttribute('src', placeholder, viewImg);
    }
}

function _hidePlaceholder(viewFigure, writer) {
    if (viewFigure.hasClass('ck-media-upload-placeholder')) {
        writer.removeClass('ck-media-upload-placeholder', viewFigure);
    }

    if (viewFigure.hasClass('ck-infinite-progress')) {
        writer.removeClass('ck-infinite-progress', viewFigure);
    }
}

function _showProgressBar(viewFigure, writer, loader, view) {
    const progressBar = createProgressBar(writer);
    writer.insert(ViewPosition.createAt(viewFigure, 'end'), progressBar);

    // Update progress bar width when uploadedPercent is changed.
    loader.on('change:uploadedPercent', (evt, name, value) => {
        view.change(writer => {
            writer.setStyle('width', value + '%', progressBar);
        });
    });
}

function _hideProgressBar(viewFigure, writer) {
    const progressBar = getProgressBar(viewFigure);

    if (progressBar) {
        writer.remove(ViewRange.createOn(progressBar));
    }
}

function createProgressBar(writer) {
    const progressBar = writer.createUIElement('div', {class: 'ck-progress-bar'});
    writer.setCustomProperty(progressBarSymbol, true, progressBar);

    return progressBar;
}

function getProgressBar(mediaFigure) {
    for (const child of mediaFigure.getChildren()) {
        if (child.getCustomProperty(progressBarSymbol)) {
            return child;
        }
    }

    return null;
}
