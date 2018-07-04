/**
 * @module media/mediatoolbar
 */
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ToolbarView from '@ckeditor/ckeditor5-ui/src/toolbar/toolbarview';
import {getBalloonPositionData, isMediaWidgetSelected, repositionContextualBalloon} from './media/utils';

/**
 * Balloon CSS class name
 *
 * @type {string}
 */
const balloonClassName = 'ck-toolbar-container';

/**
 * Media Toolbar Plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaToolbar extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ContextualBalloon];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'MediaToolbar';
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const balloonToolbar = editor.plugins.get('BalloonToolbar');

        if (balloonToolbar) {
            this.listenTo(balloonToolbar, 'show', evt => {
                if (isMediaWidgetSelected(editor.editing.view.document.selection)) {
                    evt.stop();
                }
            }, {priority: 'high'});
        }
    }

    /**
     * @inheritDoc
     */
    afterInit() {
        const editor = this.editor;
        const toolbarConfig = editor.config.get('media.toolbar');

        if (!toolbarConfig || !toolbarConfig.length) {
            return;
        }

        this._balloon = this.editor.plugins.get('ContextualBalloon');
        this._toolbar = new ToolbarView();
        this._toolbar.fillFromConfig(toolbarConfig, editor.ui.componentFactory);

        this.listenTo(editor.editing.view, 'render', () => {
            this._checkIsVisible();
        });

        this.listenTo(editor.ui.focusTracker, 'change:isFocused', () => {
            this._checkIsVisible();
        }, {priority: 'low'});
    }

    /**
     * Checks whether the toolbar should show up or hide depending on the current selection.
     *
     * @private
     */
    _checkIsVisible() {
        const editor = this.editor;

        if (!editor.ui.focusTracker.isFocused) {
            this._hideToolbar();
        } else {
            if (isMediaWidgetSelected(editor.editing.view.document.selection)) {
                this._showToolbar();
            } else {
                this._hideToolbar();
            }
        }
    }

    /**
     * Shows the {@link #_toolbar} in the {@link #_balloon}.
     *
     * @private
     */
    _showToolbar() {
        const editor = this.editor;

        if (this._isVisible) {
            repositionContextualBalloon(editor);
        } else if (!this._balloon.hasView(this._toolbar)) {
            this._balloon.add({
                view: this._toolbar,
                position: getBalloonPositionData(editor),
                balloonClassName
            });
        }
    }

    /**
     * Removes the {@link #_toolbar} from the {@link #_balloon}.
     *
     * @private
     */
    _hideToolbar() {
        if (this._isVisible) {
            this._balloon.remove(this._toolbar);
        }
    }

    /**
     * Returns `true` when the {@link #_toolbar} is the visible view in the {@link #_balloon}.
     *
     * @private
     * @returns {Boolean}
     */
    get _isVisible() {
        return this._balloon.visibleView === this._toolbar;
    }
}
