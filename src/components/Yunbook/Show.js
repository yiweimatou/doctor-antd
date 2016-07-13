import React from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {connect} from 'react-redux'

const styles = {
    map:{
        height:750
    }
}
class Show extends React.Component{
    componentWillReceiveProps(nextProps){
        const { yunbook } = nextProps
        const url = `${yunbook.path}/{z}/{x}/{y}.png`
        this._map =  L.map('_map',{
            maxZoom:yunbook.zoom,
            minZoom:0,
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
    } 
    render(){
        return (
            <div id='_map' style={ styles.map } >
            </div>
        )
    }
}

Show.propTypes = {
    yunbook:React.PropTypes.object
}

export default connect(
    state=>({
        yunbook:state.yunbook.entity
    })
)(Show)