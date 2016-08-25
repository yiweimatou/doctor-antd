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
    state = {
        name: '',
        current: 1
    }
    static propTypes = {
        list:PropTypes.array,
        pageParams:PropTypes.object,
        onChange:PropTypes.func.isRequired,
        apply:PropTypes.func.isRequired,
        lid:PropTypes.number,
        fetchInfo: PropTypes.func.isRequired
    }   
    onChange=(page)=>{
        this.props.onChange(
            page,
            this.props.pageParams.limit,
            this.state.name
        )
    }
    onSearch=(name)=>{
        this.props.fetchInfo(name)
        this.props.onChange(
            1,this.props.pageParams.limit,
            name
        )
    }
    changeHandler = (e) => {
        this.setState({
            name: e.targe.value
        })
    }
    componentDidMount(){
        this.props.fetchInfo('')
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
                    value = { this.state.name }
                    onChange = { this.changeHandler }
                />
                {list.map(item=>{
                    return (
                        <div key={item.id} className='oitem'>
                            <img src={item.logo} className='oimg' width='100%' />
                            <span className='ospan'>{item.title}</span>
                            <Button 
                                onClick={()=>apply(item.id,lid)} 
                                className='button'
                            >
                                申请
                            </Button>
                        </div>
                    )
                })}
                <div style={styles.marginTop}>
                { list.length > 0 ?                
                    <Pagination 
                        current = { this.state.current }
                        total={ pageParams.total }
                        showTotal={total => `共 ${total} 条`}
                        pageSize = {pageParams.limit}
                        onChange = { page => {
                            this.props.onChange(page, pageParams.limit, this.state.name)
                            this.setState({ current: page })
                        }}
                    /> :
                    <p style={{textAlign: 'center'}}>暂无数据</p>
                }
                </div> 
            </div>
        )
    }
}

export default SelectOrganize