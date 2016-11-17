import React, {Component, PropTypes} from 'react'
import { Tabs } from 'antd'
import ImageSelect from './Image/Select'
import VideoSelect from './Video/Select'
import AudioSelect from './Audio/Select'
import LinkSelect from './LinkSelect'
import TextSelect from './Text/Select'
import {
    DOC, WX, BAIKE
} from '../../constants/api'

const TabPane = Tabs.TabPane
class ResourceSelect extends Component {
    render() {
        const { onChange } = this.props
        return (
            <Tabs defaultActiveKey='1'>
                <TabPane key='1' tab='图片'>
                    <ImageSelect onChange={onChange} />
                </TabPane>
                <TabPane key='2' tab='视频'>
                    <VideoSelect onChange={onChange} />
                </TabPane>
                <TabPane key='3' tab='音频'>
                    <AudioSelect onChange={onChange} />
                </TabPane>
                <TabPane key='4' tab='百科'>
                    <LinkSelect onChange={onChange} category={BAIKE} />
                </TabPane>
                <TabPane key='5' tab='微信'>
                    <LinkSelect onChange={onChange} category={WX} />
                </TabPane>
                <TabPane key='6' tab='文献'>
                    <LinkSelect onChange={onChange} category={DOC} />
                </TabPane>
                <TabPane key='7' tab='名词'>
                    <TextSelect onChange={onChange} />
                </TabPane>
            </Tabs>
        )
    }
}

ResourceSelect.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default ResourceSelect
