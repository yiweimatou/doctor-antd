import { Cascader, message } from 'antd'
import React,{ Component, PropTypes } from 'react'

class Category extends Component {
    state = {
        options: [{
            label: '医学专业人员',
            value: '1',
            isLeaf: false
        }, {
            value: '2',
            label: '普通大众',
            isLeaf: false
        }],
        latLng: { lat: 0, lng: 0 }
    }
    componentWillReceiveProps(nextProps) {
        const { options } = nextProps
        if (options && options.length > 0) {
            this.setState({
                options
            })
        }
    }
    componentWillMount() {
        this.setState({
            options: this.props.options
        })
    }
    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length-1]
        targetOption.loading = true
        this.props.getList({
            parent_id: targetOption.value
        }, list => {
            targetOption.loading = false
            if ( list.length > 0 ){
                targetOption.children = list.map( item => ({
                    label: item.title,
                    value: item.id,
                    isLeaf: false,
                    lat: item.lat,
                    lng: item.lng
                }))
            } else {
                targetOption.children = []
            }
            this.setState({
                options: [...this.state.options]
            })
        }, error =>  message.error(error))
    }
    changeHandler = (value, selectedOptions) => {       
        if (selectedOptions.length > 2) {
            const targetOption = selectedOptions[selectedOptions.length-1]
            this.setState({
                latLng: {
                    lat: targetOption.lat,
                    lng: targetOption.lng
                }
            })
        }
    }
    getLatLng = () => this.state.latLng
    render (){
        return(
            <Cascader ref='category' placeholder='请选择分类' loadData = {this.loadData}
                options = { this.state.options } changeOnSelect = { true } onChange = {this.changeHandler}
                defaultValue = { this.props.defaultValue }
                style = { this.props.style }
            />
        )
    }
}

Category.propTypes = {
    getList: PropTypes.func.isRequired,
    style: PropTypes.object,
    options: PropTypes.array
}

export default Category