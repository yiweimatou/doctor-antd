import React, { Component } from 'react'
import Quill from 'quill'
import TextButton from './tool/text'
import BaikeButton from './tool/bk'
import DocButton from './tool/doc'
import WxButton from './tool/wx'
import ImageButton from './tool/image'
import AudioButton from './tool/audio'
import VideoButton from  './tool/video'
import { videoUrlConvert } from '../../utils'
import './index.css'

const BlockEmbed = Quill.import('blots/block/embed')

class MCBlot extends BlockEmbed {
    static create(value) {
        let node = super.create()
        let div = document.createElement('div')
        div.innerText = value.title
        let span = document.createElement('span')
        span.innerText = value.descript
        node.appendChild(div)
        node.appendChild(span)
        return node
    }
    static value(node) {
        return {
            title: node.childNodes[0].innerText,
            descript: node.childNodes[1].innerText
        }
    }
}
MCBlot.blotName = 'mingci'
MCBlot.tagName = 'div'
MCBlot.className= 'textStyle'

class ImageABlot extends BlockEmbed {
  static create(value) {
    let node = super.create()
    node.setAttribute('src', value.url)
    node.setAttribute('width', '100%')
    node.setAttribute('heigth', '100%')
    return node
  }

  static value(node) {
    return {
      url: node.getAttribute('src')
    }
  }
}
ImageABlot.blotName = 'imageA'
ImageABlot.tagName = 'img'

class BkBlot extends BlockEmbed {
  static create(value) {
    let node = super.create()
    node.setAttribute('href', value.url)
    node.setAttribute('target', '_blank')
    let i = document.createElement('i')
    i.setAttribute('class', 'icon-artboard f-fc4')
    let span = document.createElement('span')
    span.innerText = value.title
    let em = document.createElement('em')
    em.innerText = value.descript
    let div = document.createElement('span')
    div.setAttribute('class', 'spandiv')
    div.appendChild(span)
    div.appendChild(em)
    node.appendChild(i)
    node.appendChild(div)
    return node
  }

  static value(node) {
    return {
        url: node.getAttribute('href'),
        title: node.childNodes[1].childNodes[0].innerText,
        descript: node.childNodes[1].childNodes[1].innerText
    }
  }
}
BkBlot.blotName = 'baike'
BkBlot.tagName = 'a'
BkBlot.className = 'bk'

class WxBlot extends BlockEmbed {
  static create(value) {
    let node = super.create()
    node.setAttribute('href', value.url)
    node.setAttribute('target', '_blank')
    let i = document.createElement('i')
    i.setAttribute('class', 'icon-weixin f-fc2')
    let span = document.createElement('span')
    span.innerText = value.title
    let em = document.createElement('em')
    em.innerText = value.descript
    let div = document.createElement('span')
    div.setAttribute('class', 'spandiv')
    div.appendChild(span)
    div.appendChild(em)
    node.appendChild(i)
    node.appendChild(div)
    return node
  }

  static value(node) {
    return {
        url: node.getAttribute('href'),
        title: node.childNodes[1].childNodes[0].innerText,
        descript: node.childNodes[1].childNodes[1].innerText
    }
  }
}
WxBlot.blotName = 'weixin'
WxBlot.tagName = 'a'
WxBlot.className = 'wx'

class DocBlot extends BlockEmbed {
  static create(value) {
    let node = super.create()
    node.setAttribute('href', value.url)
    node.setAttribute('target', '_blank')
    let i = document.createElement('i')
    i.setAttribute('class', 'icon-wenxian f-fc3')
    let span = document.createElement('span')
    span.innerText = value.title
    let em = document.createElement('em')
    em.innerText = value.descript
    let div = document.createElement('span')
    div.setAttribute('class', 'spandiv')
    div.appendChild(span)
    div.appendChild(em)
    node.appendChild(i)
    node.appendChild(div)
    return node
  }

  static value(node) {
    return {
        url: node.getAttribute('href'),
        title: node.childNodes[1].childNodes[0].innerText,
        descript: node.childNodes[1].childNodes[1].innerText
    }
  }
}
DocBlot.blotName = 'doc'
DocBlot.tagName = 'a'
DocBlot.className = 'doc'

class VideoBlot extends BlockEmbed {
  static create(url) {
    let node = super.create()
    node.setAttribute('src', url)
    node.setAttribute('width', '100%')
    node.setAttribute('height', '100%')
    node.setAttribute('frameborder', '0')
    node.setAttribute('allowfullscreen', true)
    return node
  }
  static value(node) {
      return node.getAttribute('src')
  }
}
VideoBlot.blotName = 'videoA'
VideoBlot.tagName = 'iframe'

