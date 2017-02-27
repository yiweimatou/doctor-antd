import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import { videoUrlConvert } from '../../../utils'

class VideoItem extends Component {
    render() {
        const { video, remove, onClick } = this.props
        const src = videoUrlConvert(video.path)
        return (
            <Card style={{ width: 240, marginBottom: 20 }} bodyStyle={{ padding: 0 }}>
                <iframe height="160" width="100%" src={src} />
                <div style={{ padding: '10px 16px'}}>
                    <div style={{ float: 'right' }}>
                        <a style={{ marginRight: 5}} onClick={onClick}>
                            <Icon type="edit" />编辑
                        </a>
                        <a onClick={() => remove(video.id)}><Icon type="close" />删除</a>
                    </div>
                    <h3 style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{video.title}</h3>
                    <p style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#999' }}>{video.descript||'无'}</p>
                </div>
            </Card>
        )
    }
}

export default VideoItem