/**
 * @module media/mediatextalternative/mediatextalternativeui
 */
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import MediaTextAlternativeForm from './mediatextalternativeform';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import {getBalloonPositionData, isMediaWidgetSelected, repositionContextualBalloon} from '../media/utils';
import textAlternativeIcon from '@ckeditor/ckeditor5-core/theme/icons/low-vision.svg';

/**
 * Media Text Alternative UI Plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaTextAlternativeUI extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ContextualBalloon];
    }

    /**
     * @inheritDoc
     */
    init() {
        this._createButton();
        this._createForm();
    }

    /**
     * Creates a button showing the balloon panel for changing the media text alternative and registers it in the editor
     * {@link module:ui/componentfactory~ComponentFactory ComponentFactory}.
     *
     * @private
     */
    _createButton() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add('mediaTextAlternative', locale => {
            const command = editor.commands.get('mediaTextAlternative');
            const view = new ButtonView(locale);

            view.set({
                label: t('Change media text alternative'),
                icon: textAlternativeIcon,
                tooltip: true
            });

            view.bind('isEnabled').to(command, 'isEnabled');

            this.listenTo(view, 'execute', () => this._showForm());

            return view;
        });
    }

    /**
     * Creates the form view
     *
     * @private
     */
    _createForm() {
        const editor = this.editor;
        const view = editor.editing.view;
        const viewDocument = view.document;

        this._balloon = this.editor.plugins.get('ContextualBalloon');
        this._form = new MediaTextAlternativeForm(editor.locale);
        this._form.render();
        this.listenTo(this._form, 'submit', () => {
            editor.execute('mediaTextAlternative', {
                newValue: this._form.labeledInput.inputView.element.value
            });

            this._hideForm(true);
        });
        this.listenTo(this._form, 'cancel', () => {
            this._hideForm(true);
        });
        this._form.keystrokes.set('Esc', (data, cancel) => {
            this._hideForm(true);
            cancel();
        });
        this.listenTo(view, 'render', () => {
            if (!isMediaWidgetSelected(viewDocument.selection)) {
                this._hideForm(true);
            } else if (this._isVisible) {
                repositionContextualBalloon(editor);
            }
        });
        clickOutsideHandler({
            emitter: this._form,
            activator: () => this._isVisible,
            contextElements: [this._form.element],
            callback: () => this._hideForm()
        });
    }

    /**
     * Shows the {@link #_form} in the {@link #_balloon}.
     *
     * @private
     */
    _showForm() {
        if (this._isVisible) {
            return;
        }

        const editor = this.editor;
        const command = editor.commands.get('mediaTextAlternative');
        const labeledInput = this._form.labeledInput;

        if (!this._balloon.hasView(this._form)) {
            this._balloon.add({
                view: this._form,
                position: getBalloonPositionData(editor)
            });
        }

        labeledInput.inputView.element.value = command.value || '';
        labeledInput.value = labeledInput.inputView.element.value;

        this._form.labeledInput.select();
    }

    /**
     * Removes the {@link #_form} from the {@link #_balloon}.
     *
     * @private
     *
     * @param {Boolean} [focusEditable=false] Controls whether the editing view is focused afterwards.
     */
    _hideForm(focusEditable) {
        if (!this._isVisible) {
            return;
        }

        this._balloon.remove(this._form);

        if (focusEditable) {
            this.editor.editing.view.focus();
        }
    }

    /**
     * @private
     *
     * @returns {Boolean}
     */
    get _isVisible() {
        return this._balloon.visibleView === this._form;
    }
}
