import React, {Component} from 'react';
import Image from './Image'
import Baike from './Baike'
import Audio from './Audio'
import Video from './Video'
import Doc from './Doc'
import WX from './WX'
import Text from './Text'
import { Tabs, Button, Modal } from 'antd'
import {add, list, info, remove, edit} from '../../services/source'
import {add as grow} from '../../services/grow'
import help from '../../services/help'
const TabPane = Tabs.TabPane

class Resource extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
            title: '',
            visible: false
        }
    }

    componentWillMount() {
        help.get({ id: 14 }).then(data => {
            this.setState({
                content: data.get.content,
                title: data.get.title
            })
        })
    }
    
    visibleToggle = () => this.setState(prevState => ({
        visible: !prevState.visible
    }))
    _add = params => {
        return add(params)
    }
    _list = params => {
        return list(params)
    }
    _info = params => {
        return info(params)
    }
    _remove = params => {
        return remove(params)
    }
    render() {
        const { content, title, visible } = this.state 
        return (
            <div>
            <Tabs defaultActiveKey='1'>
                <TabPane key='1' tab='图片'>
                    <Image add={this._add} edit={edit} list={this._list} info={this._info} remove={this._remove}/>
                </TabPane>
                <TabPane key='2' tab='视频'>
                    <Video add={this._add} edit={edit} list={this._list} info={this._info} grow={grow} remove={this._remove}/>
                </TabPane>
                <TabPane key='3' tab='音频'>
                    <Audio add={this._add} edit={edit} list={this._list} info={this._info} grow={grow} remove={this._remove}/>
                </TabPane>
                <TabPane key='4' tab='百科'>
                    <Baike add={this._add} edit={edit} list={this._list} info={this._info} grow={grow} remove={this._remove}/>
                </TabPane>
                <TabPane key='5' tab='微信'>
                    <WX add={this._add} edit={edit} list={this._list} info={this._info} grow={grow} remove={this._remove}/>
                </TabPane>
                <TabPane key='6' tab='文献'>
                    <Doc add={this._add} edit={edit} list={this._list} info={this._info} grow={grow} remove={this._remove} />
                </TabPane>
                <TabPane key='7' tab='名词'>
                    <Text add={this._add} edit={edit} list={this._list} info={this._info} remove={this._remove}/>
                </TabPane>
            </Tabs>
            <Button type="primary" style={{ position: 'absolute', top: 115, right: 75 }} onClick={this.visibleToggle}>帮助</Button>
            <Modal title={title} visible={visible} onOk={this.visibleToggle} onCancel={this.visibleToggle}>
                <div dangerouslySetInnerHTML={{ __html: content }}/>
            </Modal>
            </div>
        );
    }
}

export default Resource;
