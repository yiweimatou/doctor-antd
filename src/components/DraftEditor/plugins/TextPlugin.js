import React, { Component } from 'react'
import TextSelect from '../../Resource/Text/Select'
import { Entity, Modifier, EditorState } from 'draft-js'
import { createPlugin, pluginUtils } from 'draft-extend'
import { Button, Modal, message } from 'antd'
import { TEXT } from '../../../constants/api'
import './index.css'

class text extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            record: null
        }
    }
    toggleVisible = () => this.setState({ visible: !this.state.visible })
    okHandler = () => {
        const { record } = this.state
        if (record) {
            const { editorState, onChange } = this.props
            const contentState = Modifier.insertText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                record.title,
                null,
                Entity.create(
                    'TEXT',
                    'IMMUTABLE',
                    {
                        title: record.title,
                        descript: record.descript,
                        name: 'text'
                    }
                )
            );
            onChange(
                EditorState.push(
                    editorState,
                    contentState,
                    'apply-entity'
                )
            )
            this.toggleVisible()
        } else {
            message.warn('请至少选择一项！')
        }
    }
    render() {
        const { visible } = this.state
        return (
            <div>
                <Modal
                    visible={visible}
                    title="选择名词"
                    onOk={this.okHandler}
                    onCancel={this.toggleVisible}
                    maskClosable={false}
                >
                    <TextSelect category={TEXT} onChange={val => this.setState({ record: val })} />
                </Modal>
                <Button onClick={() => this.setState({ visible: true })}>添加名词</Button>
            </div>
        )
    }
}

const keys = []
const TextDecorator = {
    strategy: pluginUtils.entityStrategy('TEXT'),
    component: (props) => {
        if (keys.indexOf(props.entityKey) > -1) {
            return (null)
        } else {
            keys.push(props.entityKey)
        }
        const entity = Entity.get(props.entityKey)
        
        const { name, title, descript } = entity.getData()
        return (
            <div className="textStyle" name={name}>
                <div>{title}</div>
                <span>{descript}</span>
            </div>
        )
    }
}

const htmlToEntity = (nodeName, node) => {
    if (nodeName === 'div' && node.getAttribute('class') === 'textStyle') {
        return Entity.create(
            'TEXT',
            'IMMUTABLE',
            {
                title: node.getAttribute('title'),
                descript: node.getAttribute('descript'),
                name: 'text'
            }
        )
    }
}

const entityToHTML = (entity, originalText) => {
    if (entity.type === 'TEXT') {
        return `<div class="textStyle" title="${entity.data.title}" descript="${entity.data.descript}" name="${entity.data.name}"><div>${entity.data.title}</div><span>${entity.data.descript}</span></div>`
    }
    return originalText
}

const TextPlugin = createPlugin({
    displayName: 'TextPlugin',
    buttons: text,
    decorators: TextDecorator,
    htmlToEntity,
    entityToHTML
});

export default TextPlugin