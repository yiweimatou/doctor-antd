import {Cascader, message } from 'antd'
import React,{Component,PropTypes} from 'react'
import {getAreaList} from '../../services/area.js'

class AreaCascader extends Component{
    state = {
        options:[]
    }
    componentWillMount(){
        if( !this.props.initialOptions ){
            getAreaList({
                limit:20,
                pid:1,
                zoom:4
            }).then( data=> {
                const options = data.list.map(item=>{
                    return {
                        label:item.title,
                        value:item.aid,
                        zoom:item.zoom,
                        isLeaf: false
                    }
                })
                this.setState({
                    options
                })
            }).catch( error=>{
                message.error( error )
            })
        }else{
            this.setState({
                options:this.props.initialOptions
            })
        }
    }
    static propTypes = {
        level:PropTypes.number.isRequired,
        initialOptions:PropTypes.array
    }
    loadData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length-1]
        const isLeaf = this.props.level+2===targetOption.zoom
        targetOption.loading=true
        getAreaList({
            limit:20,
            pid:targetOption.value,
            zoom:targetOption.zoom+1
        }).then(data=>{
            targetOption.loading=false
            if( data.list.length > 0){
                targetOption.children = data.list.map(item=>{
                    return {
                        label:item.title,
                        value:item.aid,
                        zoom:item.zoom,
                        isLeaf
                    }
                })
            }
        }).catch(error=>{
            message.error(error)
        })   
    }
    render(){
        const {
            ...props
        } = this.props
        return(
            <Cascader
                {...props}
                placeholder='请选择分类'
                options = {this.state.options}
                loadData = {this.loadData}
            />
        )
    }
}

export default AreaCascader