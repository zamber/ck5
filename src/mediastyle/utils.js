import centerIcon from '@ckeditor/ckeditor5-core/theme/icons/object-center.svg';
import fullWidthIcon from '@ckeditor/ckeditor5-core/theme/icons/object-full-width.svg';
import leftIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left.svg';
import log from '@ckeditor/ckeditor5-utils/src/log';
import rightIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';

const defaultStyles = {
    full: {
        name: 'full',
        title: 'Full size media',
        icon: fullWidthIcon,
        isDefault: true
    },
    side: {
        name: 'side',
        title: 'Side media',
        icon: rightIcon,
        className: 'media-style-side'
    },
    alignLeft: {
        name: 'alignLeft',
        title: 'Left aligned media',
        icon: leftIcon,
        className: 'media-style-align-left'
    },
    alignCenter: {
        name: 'alignCenter',
        title: 'Centered media',
        icon: centerIcon,
        className: 'media-style-align-center'
    },
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
    if (typeof style === 'string') {
        const styleName = style;

        if (defaultStyles[styleName]) {
            style = Object.assign({}, defaultStyles[styleName]);
        } else {
            log.warn(
                'media-style-not-found: There is no such media style of given name.',
                {name: styleName}
            );

            style = {
                name: styleName
            };
        }
    } else if (defaultStyles[style.name]) {
        const defaultStyle = defaultStyles[style.name];
        const extendedStyle = Object.assign({}, style);

        for (const prop in defaultStyle) {
            if (!style.hasOwnProperty(prop)) {
                extendedStyle[prop] = defaultStyle[prop];
            }
        }

        style = extendedStyle;
    }

    if (typeof style.icon === 'string' && defaultIcons[style.icon]) {
        style.icon = defaultIcons[style.icon];
    }

    return style;
}
