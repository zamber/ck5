import log from '@ckeditor/ckeditor5-utils/src/log';

import centerIcon from '@ckeditor/ckeditor5-core/theme/icons/object-center.svg';
import fullWidthIcon from '@ckeditor/ckeditor5-core/theme/icons/object-full-width.svg';
import leftIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left.svg';
import rightIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';

const defaultStyles = {
    // This option is equal to the situation when no style is applied.
    full: {
        name: 'full',
        title: 'Full size media',
        icon: fullWidthIcon,
        isDefault: true
    },

    // This represents a side media.
    side: {
        name: 'side',
        title: 'Side media',
        icon: rightIcon,
        className: 'media-style-side'
    },

    // This style represents an media aligned to the left.
    alignLeft: {
        name: 'alignLeft',
        title: 'Left aligned media',
        icon: leftIcon,
        className: 'media-style-align-left'
    },

    // This style represents a centered media.
    alignCenter: {
        name: 'alignCenter',
        title: 'Centered media',
        icon: centerIcon,
        className: 'media-style-align-center'
    },

    // This style represents an media aligned to the right.
    alignRight: {
        name: 'alignRight',
        title: 'Right aligned media',
        icon: rightIcon,
        className: 'media-style-align-right'
    }
};

const defaultIcons = {
    full: fullWidthIcon,
    left: leftIcon,
    right: rightIcon,
    center: centerIcon
};

export function normalizeMediaStyles(configuredStyles = []) {
    return configuredStyles
        .map(_normalizeStyle)
        .map(style => Object.assign({}, style));
}

function _normalizeStyle(style) {
    // Just the name of the style has been passed.
    if (typeof style === 'string') {
        const styleName = style;

        // If it's one of the defaults, just use it.
        if (defaultStyles[styleName]) {
            // Clone the style to avoid overriding defaults.
            style = Object.assign({}, defaultStyles[styleName]);
        } else {
            // If it's just a name but none of the defaults, warn because probably it's a mistake.
            log.warn(
                'media-style-not-found: There is no such media style of given name.',
                {name: styleName}
            );

            // Normalize the style anyway to prevent errors.
            style = {
                name: styleName
            };
        }
    } else if (defaultStyles[style.name]) {
        // If an object style has been passed and if the name matches one of the defaults,
        // extend it with defaults – the user wants to customize a default style.
        // Note: Don't override the user–defined style object, clone it instead.
        const defaultStyle = defaultStyles[style.name];
        const extendedStyle = Object.assign({}, style);

        for (const prop in defaultStyle) {
            if (!style.hasOwnProperty(prop)) {
                extendedStyle[prop] = defaultStyle[prop];
            }
        }

        style = extendedStyle;
    }

    // If an icon is defined as a string and correspond with a name
    // in default icons, use the default icon provided by the plugin.
    if (typeof style.icon === 'string' && defaultIcons[style.icon]) {
        style.icon = defaultIcons[style.icon];
    }

    return style;
}
