import React, {Component} from 'react'
import {Entity} from 'draft-js'

export default class VideoSpan extends Component {
    render() {
        const entity = Entity.get(this.props.entityKey)
        let {src} = entity.getData()        
        const ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
        const ytMatch = src.match(ytRegExp)

        const youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/
        const youkuMatch = src.match(youkuRegExp)

        const qqRegExp = /\S*v.qq.com\S*vid=(\S+)/
        const qqMatch = src.match(qqRegExp)
        if (ytMatch && ytMatch[1].length) {
            src = `//www.youtube.com/embed/${ytMatch[1]}`
        } else if (youkuMatch && youkuMatch[1].length) {
            src = `//player.youku.com/embed/${youkuMatch[1]}`
        } else if (qqMatch && qqMatch[1].length) {
            src = `http://v.qq.com/iframe/player.html?tiny=0&auto=0&vid=${qqMatch[1]}`
        } else {
            const result = src.match(/\S*v.qq.com\S*\/(\S+).html/)
            if (result && result[1].length) {
                src = `http://v.qq.com/iframe/player.html?tiny=0&auto=0&vid=${result[1]}`
            } else {
                return (null)
            }
        }
        return(
            <iframe src = {src} 
                allowFullScreen
                frameBorder = {0} 
                width={300}
                height={200}
            >
                你的垃圾浏览器不行啊
            </iframe>
        )
    }
}