import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import { videoUrlConvert } from '../../../utils'

class VideoItem extends Component {
    render() {
        const { video, remove } = this.props
        const src = videoUrlConvert(video.path)
        let del = null
        if (remove) {
            del = (<div onClick={() => remove(video.id)} style={{ color: 'red', position: 'absolute', right: '5px', cursor: 'pointer' }}>
                    <Icon type="close" />
                </div>)
        }
        return (
            <Card style={{ width: 240, marginBottom: 20 }} bodyStyle={{ padding: 0 }}>
                { del }
                <iframe height="160" width="100%" src={src} />
                <div style={{ padding: '10px 16px'}}>
                    <h3>{video.title}</h3>
                    <p style={{color: '#999'}}>{video.descript||'无'}</p>
                </div>
            </Card>
        )
    }
}

export default VideoItem