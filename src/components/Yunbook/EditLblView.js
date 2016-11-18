import React from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import { Modal, message } from 'antd'
import ResourceSelect from '../Resource/Select'
import {
    AUDIO, VIDEO, WX, DOC, TEXT, BAIKE, IMAGE
} from '../../constants/api'
import { videoUrlConvert } from '../../utils'

const styles = {
    map:{
        height:600
    }
}
class EditLblView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open: false,
            layer: null,
            record: null
        }
        this.handleClose = () => {
            this.setState({
                open:!this.state.open
            })
        }
        this.toHtml = (record) => {
            if (record) {
                const { category_id, path, title, descript } = record
                if (category_id.toString() === WX || category_id.toString() === DOC || category_id.toString() === BAIKE) {
                    return `<a href=${path}>${title}</a>`
                } else if (category_id.toString() === IMAGE) {
                    return `<img width="300" height="200" src=${path} />`
                } else if (category_id.toString() === AUDIO) {
                    return `<audio controls src=${path}>浏览器不支持</audio>`
                } else if (category_id.toString() === VIDEO) {
                    const src = videoUrlConvert(path)
                    if (src) {
                        return `<iframe allowfullscreen frameborder=0 width="300" height="200"  src="${src}" controls />`
                    }
                    return '<p>视频显示出错！</p>'
                } else if (category_id.toString() === TEXT) {
                    return `<div><h3>${title}</h3><p>${descript}</p></div>`
                } else {
                    return ''
                }
            }
            return ''
        }
        this.submit = () => {
            const { record } = this.state
            if (record){
                const content = this.toHtml(record)
                console.log('content',content)
                if( content ){
                    const popup  = L.popup()
                    popup.setContent(content)
                    this.state.layer.bindPopup(popup).openPopup()
                    const _geoJsonTemp = this.state.layer.toGeoJSON()
                    _geoJsonTemp.properties._popup = content
                    this._geoJson.features.push(_geoJsonTemp)
                    this.props.changeLbl(JSON.stringify(this._geoJson))
                    this._drawnItems.addLayer(this.state.layer)
                }
                this.setState({
                    layer:null
                })
                this.handleClose()
            } else {
                message.warn('请选择一项!')
            }
        }
        document.oncontextmenu = function () {
            return false
        }
        L.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images'
        //汉化
        L.drawLocal.draw.toolbar.buttons.marker = '标注!'
        L.drawLocal.draw.handlers.marker.tooltip.start = '点击地图进行定位'
        L.drawLocal.draw.toolbar.actions.text = '取消'
        L.drawLocal.draw.toolbar.actions.title = '取消标注'
        L.drawLocal.edit.toolbar.actions.save.title = '保存修改'
        L.drawLocal.edit.toolbar.actions.save.text = '保存'
        L.drawLocal.edit.toolbar.actions.cancel.title = '取消所有修改'
        L.drawLocal.edit.toolbar.actions.cancel.text = '取消'
        L.drawLocal.edit.handlers.remove.tooltip.text = '点击标注删除'
        L.drawLocal.edit.handlers.edit.tooltip.text = '拖拽标注重新定位'
        L.drawLocal.edit.handlers.edit.tooltip.subtext = '点击取消撤销操作'
        L.drawLocal.edit.toolbar.buttons.edit = '修改'
        L.drawLocal.edit.toolbar.buttons.remove = '删除标注'
        L.drawLocal.edit.toolbar.buttons.editDisabled = '没有标注需要修改'
        L.drawLocal.edit.toolbar.buttons.removeDisabled = '没有标注需要删除'
    }
    initMap = yunbook => {
        const url = `${yunbook.path}/{z}/{x}/{y}.png`
        const self = this
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

        this._drawnItems = new L.FeatureGroup().addTo(this._map)
        this._geoJson = {
            type: 'FeatureCollection',
            features: []
        }
        if(yunbook.lbl){
            let  obj = {}
            try {
                obj = JSON.parse(decodeURIComponent(yunbook.lbl))
            } catch (error) {
                console.log(error)
            }
            if (obj && obj.type !== undefined ) {
                this._drawnItems = L.geoJson(obj, {
                    onEachFeature: function (featureData, layer) {
                        if (featureData.geometry.type === 'Point') {
                            var popup = L.popup()
                            popup.setContent(featureData.properties._popup)
                            layer.bindPopup(popup)
                        }
                    }
                }).addTo(this._map)
                for (var id in this._drawnItems._layers) {
                    var _json = this._drawnItems._layers[id].toGeoJSON()
                    _json.properties._id = this._drawnItems._layers[id]._leaflet_id
                    this._geoJson.features.push(_json)
                }
            }
        }
        new L.Control.Draw({
            edit: {
                featureGroup: this._drawnItems,
                edit: {
                    selectedPathOptions: {
                        maintainColor: true,
                        opacity: 0.3
                    }
                }
            },
            draw: {
                polyline: false,
                polygon: false,
                rectangle: false,
                circle: false
            }
        }).addTo(this._map)
        // function removeLayer(id) {
        //     self._drawnItems.removeLayer(id)
        //     removeGeoJson(id)
        // }
        function updateGeoJson(geoJson) {
            self._geoJson.features = self._geoJson.features.map(item=>{
                if(item.properties._id === geoJson.properties._id){
                    return geoJson
                }
                return item
            })
            self.props.changeLbl(JSON.stringify(self._geoJson))
        }
        function findGeoJson(id) {
            return self._geoJson.features.find( item=>item.properties._id === id)
        }

        function removeGeoJson(id) {
            self._geoJson.features = self._geoJson.features.filter( item=>item.properties._id !== id)
            self.props.changeLbl(JSON.stringify(self._geoJson))
        }
        this._map.on('draw:created',e=>{
            const layer = e.layer
            const type = e.layerType
            if( type === 'marker' ){
                self.handleClose()
                self.setState({
                    layer:layer
                })
            }
        })
        this._map.on('draw:edited', function (e) {
            e.layers.eachLayer(function (_layer) {
                const tmp = findGeoJson(_layer._leaflet_id)
                if (tmp != undefined) {
                    const latLng = _layer.getLatLng()
                    tmp.geometry.coordinates = [latLng.lng, latLng.lat]
                    updateGeoJson(tmp)
                }
            })
        })
        this._map.on('draw:deleted', function (e) {
            e.layers.eachLayer(function (_layer) {
                removeGeoJson(_layer._leaflet_id)
            })
        })
        this._map.on('mousedown', function drawPoly(e) {
            e.originalEvent.preventDefault()
            // this._map.dragging.disable(); 如果不是右击则退出
            if (2 != e.originalEvent.button) {
                return false
            }
            var polyLine = new L.Polyline([])
            self._drawnItems.addLayer(polyLine)
            self._map.on('mousemove', function (e) {
                polyLine.addLatLng(e.latlng)
            })
            self._map.on('mouseup', function () {
                self._map.off('mousemove')
                self._map.off('mouseup')
                const polyLineTmp = polyLine.toGeoJSON()
                polyLineTmp.properties._id = polyLine._leaflet_id
                self._geoJson.features.push(polyLineTmp)
                self.props.changeLbl(JSON.stringify(self._geoJson))
                // polyLine.bindPopup('<div><i class="fa fa-trash" onClick="removeLayer(' + polyLine._leaflet_id + ')"</div></i>')
            })
        })
    }
    componentWillReceiveProps(nextProps) {
        const { yunbook } = nextProps
        if(this._map || !yunbook) return
        this.initMap(yunbook)
    }
    componentDidMount(){
        const { yunbook } = this.props
        if(this._map || !yunbook) return
        this.initMap(yunbook)
    }
    render(){
        return (
            <div>
                <Modal
                    visible={this.state.open}
                    onCancel={this.handleClose}
                    onOk = {this.submit}
                    width = {720}
                    maskClosable = {false} >
                    <div style={{margin: '20px 10px'}}>
                        <ResourceSelect onChange={record => this.setState({record})} />
                    </div>
                </Modal>
                <div id = '_map' style ={ styles.map }></div>
            </div>
        )
    }
}

EditLblView.propTypes = {
  yunbook: React.PropTypes.object,
  changeLbl: React.PropTypes.func
}

export default EditLblView
