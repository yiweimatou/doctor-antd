import React, {
    Component,
    PropTypes
} from 'react'

function getStyles(props) {
    const {
        backgroundColor,
        color,
        size,
        src
    } = props

    const avatar = {
        color: '#00bcd4',
        backgroundColor: 'white'
    }
    const styles = {
        root: {
            color: color || avatar.color,
            backgroundColor: backgroundColor || avatar.backgroundColor,
            userSelect: 'none',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: `${size}px`,
            fontSize: size / 2,
            borderRadius: '50%',
            height: size,
            width: size,
        },
        icon: {
            color: color || avatar.color,
            width: size * 0.6,
            height: size * 0.6,
            fontSize: size * 0.6,
            margin: size * 0.2,
        },
    }

    if (src) {
        Object.assign(styles.root, {
            background: `url(${src})`,
            backgroundSize: size,
            backgroundOrigin: 'border-box',
            border: 'solid 1px rgba(128, 128, 128, 0.15)',
            height: size - 2,
            width: size - 2
        })
    }

    return styles
}
class Avatar extends Component {
    static propTypes = {
        /**
         * The backgroundColor of the avatar. Does not apply to image avatars.
         */
        backgroundColor: PropTypes.string,
        /**
         * Can be used, for instance, to render a letter inside the avatar.
         */
        children: PropTypes.node,
        /**
         * The css class name of the root `div` or `img` element.
         */
        className: PropTypes.string,
        /**
         * The icon or letter's color.
         */
        color: PropTypes.string,
        /**
         * This is the SvgIcon or FontIcon to be used inside the avatar.
         */
        icon: PropTypes.element,
        /**
         * This is the size of the avatar in pixels.
         */
        size: PropTypes.number,
        /**
         * If passed in, this component will render an img element. Otherwise, a div will be rendered.
         */
        src: PropTypes.string,
        /**
         * Override the inline-styles of the root element.
         */
        style: PropTypes.object,
    }
    static defaultProps = {
        size: 40,
    }
    render() {
        const {
            icon,
            src,
            style,
            className,
            ...other,
        } = this.props
        const styles = getStyles(this.props)
        if(src){
            return (
                <div 
                    style = {
                        styles.root
                    }
                    {...other}
                    className= {className}
                />
            )
        }else {
            return (
                <div
                    {...other}
                    style={(Object.assign(styles.root, style))}
                    className={className}
                >
                {
                    icon && React.cloneElement(icon, {
                        color: styles.icon.color,
                        style: Object.assign(styles.icon, icon.props.style),
                    })
                }
                {this.props.children}
                </div>
            )
        }
    }
}

export default Avatar