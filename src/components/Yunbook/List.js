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
                {data.length > 0 ?
                <div className='pagination'>
                    <Pagination 
                        total={total}
                        showTotal={total => `共 ${total} 条`}
                        pageSize = {6}
                        onChange = {(page)=>changeHandler(page,limit,uid)}
                    />
                </div>:
                <p style={{textAlign: 'center'}}>没有数据</p>
                }
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