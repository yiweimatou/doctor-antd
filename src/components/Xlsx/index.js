import React, { Component } from 'react';

class Xlsx extends Component {
    tick = () => {
        if (window.XLSX) {
            clearInterval(this.interval)
        }
    }
    componentDidMount() {
        if (window.XLSX) {
            return
        } else {
            document.write(<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.core.min.js"></script>)
            this.interval = setInterval(this.tick, 1000)
        }
    }
    render() {
        return (null)
    }
}

export default Xlsx