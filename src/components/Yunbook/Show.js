import React from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet'
import 'leaflet-draw'
import { Spin, message, Button } from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

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
           L.geoJson(JSON.parse(yunbook.lbl), {
                onEachFeature: function (featureData, layer) {
                    if (featureData.geometry.type === 'Point') {
                        var popup = L.popup()
                        popup.setContent(featureData.properties._popup)
                        layer.bindPopup(popup)
                    }
                }
            }).addTo(this._map)
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
        const { lid } = this.props.params
        return (
            <Spin spinning = {this.state.loading}>
                <div>
                    {lid?<Button type='primary' onClick={() => this.props.push(`/section/new?lid=${lid}&yid=${this.state.yid}`)}>购买</Button>:null}
                    <div id='_map' style={ styles.map } ></div>
                </div>
            </Spin>
        )
    }
}

export default connect(state => ({
    params: state.routing.locationBeforeTransitions.query
}), dispatch => ({
    fetchYunbook(id, resolve, reject) {
        dispatch({
            type: 'yunbook/fetch',
            payload: {
                id
            },
            meta: {
                resolve, reject
            }
        })
    },
    push(path) {
        dispatch(push(path))
    }
}) 
)(Show)