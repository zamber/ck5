/**
 * @module media/mediabrowser/mediabrowsercommand
 */
import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * Media Browser Command
 *
 * @extends module:core/command~Command
 */
export default class MediaBrowserCommand extends Command {
    /**
     * @inheritDoc
     */
    execute(options) {
        const editor = this.editor;

        editor.model.change(writer => {
            const browser = editor.config.get('media.browser');

            if (!browser || !browser.length) {
                return;
            }

            const win = window.open(
                browser,
                'browser',
                'location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes'
            );

            window.addEventListener('message', ev => {
                if (ev.origin === win.origin && ev.data.id === 'ckMediaBrowser' && !!ev.data.src) {
                    editor.model.insertContent(writer.createElement('media', {src: ev.data.src}), editor.model.document.selection);
                }
            }, false);
        });
    }
}
