import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import MediaUploadCommand from '../../src/mediaupload/mediauploadcommand';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';
import ModelSelection from '@ckeditor/ckeditor5-engine/src/model/selection';
import {isMediaType, findOptimalInsertionPosition} from '../../src/mediaupload/utils';

export default class MediaUploadEditing extends Plugin {
    static get requires() {
        return [FileRepository, Notification];
    }

    init() {
        const editor = this.editor;
        const doc = editor.model.document;
        const schema = editor.model.schema;
        const fileRepository = editor.plugins.get(FileRepository);

        // Setup schema to allow uploadId and uploadStatus for media.
        schema.extend('media', {
            allowAttributes: ['uploadId', 'uploadStatus']
        });

        // Register mediaUpload command.
        editor.commands.add('mediaUpload', new MediaUploadCommand(editor));

        // Execute mediaUpload command when media is dropped or pasted.
        editor.editing.view.document.on('clipboardInput', (evt, data) => {
            // Skip if non empty HTML data is included.
            // https://github.com/ckeditor/ckeditor5-upload/issues/68
            if (isHtmlIncluded(data.dataTransfer)) {
                return;
            }

            let targetModelSelection = new ModelSelection(
                data.targetRanges.map(viewRange => editor.editing.mapper.toModelRange(viewRange))
            );

            for (const file of data.dataTransfer.files) {
                const insertAt = findOptimalInsertionPosition(targetModelSelection);

                if (isMediaType(file)) {
                    editor.execute('mediaUpload', {file, insertAt});
                    evt.stop();
                }

                // Use target ranges only for the first media. Then, use that media position
                // so we keep adding the next ones after the previous one.
                targetModelSelection = doc.selection;
            }
        });

        // Prevents from browser redirecting to the dropped media.
        editor.editing.view.document.on('dragover', (evt, data) => {
            data.preventDefault();
        });

        doc.on('change', () => {
            const changes = doc.differ.getChanges({includeChangesInGraveyard: true});

            for (const entry of changes) {
                if (entry.type === 'insert' && entry.name === 'media') {
                    const item = entry.position.nodeAfter;
                    const isInGraveyard = entry.position.root.rootName === '$graveyard';

                    // Check if the media element still has upload id.
                    const uploadId = item.getAttribute('uploadId');

                    if (!uploadId) {
                        continue;
                    }

                    // Check if the media is loaded on this client.
                    const loader = fileRepository.loaders.get(uploadId);

                    if (!loader) {
                        continue;
                    }

                    if (isInGraveyard) {
                        // If the media was inserted to the graveyard - abort the loading process.
                        loader.abort();
                    } else if (loader.status === 'idle') {
                        // If the media was inserted into content and has not been loaded, start loading it.
                        this._load(loader, item);
                    }
                }
            }
        });
    }

    _load(loader, mediaElement) {
        const editor = this.editor;
        const model = editor.model;
        const t = editor.locale.t;
        const fileRepository = editor.plugins.get(FileRepository);
        const notification = editor.plugins.get(Notification);

        model.enqueueChange('transparent', writer => {
            writer.setAttribute('uploadStatus', 'reading', mediaElement);
        });

        return loader.read()
            .then(data => {
                const viewFigure = editor.editing.mapper.toViewElement(mediaElement);
                const viewImg = viewFigure.getChild(0);
                const promise = loader.upload();

                editor.editing.view.change(writer => {
                    writer.setAttribute('src', data, viewImg);
                });

                model.enqueueChange('transparent', writer => {
                    writer.setAttribute('uploadStatus', 'uploading', mediaElement);
                });

                return promise;
            })
            .then(data => {
                model.enqueueChange('transparent', writer => {
                    writer.setAttributes({uploadStatus: 'complete', src: data.default}, mediaElement);

                    let maxWidth = 0;
                    const srcsetAttribute = Object.keys(data)
                    // Filter out keys that are not integers.
                        .filter(key => {
                            const width = parseInt(key, 10);

                            if (!isNaN(width)) {
                                maxWidth = Math.max(maxWidth, width);

                                return true;
                            }

                            return false;
                        })

                        // Convert each key to srcset entry.
                        .map(key => `${ data[key] } ${ key }w`)

                        // Join all entries.
                        .join(', ');

                    if (!!srcsetAttribute) {
                        writer.setAttribute('srcset', {
                            data: srcsetAttribute,
                            width: maxWidth
                        }, mediaElement);
                    }
                });

                clean();
            })
            .catch(error => {
                // If status is not 'error' nor 'aborted' - throw error because it means that something else went wrong,
                // it might be generic error and it would be real pain to find what is going on.
                if (loader.status !== 'error' && loader.status !== 'aborted') {
                    throw error;
                }

                // Might be 'aborted'.
                if (loader.status === 'error') {
                    notification.showWarning(error, {
                        title: t('Upload failed'),
                        namespace: 'upload'
                    });
                }

                clean();

                // Permanently remove media from insertion batch.
                model.enqueueChange('transparent', writer => {
                    writer.remove(mediaElement);
                });
            });

        function clean() {
            model.enqueueChange('transparent', writer => {
                writer.removeAttribute('uploadId', mediaElement);
                writer.removeAttribute('uploadStatus', mediaElement);
            });

            fileRepository.destroyLoader(loader);
        }
    }
}

export function isHtmlIncluded(dataTransfer) {
    return Array.from(dataTransfer.types).includes('text/html') && dataTransfer.getData('text/html') !== '';
}
