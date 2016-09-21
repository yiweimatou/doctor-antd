import React,{ Component,PropTypes } from 'react'
import { Link } from 'react-router'
import './index.css'

class SelectYunbook extends Component{
    render(){
        const {
            yunbook,handlePick,lid, oid
        } = this.props
        return(
            <div className='col'>
               <Link className='courseList' to={`/yunbook/show?oid=${oid}&lid=${lid}&yid=${yunbook.id}`}>
                    <div className="courseImg">
                        <div className='xmoney'>
                            <span>{yunbook.money === 0 ?' 免费 ' : `￥${yunbook.sale_amount}`}</span>
                        </div>
                        <img src={yunbook.cover} width="100%" />
                    </div>
                    <div className="courseTitle">
                        <span>{yunbook.title}</span>
                    </div>
                </Link>
                <div className="newArticle">
                    <button onClick = { () => handlePick(yunbook) }>
                        引用
                    </button>
                </div>
            </div>
        )
    }
}

SelectYunbook.propTypes = {
    yunbook: PropTypes.object.isRequired,
    handlePick: PropTypes.func.isRequired,
    lid: PropTypes.string,
    oid: PropTypes.string
}

export default SelectYunbook
