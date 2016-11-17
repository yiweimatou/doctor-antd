import React, { Component } from 'react'
import { Entity, AtomicBlockUtils } from 'draft-js'
import { createPlugin, pluginUtils } from 'draft-extend'
import { Button, Modal, message } from 'antd'
import ImageSelect from '../../Resource/Image/Select'

const ENTITY_TYPE = 'IMAGE'
const BLOCK_TYPE = 'atomic:image'

class ImageButton extends Component {
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
            const entityKey = Entity.create(
                ENTITY_TYPE,
                'IMMUTABLE',
                { src: record.path }
            )
            const newEditorState = AtomicBlockUtils.insertAtomicBlock(
                editorState,
                entityKey,
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
                    title="选择图片"
                    onOk={this.okHandler}
                    onCancel={this.toggleVisible}
                    maskClosable={false}
                >
                    <ImageSelect onChange={val => this.setState({ record: val })}/>
                </Modal>
                <Button onClick={this.toggleVisible}>添加图片</Button>
            </div>
        )
    }
}

const ImageDecorator = {
    strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
    component: props => {
        const entity = Entity.get(props.entityKey)
        const { src } = entity.getData()
        return <img src={src} width={300} height={200} />
    }
}

const htmlToEntity = (nodeName, node) => {
    if (nodeName === 'img') {
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
        return `<img src="${entity.data.src}" width="300" height="200" />`
    }
    return originalText
}

const blockRendererFn = (block) => {
    if (block.getType() === BLOCK_TYPE && block.size > 0 && Entity.get(block.getEntityAt(0)).getType() === ENTITY_TYPE) {
      return {
        component: ({block}) => {
          const {src} = Entity.get(block.getEntityAt(0)).getData();
          return <img src={src} width={300} height={200} />
        },
        editable: false
      };
    }
}

const ImagePlugin = createPlugin({
    displayName: 'ImagePlugin',
    buttons: ImageButton,
    decorators: ImageDecorator,
    htmlToEntity,
    entityToHTML,
    htmlToBlock: (nodeName, node, lastList, inBlock) => {
        if (nodeName === 'figure' && node.firstChild.nodeName === 'IMG' || (nodeName === 'img' && inBlock !== BLOCK_TYPE)) {
          return BLOCK_TYPE
        }
    },
    blockRendererFn,
    blockToHTML: {
        'atomic': {
          start: '<figure>',
          end: '</figure>'
        }
    }
});

export default ImagePlugin
export { ImageButton, ImageDecorator }
