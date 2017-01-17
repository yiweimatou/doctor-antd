import React, { Component, PropTypes } from 'react'
import { Button, message, Spin } from 'antd'
import { UPLOAD_DOMAIN } from '../../constants/api'
import ApiClient from '../../services/ApiClient'

class BusinessCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            src: props.srcs[0],
            index: 0,
            loading: false
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.downloadHandler = this.downloadHandler.bind(this)
    }

    downloadURI(uri, name) {
        const link = document.createElement('a')
        link.download = name
        link.href = uri
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
    }
    changeHandler() {
        if (this.state.index < 4) {
            this.setState(prevState => ({
                src: this.props.srcs[prevState.index + 1],
                index: prevState.index + 1
            }))
        } else {
            this.setState({
                src: this.props.srcs[0],
                index: 0
            })
        }
    }
    downloadHandler() {
        const {
            id, type
        } = this.props
        this.setState({ loading: true })
        ApiClient.get(`${UPLOAD_DOMAIN}/${type}/card`, {
            id, model_id: this.state.index + 1
        }).then(data => {
            this.setState({ loading:false })
            if (data.code === 200) {
                this.downloadURI(data.card_path, '名片')                
            } else {
                message.error(data.msg)
            }
        }).catch(error => {
            this.setState({ loading: false })
            message.error(error)
        })
    }
    render () {
        const { src, loading } = this.state

        return (
            <Spin spinning={loading} tip="名片生成中...">
                <img src={src} width="700px" />
                <Button style={{ margin: 'auto 20px' }} onClick={this.changeHandler} type="ghost">换一个</Button>
                <Button onClick={this.downloadHandler} type="primary">下载</Button>
            </Spin>
        )
    }
}

BusinessCard.propTypes = {
    srcs: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
}

export default BusinessCard
