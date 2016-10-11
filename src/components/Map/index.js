import React, {Component, PropTypes} from 'react';
import { loadJS } from '../../utils'

class Map extends Component {
    initialMap = () => {
        if (!window.qq || !window.qq.maps || !window.qq.maps.LatLng) return
        const { latLng } = this.props 
        let center = new window.qq.maps.LatLng(39.916527,116.397128);        
        if (latLng.lat !== 0) {
            center = new window.qq.maps.LatLng(latLng.lat, latLng.lng)
        }
        this.map = new window.qq.maps.Map(document.getElementById('map'),{
                center: center,
                zoom: 13
        });
        if (latLng.lat === 0) {
            //获取城市列表接口设置中心点
            const citylocation = new window.qq.maps.CityService({
                    complete : result => {
                        this.map.setCenter(result.detail.latLng);
                    }
            });
            //调用searchLocalCity();方法    根据用户IP查询城市信息。
            citylocation.searchLocalCity();
        } else {
            //初始化marker
             this._marker = new window.qq.maps.Marker({
                position: center,
                map: this.map
            });
            this._marker.setMap(this.map)
        }
        this.clickHandler()
    }
    clickHandler = () => {
        const { setAddress } = this.props
        const geocoder = new window.qq.maps.Geocoder({
            complete: function(result) {
                setAddress(result.detail.address, result.detail.location)
            }
        })
        //添加监听事件   获取鼠标单击事件
        window.qq.maps.event.addListener(this.map, 'click', event => {
            if (this._marker && this._marker.getMap()) {
                this._marker.setMap(null)
            }
            geocoder.getAddress(event.latLng)                               
            var marker = new window.qq.maps.Marker({
                position: event.latLng, 
                map: this.map
            });    
            window.qq.maps.event.addListener(this.map, 'click', () => {
                marker.setMap(null)      
            });
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.latLng.lat == 0 || this.props.latLng.lat == nextProps.latLng.lat) return
        if (!window.qq || !window.qq.maps || !window.qq.maps.LatLng || !this.map) return
        this._marker = new window.qq.maps.Marker({
            position: new window.qq.maps.LatLng(nextProps.latLng.lat, nextProps.latLng.lng),
            map: this.map
        })
    }
    componentDidMount() {
        if (!window.init) {
            window.init = this.initialMap
        }
        loadJS('http://map.qq.com/api/js?v=2.exp&key=OW6BZ-XQ4KU-BFAVP-BV5JG-ACYN2-P7FOJ&callback=init')
    }   
    shouldComponentUpdate() {
        return false
    }
    render() {
        return (
            <div id = 'map' style = {{height: 200, width: '100%'}}></div>
        );
    }
}

Map.propTypes = {
    latLng: PropTypes.object,
    setAddress: PropTypes.func.isRequired
}

export default Map;