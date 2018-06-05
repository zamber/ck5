import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ToolbarView from '@ckeditor/ckeditor5-ui/src/toolbar/toolbarview';
import {isMediaWidgetSelected} from './media/utils';
import {repositionContextualBalloon, getBalloonPositionData} from './media/ui/utils';

const balloonClassName = 'ck-toolbar-container';

export default class MediaToolbar extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    static get pluginName() {
        return 'MediaToolbar';
    }

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

    _hideToolbar() {
        if (this._isVisible) {
            this._balloon.remove(this._toolbar);
        }
    }

    get _isVisible() {
        return this._balloon.visibleView === this._toolbar;
    }
}
