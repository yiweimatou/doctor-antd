import React, {Component, PropTypes} from 'react';
import { Card, Icon } from 'antd'

class ImageCard extends Component {
    render() {
        const { image, remove } = this.props
        return (
            <Card style={{ width: 240, marginBottom: 20 }} bodyStyle={{ padding: 0 }}>
                <div onClick={() => remove(image.id)} style={{ color: 'red', position: 'absolute', right: '5px', cursor: 'pointer' }}>
                    <Icon type="close" />
                </div>
                <img alt="img" height="160" width="100%" src={image.path} style={{display: 'block'}} />
                <div style={{ padding: '10px 16px'}}>
                    <h3>{image.title}</h3>
                    <p style={{color: '#999'}}>{image.descript||'无'}</p>
                </div>
            </Card>
        );
    }
}

ImageCard.propTypes = {
    image: PropTypes.object,
    remove: PropTypes.func.isRequired,
};

export default ImageCard;