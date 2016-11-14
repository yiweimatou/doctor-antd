import React, {Component, PropTypes} from 'react';
import {Card} from 'antd'

class TextCard extends Component {
    render() {
        const {record} = this.props
        return (
            <Card style={{ width: 240, height: 160 }} bodyStyle={{ padding: 0 }}>
                <div style={{ padding: '10px 16px'}}>
                    <h3>{record.title}</h3>
                    <div style={{display: 'block', wordBreak: 'break-all'}}>{record.descript}</div>  
                </div>       
            </Card>
        );
    }
}

TextCard.propTypes = {
    record: PropTypes.object.isRequired
};

export default TextCard;