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

            const feat = 'alwaysRaised=yes,dependent=yes,height=' + window.screen.height + ',location=no,menubar=no,' +
                'minimizable=no,modal=yes,resizable=yes,scrollbars=yes,toolbar=no,width=' + window.screen.width;
            const win = window.open(browser, 'mediabrowser', feat);

            window.addEventListener('message', ev => {
                if (ev.origin === win.origin && ev.source === win && !!ev.data.src) {
                    editor.model.insertContent(writer.createElement('media', {src: ev.data.src}), editor.model.document.selection);
                }
            }, false);
        });
    }
}
