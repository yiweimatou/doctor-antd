import React, { Component, PropTypes } from 'react'
import { Input } from 'antd'


class Item extends Component {

    changeHandler(e) {
        this.props.onChange(e.target.value)
    }
    render() {
        const { editable, content } = this.props
        let result = null
        if (editable) {
            result = (<Input value={content} onChange={this.changeHandler.bind(this)}/>)
        } else {
            result = (<div>{ content }</div>)
        }
        return result
    }
}

Item.propTypes = {
    editable: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
}

export default Item