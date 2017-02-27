import React, {Component, PropTypes} from 'react';
import { Card, Icon } from 'antd'

class TextCard extends Component {
    render() {
        const { record, remove, onClick } = this.props
        return (
            <Card style={{ width: 240, height: 160 }} bodyStyle={{ padding: 0 }}>
                <div style={{ padding: '10px 16px'}}>
                    <div style={{ float: 'right' }}>
                        <a onClick={onClick} style={{ marginRight: 5 }}>
                            <Icon type="edit" />编辑
                        </a>
                        <a onClick={() => remove(record.id)}><Icon type="close"/>删除</a>
                    </div>
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