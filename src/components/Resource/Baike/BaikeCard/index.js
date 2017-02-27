import React, {Component, PropTypes} from 'react';
import { Card, Icon } from 'antd'

class BaikeCard extends Component {
    render() {
        const { record, remove, onClick } = this.props
        return (
            <Card style={{ width: 240, height: 160,  margin: '10px 0' }} bodyStyle={{ padding: 0 }}> 
                <div style={{ padding: '10px 16px'}}>
                    <div style={{ float: 'right' }}>
                        <a onClick={onClick} style={{ marginRight: 5 }}>
                            <Icon type="edit" /> 编辑
                        </a>
                        <a onClick={() => remove(record.id)}>
                            <Icon type="close" /> 删除
                        </a>
                    </div>
                    <a href={record.path}><h3 style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{record.title}</h3></a>
                    <p style={{color: '#999'}}>{record.descript||'无'}</p>
                </div>
            </Card>
        );
    }
}

BaikeCard.propTypes = {
    record: PropTypes.object.isRequired
};

export default BaikeCard;