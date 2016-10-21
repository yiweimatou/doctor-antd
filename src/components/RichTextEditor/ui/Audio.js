import React, {Component} from 'react';
import {Entity} from 'draft-js'

class Audio extends Component {
    render() {
        const entity = Entity.get(this.props.entityKey)
        let {src} = entity.getData() 
        return (
            <audio src={src} controls>是时候换个浏览器了</audio>
        );
    }
}

export default Audio;