import React from 'react'
import 'leaflet/dist/leaflet.css'
// import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet'
// import 'leaflet-draw'
import { Spin, message, Button } from 'antd'
import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'

const styles = {
    map:{
        height:750,
        marginTop: 20
    }
}
class Show extends React.Component{
    state = {
        loading: true,
        yid: this.props.params.yid
    }
    initial = yunbook => {
        if( !yunbook ) return
        const url = `${yunbook.path}/{z}/{x}/{y}.png`
        this._map =  L.map('_map',{
            maxZoom: yunbook.zoom,
            minZoom: 0,
            attributionControl: false
        })
        const bounds =new L.LatLngBounds(this._map.unproject([
            0, yunbook.height
        ], yunbook.zoom), this._map.unproject([
            yunbook.width, 0
        ], yunbook.zoom))
        this._map.setMaxBounds(bounds)
        this._map.fitBounds(bounds)
        L.tileLayer(url,{
            minZoom:0,
            maxZoom:yunbook.zom,
            bounds:bounds,
            noWrap:true
        }).addTo(this._map)
        L.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images'
        if( yunbook.lbl ){
            let  obj = {}
            try {
                obj = JSON.parse(yunbook.lbl)
            } catch (error) {
                console.log(error)
            }
            if (obj.type !== undefined) {
                L.geoJson(obj, {
                    onEachFeature: function (featureData, layer) {
                        if (featureData.geometry.type === 'Point') {
                            var popup = L.popup()
                            popup.setContent(featureData.properties._popup)
                            layer.bindPopup(popup)
                        }
                    }
                }).addTo(this._map)
            }
        }
        this.setState({ loading: false })
    }
    componentWillMount() {
        this.props.fetchYunbook(this.props.params.yid, yunbook => {
            this.initial(yunbook)
        }, error => {
            message.error(error)
        })
    }
    render(){
        const { lid, oid } = this.props.params
        let query = ''
        if (lid && oid) {
          query = `lid=${lid}&oid=${oid}`
        }
        return (
            <Spin spinning = {this.state.loading}>
                <div>
                    <Button type="primary" onClick={this.props.goBack} style={{ marginRight: 10 }}>返回</Button>
                    
                    {lid?<Button type='primary' onClick={() => {
                        this.setState({ loading:true })
                        this.props.buy({ id: this.state.yid, lesson_id: lid, organize_id: oid }, () => {
                            this.props.push(`/section/add/book?${query}&yid=${this.state.yid}`)
                        }, error => message.error(error))
                    }
                    }>购买</Button>:null}
                    <div id='_map' style={ styles.map } ></div>
                </div>
            </Spin>
        )
    }
}

export default connect(state => ({
    params: state.routing.locationBeforeTransitions.query,
}), dispatch => ({
    buy(params, resolve, reject) {
        dispatch({
            type: 'yunbook/buy',
            payload: { params, resolve, reject }
        })
    },
    fetchYunbook(id, resolve, reject) {
        dispatch({
            type: 'yunbook/get',
            payload: {
                id
            }, resolve, reject
        })
    },
    push(path) {
        dispatch(push(path))
    },
    goBack() {
        dispatch(goBack())
    }
})
)(Show)