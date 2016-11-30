import React, { Component } from 'react'
import { EditorState } from 'draft-js'
import { Editor } from 'draft-extend'
import { convertFromHTML, convertToHTML } from 'draft-convert'
import plugins from './plugins'
// import './index.css'

const EditorWithPlugins = plugins(Editor)
const toHTML = plugins(convertToHTML)
const fromHTML = plugins(convertFromHTML)
const create = EditorState.createWithContent
class DraftEditor extends Component {
    render() {
        const { editorState, onChange, placeholder } = this.props
        return (
            <EditorWithPlugins
                editorState={editorState}
                onChange={onChange}
                placeholder={placeholder}
            />
        )
    }
}

export default DraftEditor
export { toHTML, fromHTML, create }
