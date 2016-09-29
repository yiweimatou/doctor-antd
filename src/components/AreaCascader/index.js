import { Cascader, message } from 'antd'
import React,{ Component, PropTypes } from 'react'
import { list } from '../../services/category.js'

class AreaCascader extends Component{
    constructor(props){
        super(props)
        this.state = {
            options: props.options
        }
    }
    loadData= selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length-1]
        const isLeaf = this.props.level+2===targetOption.zoom
        targetOption.loading=true
        list({
            limit: 100,
            pid:targetOption.value
        }).then(data=>{
            targetOption.loading=false
            if( data.list.length > 0){
                targetOption.children = data.list.map(item=>{
                    return {
                        label:item.title,
                        value:item.id,
                        zoom:item.zoom,
                        isLeaf
                    }
                })
            }else{
                targetOption.children = []
            }
            this.setState({
                options:[...this.state.options]
            })
        }).catch(error=>{
            message.error(error)
        })   
    }
    render(){
        const { props } = this.props
        return(
            <Cascader
                placeholder='请选择分类'
                options = {this.state.options}
                loadData = {this.loadData}
                changeOnSelect = { true }
                { ...props }
            />
        )
    }
}

AreaCascader.propTypes = {
    level: PropTypes.number.isRequired,
    props: PropTypes.object.isRequired,
    options: PropTypes.array
}

export default AreaCascader