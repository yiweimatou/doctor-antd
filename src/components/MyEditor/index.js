import React from 'react'
import { Editor,EditorState,Entity,AtomicBlockUtils } from 'draft-js'
import './index.css'
import {Button,Modal,Input,message} from 'antd'

class MyEditor extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            editorState:EditorState.createEmpty(),
            urlType: '',
            open:false
        }
        this.onChange = (editorState)=>{
            this.setState({editorState})   
            this.props.setEditorState(editorState) 
        }
        this.focus = () => this.refs.editor.focus()
        this.addImage = ()=>{
            this._addImage()
            this.handleOpen()
        }
        this.addVideo = ()=>{
            this._addVideo()
            this.handleOpen()
        }
        this.addLink = ()=>{
            this._addLink()
            this.handleOpen()
        }
        this.confirmMedia = this._confirmMedia.bind(this)
        this.handleOpen = ()=>this.setState({open:!this.state.open})
    }
    static propTypes ={
        setEditorState:React.PropTypes.func
    }
    componentWillReceiveProps(nextProps) {
        //if close the Modal, set empty
        if(!nextProps.open){
            this.setState({
                editorState: EditorState.createEmpty()
            })
        }
    }
    _confirmMedia() {
        const {editorState, urlType} = this.state
        const urlValue = document.querySelector('#url').value
        if (!urlValue) {
            return message.error('请输入url地址')
        }
        let newState
        if (urlType === 'LINK') {
            let text = document.querySelector('#text').value
            newState = AtomicBlockUtils.insertAtomicBlock(
                editorState,
                Entity.create(urlType, 'IMMUTABLE', { url: urlValue, text:text?text:urlValue}),
                ' '
            )
        } else {
            newState = AtomicBlockUtils.insertAtomicBlock(
                editorState,
                Entity.create(urlType, 'IMMUTABLE', { src: urlValue }),
                ' '
            )
        }
        this.setState({
            editorState: newState
        })
        this.props.setEditorState(newState)
        this.handleOpen()
        document.querySelector('#url').value = ''
    }
    
     _onURLInputKeyDown(e) {
        if (e.which === 13) {
            this._confirmMedia()
        }
    }

    _promptForMedia(type) {
        this.setState({
            urlType: type
        })
    }
    _addImage(){
        this._promptForMedia('image')
    }

    _addVideo() {
        this._promptForMedia('video')
    }
    _addLink(){
        this.setState({
            urlType:'LINK'
        })
    }
    render(){
        const { editorState } = this.state
        return(
            <div className='editorContainer'>
                <div className='buttons'>
                    <Button onMouseDown={this.addLink} style={{marginRight: 10}}>
                        插入链接
                    </Button>
                    <Button onMouseDown={this.addImage} style={{marginRight: 10}}>
                        插入图片
                    </Button>
                    <Button onMouseDown={this.addVideo} style={{marginRight: 10}}>
                        插入视频
                    </Button>
                </div>
                
                <div className='editor' onClick={this.focus}>
                    <Editor
                        ref = 'editor'
                        editorState={editorState}
                        onChange={this.onChange}
                        blockRendererFn={mediaBlockRenderer}
                        placeholder='写点什么...'
                    />
                </div>
                <Modal
                    visible={this.state.open}
                    style = {{top:150}}
                    onCancel={this.handleOpen}
                    onOk={this.confirmMedia}
                    width={300}
                >
                    <div className='url'>
                        {
                            this.state.urlType==='LINK'?
                            <Input
                                id='text'
                                type='text'
                                placeholder='链接显示'
                                style = {{marginBottom:10}}
                            />:null
                        }
                        <Input 
                            id='url'
                            type='text'
                            placeholder='url'
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}
function mediaBlockRenderer(block) {
    const type = block.getType()
    if (type === 'atomic') {
        return {
            component: Media,
            editable: false,
        }
    }
    return null
}

const Image = (props) => {
    return <img width={300} height={200} src={props.src} /> //eslint-disable-line
}

const Video = (props) => {
    const url = props.src //eslint-disable-line
    const ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    const ytMatch = url.match(ytRegExp)

    const youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/
    const youkuMatch = url.match(youkuRegExp)

    const qqRegExp = /\S*v.qq.com\S*vid=(\S+)/
    const qqMatch = url.match(qqRegExp)

    if(ytMatch && ytMatch[1].length === 11){
        return <iframe
                    frameBorder = {0} 
                    width={300}
                    height={200}
                    src={`//www.youtube.com/embed/${ytMatch[1]}`}
               />
    }else if(youkuMatch && youkuMatch[1].length){
        return <iframe
                    allowFullScreen
                    frameBorder = {0} 
                    width={300}
                    height={200}
                    src={`//player.youku.com/embed/${youkuMatch[1]}`}
                />
    }else if(qqMatch && qqMatch[1].length){
        return <iframe 
                    allowFullScreen
                    frameBorder = {0} 
                    width={300}
                    height={200}
                    src={`http://v.qq.com/iframe/player.html?tiny=0&auto=0&vid=${qqMatch[1]}`}
                />
    }else{
        return null
    }
}

const Link = (props) => {
    const {url,text} = props
    return (
        <a href={url} target='_blank'>
            {text} 
        </a>
    )
}
const Media = (props) => {
    const entity = Entity.get(props.block.getEntityAt(0))
    const {src} = entity.getData()
    const type = entity.getType()
    let media
    if (type === 'image') {
        media = <Image src={src} />
    } else if (type === 'video') {
        media = <Video src={src} />
    }else if(type==='LINK'){
        media = <Link {...entity.getData()}/>
    }
    return media

}

export default MyEditor