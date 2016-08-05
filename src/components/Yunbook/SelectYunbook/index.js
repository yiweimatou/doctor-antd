import React,{ Component,PropTypes } from 'react'
import { Link } from 'react-router'
import './index.css'
import { IMG_URL } from '../../../constants/api'

class SelectYunbook extends Component{
    render(){
        const {
            yunbook,handlePick
        } = this.props
        return(
            <div className='col'>
               <Link className='courseList' to={`/yunbook/show/${yunbook.id}`}>
                    <div className="courseImg">
                        <div className='xmoney'>
                            <span>{yunbook.money===0?' 免费 ':`￥ ${yunbook.money}`}</span>
                        </div>
                        <img src={`${IMG_URL}${yunbook.cover}`} width="100%" />
                    </div>
                    <div className="courseTitle">
                        <span>{yunbook.title}</span>
                    </div>
                </Link>
                <div className="newArticle">
                    <button onClick = {()=>handlePick(yunbook)}>
                        引用
                    </button>
                </div>
            </div>
        )
    }
}

SelectYunbook.propTypes = {
    yunbook:PropTypes.object,
    handlePick:PropTypes.func
}

export default SelectYunbook