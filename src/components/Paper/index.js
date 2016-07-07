import React,{ Component,PropTypes } from 'react'

function getStyles(props){
    const {
        circle,
        rounded
    } = props
    return {
        root:{
            color: 'rgba(0, 0, 0, 0.87)',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
            boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 6px',
            borderRadius: circle ? '50%' : rounded ? '2px' : '0px'
        }
    }
}
class Paper extends Component{
    static propTypes = {
        /**
         * Children passed into the paper element.
         */
        children: PropTypes.node,
        /**
         * Set to true to generate a circlular paper container.
         */
        circle: PropTypes.bool,
        /**
         * By default, the paper container will have a border radius.
         * Set this to false to generate a container with sharp corners.
         */
        rounded: PropTypes.bool
    }
    static defaultProps = {
        circle: false,
        rounded: true
    }
    render(){
        const styles = getStyles(this.props)
        return(
            <div style = {styles.root}>
                {this.props.children}
            </div>
        )
    }
}

export default Paper