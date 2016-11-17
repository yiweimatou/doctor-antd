import React, { Component } from 'react'
import { Entity, AtomicBlockUtils } from 'draft-js'
import { createPlugin, pluginUtils } from 'draft-extend'
import { Button, Modal, message } from 'antd'
import VideoSelect from '../../Resource/Video/Select'
import { videoUrlConvert } from '../../../utils'

const ENTITY_TYPE = 'VIDEO'
const BLOCK_TYPE = 'atomic:video'
class VideoButton extends Component {
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
            const src = videoUrlConvert(record.path)
            if (src === '') {
                this.setState({ record : null })
                return message.error('视频地址有误,请重新选择！')
            }
            const entityKey = Entity.create(
                ENTITY_TYPE,
                'IMMUTABLE',
                { src }
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
                    title="选择视频"
                    onOk={this.okHandler}
                    onCancel={this.toggleVisible}
                    maskClosable={false}
                    width={720}
                >
                    <VideoSelect onChange={val => this.setState({ record: val })}/>
                </Modal>
                <Button onClick={this.toggleVisible}>添加视频</Button>
            </div>
        )
    }
}

const VideoDecorator = {
    strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
    component: props => {
        const entity = Entity.get(props.entityKey)
        const { src } = entity.getData()
        return (
            <iframe allowFullScreen frameBorder={0} width={300} height={200} src={src} controls />
        );
    }
}

const htmlToEntity = (nodeName, node) => {
    if (nodeName === 'iframe') {
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
        return `<iframe allowfullscreen frameborder=0 width="300" height="200"  src="${entity.data.src}" controls />`
    }
    return originalText
};

const blockRendererFn = (block) => {
    if (block.getType() === 'atomic:video' && block.size > 0 && Entity.get(block.getEntityAt(0)).getType() === ENTITY_TYPE) {
      return {
        component: ({ block }) => {
          const {src} = Entity.get(block.getEntityAt(0)).getData()
          return <iframe allowFullScreen frameBorder={0} width={300} height={200} src={src} controls />
        },
        editable: false
      }
    }
}

const VideoPlugin = createPlugin({
    displayName: 'VideoPlugin',
    buttons: VideoButton,
    decorators: VideoDecorator,
    htmlToEntity,
    entityToHTML,
    blockRendererFn,
    htmlToBlock: (nodeName) => {
        if (nodeName === 'figure') {
          return BLOCK_TYPE
        }
    },
    blockToHTML: {
        'atomic': {
          start: '<figure>',
          end: '</figure>'
        }
    }
});

export default VideoPlugin
export { VideoButton, VideoDecorator }
