import React, {Component, PropTypes} from 'react'
import { Card, Icon, Form, message } from 'antd'

class ImageCard extends Component {
    render() {
        const { image, remove } = this.props
        
        return (
            <Card style={{ width: 240, marginBottom: 20 }} bodyStyle={{ padding: 0 }}>          
                <img alt="img" height="160" width="100%" src={image.path} style={{display: 'block'}} />
                <div style={{ padding: '10px 16px'}}>
                    <div style = {{float:'right'}}>
                        <a style = {{marginRight: 5}}  onClick={this.props.onClick}><Icon type="edit" /> 编辑</a> 
                        <a onClick={() => remove(image.id)}><Icon type="close" />删除</a>
                    </div>                   
                    <h3 style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{image.title}</h3>
                    <p style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#999' }}>{image.descript||'无'}</p>
                </div>
            </Card>
        );
    }
}

ImageCard.propTypes = {
    image: PropTypes.object,
    remove: PropTypes.func.isRequired,
};

export default Form.create()(ImageCard);