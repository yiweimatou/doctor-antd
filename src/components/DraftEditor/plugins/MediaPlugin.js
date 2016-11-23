import React from 'react'
import { createPlugin } from 'draft-extend'
import { Entity } from 'draft-js'
import { ImageButton, ImageDecorator } from './ImagePlugin'
import { AudioButton, AudioDecorator } from './AudioPlugin'
import { VideoButton, VideoDecorator } from './VideoPlugin'

const ENTITY_TYPE = {
    IMAGE: 'IMAGE',
    AUDIO: 'AUDIO',
    VIDEO: 'VIDEO'
}
const BLOCK_TYPE = 'atomic'

const htmlToEntity =(nodeName, node) => {
    if (nodeName === 'img') {
        return Entity.create(
            ENTITY_TYPE.IMAGE,
            'IMMUTABLE',
            {
                src: node.getAttribute('src'),
            }
        )
    } else if (nodeName === 'audio') {
        return Entity.create(
            ENTITY_TYPE.AUDIO,
            'IMMUTABLE',
            {
                src: node.getAttribute('src'),
            }
        )
    } else if (nodeName === 'iframe') {
        return Entity.create(
            ENTITY_TYPE.VIDEO,
            'IMMUTABLE',
            {
                src: node.getAttribute('src'),
            }
        )
    }
}
const entityToHTML = (entity, originalText) => {
    if (entity.type === ENTITY_TYPE.IMAGE) {
        return `<img src="${entity.data.src}" width="300" height="200" />`
    } else if (entity.type === ENTITY_TYPE.AUDIO ) {
        return `<audio src="${entity.data.src}" controls />`
    } else if (entity.type === ENTITY_TYPE.VIDEO) {
        return `<iframe allowfullscreen frameborder=0 width="300" height="200"  src="${entity.data.src}" controls />`
    }
    return originalText
}

const htmlToBlock = (nodeName, node, lastList, inBlock) => {
    if (nodeName === 'figure' && (node.firstChild.nodeName === 'IMG' || node.firstChild.nodeName === 'AUDIO')) {
        return BLOCK_TYPE
    } else if (nodeName === 'img' && inBlock !== BLOCK_TYPE) {
        return BLOCK_TYPE
    } else if (nodeName === 'audio' && inBlock !== BLOCK_TYPE) {
        return BLOCK_TYPE
    } else if (nodeName === 'iframe' && inBlock !== BLOCK_TYPE) {
        return BLOCK_TYPE
    }
}

const blockToHTML = {
    'atomic': {
      start: '<figure>',
      end: '</figure>'
    }
}
const blcokRendererFn = block => {
    if (block.getType() === BLOCK_TYPE && block.size > 0) {
        const type = Entity.get(block.getEntityAt(0)).getType()
        if (type === ENTITY_TYPE.IMAGE) {
          return {
            component: ({block}) => {
              const {src} = Entity.get(block.getEntityAt(0)).getData();
              return <img src={src} width={300} height={200} />
            },
            editable: false
          }
      } else if (type === ENTITY_TYPE.AUDIO) {
          return {
            component: ({block}) => {
              const {src} = Entity.get(block.getEntityAt(0)).getData();
              return <audio src={src} controls />
            },
            editable: false
          }
      } else if (type === ENTITY_TYPE.VIDEO) {
          return {
            component: ({ block }) => {
              const {src} = Entity.get(block.getEntityAt(0)).getData()
              return <iframe allowFullScreen frameBorder={0} width={300} height={200} src={src} controls />
            },
            editable: false
          }
      }
    }
}

const MediaPlugin = createPlugin({
    displayName: 'MediaPlugin',
    buttons: [ ImageButton, AudioButton, VideoButton ],
    decorators: [ ImageDecorator, AudioDecorator, VideoDecorator ],
    htmlToEntity,
    entityToHTML,
    htmlToBlock,
    blockToHTML,
    blcokRendererFn
})

export default MediaPlugin
