import React, { Component } from 'react'
import { Entity, AtomicBlockUtils } from 'draft-js'
import { createPlugin, pluginUtils } from 'draft-extend'
import { Button, Modal, message } from 'antd'
import AudioSelect from '../../Resource/Audio/Select'

const ENTITY_TYPE = 'AUDIO'
const BLOCK_TYPE = 'atomic'
class AudioButton extends Component {
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
            const newEditorState = AtomicBlockUtils.insertAtomicBlock(
                editorState,
                Entity.create(
                    ENTITY_TYPE,
                    'IMMUTABLE',
                    { src: record.path }
                ),
                ' '
            )
            onChange(newEditorState)
            this.toggleVisible()
        } else {
            message.warn('请选择一项！')
        }
    }
    render() {
        const { visible } = this.state
        return (
            <div>
                <Modal
                    visible={visible}
                    title="选择音频"
                    onOk={this.okHandler}
                    onCancel={this.toggleVisible}
                    maskClosable={false}
                >
                    <AudioSelect onChange={val => this.setState({ record: val })}/>
                </Modal>
                <Button onClick={this.toggleVisible}>添加音频</Button>
            </div>
        )
    }
}

const AudioDecorator = {
    strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
    component: props => {
        const entity = Entity.get(props.entityKey)
        const { src } = entity.getData()
        return (
            <audio src={src} controls />
        );
    }
}

const htmlToEntity = (nodeName, node) => {
    if (nodeName === 'audio') {
        return Entity.create(
            ENTITY_TYPE,
            'IMMUTABLE',
            {
                src: node.getAttribute('src'),
            }
        )
    }
}

const entityToHTML = (entity, originalText) => {
    if (entity.type === ENTITY_TYPE) {
        return `<audio src="${entity.data.src}" controls />`
    }
    return originalText
}

const blockRendererFn = (block) => {
    if (block.getType() === BLOCK_TYPE && block.size > 0 && Entity.get(block.getEntityAt(0)).getType() === ENTITY_TYPE) {
      return {
        component: ({block}) => {
          const {src} = Entity.get(block.getEntityAt(0)).getData();
          return <audio src={src} controls />
        },
        editable: false
      }
    }
}

const AudioPlugin = createPlugin({
    displayName: 'AudioPlugin',
    buttons: AudioButton,
    decorators: AudioDecorator,
    htmlToEntity,
    entityToHTML,
    blockRendererFn,
    htmlToBlock: (nodeName, node, lastList, inBlock) => {
        if (nodeName === 'figure' && node.firstChild.nodeName === 'AUDIO' || (nodeName === 'audio' && inBlock !== BLOCK_TYPE)) {
          return BLOCK_TYPE;
        }
    },
    blockToHTML: {
        'atomic': {
          start: '<figure>',
          end: '</figure>'
        }
    }
});

export default AudioPlugin
export { AudioButton, AudioDecorator }
