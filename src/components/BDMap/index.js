import React, {Component} from 'react';

class BDMap extends Component {
    tick = () => {
        if (window.BMap) {
            clearInterval(this.interval)            
            this.map = new window.BMap.Map('bmap')
            const point = new window.BMap.Point(120.17, 30.24)
            this.map.centerAndZoom(point, 10)
            this.map.addControl(new window.BMap.NavigationControl())
            var marker = new window.BMap.Marker(point)        // 创建标注    
            this.map.addOverlay(marker)
            marker.enableDragging()
            marker.addEventListener('dragend', function(e){    
                alert('当前位置：' + e.point.lng + ', ' + e.point.lat);    
            })
        }
    }
    componentDidMount() {
        document.write('<script src="http://api.map.baidu.com/api?v=2.0&ak=Vs7EkRxWqVopmUVvSRXNd7VdTIouvH5p"><\/script>')
        this.interval = setInterval(this.tick, 1000)
    }   
    render() {
        return (
            <div id = 'bmap' style = {{height: 725, width: '100%'}}></div>
        );
    }
}

export default BDMap;