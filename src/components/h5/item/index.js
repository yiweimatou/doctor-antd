import React, { Component } from 'react'
import { DEFAULT_COVER } from '../../../constants/api'

class Item extends Component {
    render() {
        const { item, pickHandler } = this.props
        return (
            <div style={{ marginTop: 10, border: '2px solid #e9e9e9', borderRadius: '4px', width: '264px' }}>
                <div className="courseImg">
                    <div className='xmoney'>
                        <span>{item.sale_amount === 0 ?' 免费 ' : `￥${item.sale_amount/100}`}</span>
                    </div>
                    <img src={item.cover || DEFAULT_COVER} width="260px" height="100px" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
                </div>
                <div className="newArticle">
                    <button onClick = { () => pickHandler(item) }>
                        引用
                    </button>
                </div>
            </div>
        )
    }
}

export default Item