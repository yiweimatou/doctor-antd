import React, {Component} from 'react';
import Image from './Image'
import { Tabs } from 'antd'
const TabPen = Tabs.TabPane

class Resource extends Component {
    render() {
        return (
            <Tabs defaultActiveKey='1'>
                <TabPen key='1' tab='图片'>
                    <Image />
                </TabPen>
                <TabPen key='2' tab='视频'>
                </TabPen>
                <TabPen key='3' tab='音频'>
                </TabPen>
                <TabPen key='4' tab='百科'>
                </TabPen>
                <TabPen key='5' tab='微信'>
                </TabPen>
                <TabPen key='6' tab='文献'>
                </TabPen>
            </Tabs>
        );
    }
}

export default Resource;