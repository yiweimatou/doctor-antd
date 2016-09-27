import React,{ Component, PropTypes } from 'react'
import { Pagination, Button, message, Spin } from 'antd'
import './SelectOrganize.css'
import SearchInput from '../SearchInput'
import { DEFAULT_LOGO } from '../../constants/api'

const styles = {
    marginTop:{
        marginTop:10
    }
}

class SelectOrganize extends Component{
    state = {
        name: '',
        total: 0,
        pending: false
    }
    static propTypes = {
        list:PropTypes.array.isRequired,
        onChange:PropTypes.func.isRequired,
        apply:PropTypes.func.isRequired,
        lid:PropTypes.string.isRequired,
        fetchInfo: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired
    }
    onChange= offset =>{
        this.props.onChange({
            offset,
            limit : 9,
            title: this.state.name
        }, null, error => message.error(error))
    }
    onSearch= name => {
        this.props.fetchInfo({
          title: name
        }, total => this.setState({ total }), error => message.error(error))
        this.props.onChange({
          offset: 1,
          limit: 9,
          title: name
        }, null, error => message.error(error))

    }
    onClick = params => {
      this.setState({ pending: true })
      this.props.apply(params, () => {
        message.success('申请已经发送', 6)
        this.setState({ pending: false })
      }, error => {
        message.error(error)
        this.setState({ pending: false })
      })
    }
    changeHandler = (e) => {
        this.setState({
            name: e.targe.value
        })
    }
    componentWillMount(){
      this.onSearch('')
    }

    render(){
        const { total, pending } = this.state
        const {
            list, lid, onChange, loading
        } = this.props
        return(
            <div className='container'>
                <Spin spinning={loading || pending}>
                <SearchInput
                    onSearch = { this.onSearch }
                    placeholder = '输入机构名称搜索'
                    value = { this.state.name }
                    onChange = { this.changeHandler }
                />
                {list.map(item=>{
                    return (
                        <div key={item.id} className='oitem'>
                            <img src={ item.logo || DEFAULT_LOGO } className='oimg' width='100%' />
                            <div className='otitle'>{item.title}</div>
                            <Button
                                onClick={() => this.onClick({
                                  organize_id: item.id,
                                  lesson_id: lid
                                })}
                                className='button'
                            >
                                申请
                            </Button>
                        </div>
                    )
                })}
                <div style={styles.marginTop}>
                { total > 0 ?
                    <Pagination
                        total={ total }
                        showTotal={total => `共 ${total} 条`}
                        pageSize = {9}
                        onChange = { page => {
                            onChange({
                              title: this.state.name,
                              limit: 9,
                              offset: page
                            })
                        }}
                    /> :
                    <p style={{textAlign: 'center'}}>暂无数据</p>
                }
                </div>
                </Spin>
            </div>
        )
    }
}

export default SelectOrganize
