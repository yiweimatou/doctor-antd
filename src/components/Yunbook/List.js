import React,{Component,PropTypes} from 'react'
import { connect } from 'react-redux'
import { Row,Col,Pagination} from 'antd'
import YunbookCard from './YunbookCard'

class List extends Component {
    static propTypes = {
        list:PropTypes.object,
        changeHandler:PropTypes.func.isRequired,
        uid:PropTypes.number
    }
    render(){
        const {
            list,changeHandler,uid
        } = this.props
        const {
            limit,total,data
        } = list
        return(
            <div>
                <Row gutter={16}>
                {
                    data.map(yunbook=>{
                        return (<Col key={yunbook.id} span={8}>
                                  <YunbookCard yunbook={yunbook} />
                               </Col>)
                    })
                }
                </Row>
                <div className='pagination'>
                    <Pagination 
                        total={total}
                        showTotal={total => `共 ${total} 条`}
                        pageSize = {limit}
                        onChange = {(page)=>changeHandler(page,limit,uid)}
                    />
                </div>
            </div>
        )
    }
}

export default connect(
    state=>({
        list:state.yunbook.mylist,
        uid:state.auth.key
    }),
    dispatch=>({
        changeHandler:(offset,limit,account_id)=>{
            dispatch({
                type:'yunbook/mylist',
                payload:{
                    offset,limit,account_id
                }
            })
        }
    })
)(List)