import React from 'react'
import { Editor,EditorState,RichUtils,Entity,AtomicBlockUtils } from 'draft-js'
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
        this.confirmMedia = this._confirmMedia.bind(this)
        this.handleKeyCommand = this._handleKeyCommand.bind(this)
        this.handleOpen = ()=>this.setState({open:!this.state.open})
    }
    static propTypes ={
        setEditorState:React.PropTypes.func
    }
     _handleKeyCommand(command) {
        const {editorState} = this.state
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.onChange(newState)
            this.props.setEditorState(newState)
            return true
        }
        return false
    }
    _confirmMedia() {
        const {editorState, urlType} = this.state
        const urlValue = document.querySelector('#url').value
        if(!urlValue){
            return message.error('请输入url地址')
        }
        const entityKey = Entity.create(urlType, 'IMMUTABLE', {src: urlValue})
        const newState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        )
        this.setState({
            editorState: newState
        })
        this.props.setEditorState(newState)
        this.handleOpen()
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
    _addLink(){
        this._promptForMedia('link')
    }
    _addImage(){
        this._promptForMedia('image')
    }

    _addVideo() {
        this._promptForMedia('video')
    }
    render(){
        const { editorState } = this.state
        return(
            <div className='editorContainer'>
                <div className='buttons'>
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
                        handleKeyCommand={this.handleKeyCommand}
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
                        <Input 
                            id='url'
                            type='text'
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
    return <img src={props.src} /> //eslint-disable-line
}

const Video = (props) => {
    const url = props.src //eslint-disable-line
    const ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    const ytMatch = url.match(ytRegExp)

    const youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/
    const youkuMatch = url.match(youkuRegExp)

    const qqRegExp = /\/\/v\.qq\.com\/cover\/[a-zA-Z0-9]\/\w+\.html\?vid=(\w+)/
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

const Media = (props) => {
    const entity = Entity.get(props.block.getEntityAt(0))
    const {src} = entity.getData()
    const type = entity.getType()
    let media
    if (type === 'image') {
        media = <Image src={src} />
    } else if (type === 'video') {
        media = <Video src={src} />
    }
    return media
}

export default MyEditor