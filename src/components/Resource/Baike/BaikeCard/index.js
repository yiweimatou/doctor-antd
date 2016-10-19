import React, {Component, PropTypes} from 'react';
import {Card} from 'antd'

class BaikeCard extends Component {
    render() {
        const {record} = this.props
        return (
            <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
                <div style={{display: 'block', wordBreak: 'break-all'}}>{record.path}</div>
                <div style={{ padding: '10px 16px'}}>
                    <h3>{record.title}</h3>
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