import React, { Component } from 'react'
import Quill from 'quill'

class ReactQuill extends Component {
    componentDidMount() {
        new Quill('#editor', {
            modules: {
                toolbar: '#toolbar'
            }
        })
    }
    render() {
        return (
            <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                <div id="toolbar">
                    <button className="ql-bold"></button>
                    <button className="ql-italic"></button>
                </div>
                <div className="quill-contents" style={{ height: 200 }} id="editor"></div>
            </div>
        )
    }
}

export default ReactQuill