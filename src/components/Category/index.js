import { Cascader, message } from 'antd'
import React,{ Component, PropTypes } from 'react'
import {connect} from 'react-redux'

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
        value: [],
        latLng: { lat: 0, lng: 0 }
    }
    componentWillReceiveProps(nextProps) {
        const { options, defaultValue } = nextProps
        if (options && options.length > 0 && options !== this.props.options) {
            this.setState({
                options,
                value: defaultValue
            })
        }
    }
    componentWillMount() {
        const {options, defaultValue} = this.props
        if (options && defaultValue) {
            this.setState({
                options: options,
                value: defaultValue
            })
        }
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
                    lng: item.lng,
                    area: {
                        lat1: item.lat1,
                        lat2: item.lat2,
                        lng1: item.lng1,
                        lng2: item.lng2
                    }                    
                }))
            } else {
                targetOption.children = []
            }
            this.setState({
                options: [...this.state.options],
                value: selectedOptions.map(i => i.value)
            })
        }, error =>  message.error(error))
    }
    changeHandler = (value, selectedOptions) => {      
        const targetOption = selectedOptions[selectedOptions.length-1]         
        if (selectedOptions.length > 2) {
            this.setState({
                latLng: {
                    lat: targetOption.lat,
                    lng: targetOption.lng
                }
            })
        }
        if (this.props.onChange) {
            this.props.onChange(selectedOptions.map(i => i.value), {
                lat: targetOption.lat,
                lng: targetOption.lng
            }, targetOption.area)
        }
    }
    getLatLng = () => this.state.latLng
    render (){
        return(
            <Cascader ref='category' placeholder='请选择分类' loadData = {this.loadData}
                options = { this.state.options } changeOnSelect = { true } onChange = {this.changeHandler}
                value = { this.state.value }
                style = { this.props.style }
            />
        )
    }
}

Category.propTypes = {
    getList: PropTypes.func.isRequired,
    style: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func
}

export default connect(null, dispatch => ({
    getList(params, resolve, reject) {
            dispatch({
                type: 'category/list',
                payload: { params, resolve, reject }
            })
    }
}))(Category)