class AudioBlot extends BlockEmbed {
    static create(value) {
        let node = super.create()
        node.setAttribute('class', 'audio')
        let i = document.createElement('i')
        i.setAttribute('class', 'icon-yinp f-fc1')
        let audio = document.createElement('audio')
        audio.setAttribute('src', value.url)
        let span = document.createElement('span')
        span.innerText = value.title
        let em = document.createElement('em')
        em.innerText = value.descript
        let div = document.createElement('span')
        div.setAttribute('class', 'spandiv')
        div.appendChild(span)
        div.appendChild(em)
        node.appendChild(i)
        node.appendChild(audio)
        node.appendChild(div)
        return node
    }
     static value(node) {
        return {
            url: node.childNodes[1].getAttribute('src'),
            title: node.childNodes[2].childNodes[0].innerText,
            descript: node.childNodes[2].childNodes[1].innerText,
        }
    }
}
AudioBlot.blotName = 'audio'
AudioBlot.tagName = 'div'
AudioBlot.className = 'audio'

Quill.register(MCBlot)
Quill.register(ImageABlot)
Quill.register(BkBlot)
Quill.register(DocBlot)
Quill.register(WxBlot)
Quill.register(VideoBlot)
Quill.register(AudioBlot)

class ReactQuill extends Component {
    constructor(props) {
        super(props)
        this.textOkHandler = this.textOkHandler.bind(this)
        this.bkOkHandler = this.bkOkHandler.bind(this)
        this.wxOkHandler = this.wxOkHandler.bind(this)
        this.docOkHandler = this.docOkHandler.bind(this)
        this.imageOkHandler = this.imageOkHandler.bind(this)
        this.videoOkHandler = this.videoOkHandler.bind(this)
        this.audioOkHandler = this.audioOkHandler.bind(this)
    }

    componentDidMount() {
        this.quill = new Quill('#editor', {
            debug: 'error',
            modules: {
                toolbar: false
            },
            readOnly: false,
            theme: 'snow'
        })
        if (this.props.content) {
            this.quill.clipboard.dangerouslyPasteHTML(0, this.props.content)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.content !== nextProps.content && this.quill) {
            this.quill.root.innerHTML = ''
            this.quill.clipboard.dangerouslyPasteHTML(0, nextProps.content)
        }
    }


    textOkHandler(record) {
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(range.index, 'mingci', {
            title: record.title,
            descript: record.descript
        }, 'user')
        this.quill.setSelection(range.index + 1, 'silent')
    }

    bkOkHandler(record) {
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(range.index, 'baike', {
            url: record.path,
            title: record.title,
            descript: record.descript
        }, 'user')
        this.quill.setSelection(range.index + 1, 'silent')
    }

    wxOkHandler(record) {
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(range.index, 'weixin', {
            url: record.path,
            title: record.title,
            descript: record.descript
        }, 'user')
        this.quill.setSelection(range.index + 1, 'silent')
    }

    docOkHandler(record) {
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(range.index, 'doc', {
            url: record.path,
            title: record.title,
            descript: record.descript
        }, 'user')
        this.quill.setSelection(range.index + 1, 'silent')
    }
    imageOkHandler(record) {
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(range.index, 'imageA', { url: record.path }, 'user')
        this.quill.setSelection(range.index + 1, 'silent')
    }
    videoOkHandler(record) {
        const url = videoUrlConvert(record.path)
        if (url === '') {
            return
        }
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(range.index, 'videoA', url, 'user')
        this.quill.setSelection(range.index + 1, 'silent')
    }
    audioOkHandler(record) {
        let range = this.quill.getSelection(true)
        this.quill.insertEmbed(range.index, 'audio', {
            url: record.path,
            title: record.title,
            descript: record.descript
        }, 'user')
        this.quill.setSelection(range.index + 1, 'silent')
    }
    render() {
        return (
            <div>
                <div id="toolbar">
                    <ImageButton okHandler={this.imageOkHandler} />
                    <VideoButton okHandler={this.videoOkHandler} />
                    <AudioButton okHandler={this.audioOkHandler} />
                    <TextButton okHandler={this.textOkHandler} />
                    <BaikeButton okHandler={this.bkOkHandler} />
                    <WxButton okHandler={this.wxOkHandler} />
                    <DocButton okHandler={this.docOkHandler} />
                </div>
                <div id="editor" style={{ border: '1px solid #e9e9e9', height: '200px', borderRadius: '4px' }}></div>
            </div>
        )
    }
}

export default ReactQuill
