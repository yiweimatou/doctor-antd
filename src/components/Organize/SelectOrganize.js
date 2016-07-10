import React,{Component,PropTypes} from 'react'
import {Pagination,Button} from 'antd'
import './SelectOrganize.css'
import SearchInput from '../SearchInput'

const styles = {
    marginTop:{
        marginTop:10
    }
}

class SelectOrganize extends Component{
    static propTypes = {
        list:PropTypes.array,
        pageParams:PropTypes.object,
        onChange:PropTypes.func.isRequired,
        apply:PropTypes.func.isRequired,
        lid:PropTypes.number
    }   
    onChange=(page)=>{
        this.props.onChange(
            page,
            this.props.pageParams.limit,
            this.state.oname
        )
    }
    onSearch=(oname)=>{
        this.props.onChange(
            1,this.props.pageParams.limit,
            oname
        )
    }
    componentWillMount(){
        this.props.onChange(1,6,'')
    }

    render(){
        const {
            list,pageParams,apply,lid
        } = this.props
        return(
            <div className='container'>
                <SearchInput
                    onSearch = { this.onSearch } 
                    placeholder = '输入机构名称搜索'
                />
                {list.map(item=>{
                    return (
                        <div key={item.oid} className='oitem'>
                            <img src={item.logo} className='oimg' width='100%' />
                            <span className='ospan'>{item.oname}</span>
                            <Button 
                                onClick={()=>apply(item.oid,lid)} 
                                className='button'
                            >
                                申请
                            </Button>
                        </div>
                    )
                })}
                <div style={styles.marginTop}>
                    <Pagination 
                        style={{marginTop:20}}
                        total={pageParams.total}
                        showTotal={total => `共 ${total} 条`}
                        defaultPageSize = {pageParams.limit}
                        onChange = {this.onChange}
                    />
                </div>
            </div>
        )
    }
}

export default SelectOrganize