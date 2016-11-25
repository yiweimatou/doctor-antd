import React, {Component, PropTypes} from 'react';
import './styles/index.css'
import { Button, message, Spin, Modal, Col, Pagination, Row } from 'antd'
import { IMAGE } from '../../../constants/api'
import { add as grow } from '../../../services/grow'
import { remove } from '../../../services/source'
import ImageCard from './ImageCard'
import ImageUpload from './ImageUpload'

class Image extends Component {
    state = {
        total: 0,
        list: [],
        loading: true,
        visible: false
    }
    componentWillMount() {
        const {info, list} = this.props
        info({state: 1, category_id: IMAGE})
            .then(data => this.setState({total: data.count}))
            .catch(error => message.error(error))
        list({state: 1, limit: 8, offset: 1, category_id: IMAGE})
            .then(data => this.setState({list: data.list, loading: false}))
            .catch(error => message.error(error))
    }
    _onCancel = () => this.setState({visible: false})
    _remove = id => {
        remove({ id }).then(() => {
            this.setState({ 
                list: this.state.list.filter(i => i.id !== id)
            })
            message.success('删除成功!')
        }).catch(error => message.error(error))
    }
    render() {
        const {loading, total, list, visible} = this.state        
        return (
            <Spin spinning={loading}>
                <Modal visible={visible} title='图片上传' footer='' width={720} onCancel={this._onCancel}>
                    <ImageUpload add={this.props.add} hideModal={image => this.setState({
                        visible: false,
                        list: this.state.list.concat(image),
                        total: this.state.total + 1
                    })} grow={grow}/>
                </Modal>
                <div className='image-div-topbar'>
                    <Button type='primary' onClick={() => this.setState({visible: true})}>上传图片</Button>
                    <span className='image-div-topbar-span'>格式支持jpg,png,gif等，大小不超过5M</span>
                </div>
                <Row>
                {
                    list.map(image => {
                        return <Col span='8' key={image.id}><ImageCard remove={this._remove} image={image}/></Col>
                    })
                }
                </Row>
                 {
                    total === 0 ? <p style={{marginTop: 20, textAlign: 'center'}}>暂无数据</p> :
                    <div style={{marginTop: 20}}>
                        <Pagination total={total} pageSize={8} showTotal={total => `共${total}条`}/>
                    </div>
                }
            </Spin>
        );
    }
}

Image.propTypes = {
    add: PropTypes.func.isRequired,
    list: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired
};

export default Image;