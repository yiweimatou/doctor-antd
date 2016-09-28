import React, {Component} from 'react';
import { Tabs } from 'antd'
import New from './New'
import List from './List'
const TabPane = Tabs.TabPane

class Manage extends Component {
    render() {
        return (
           <Tabs defaultActiveKey='2'>
                <TabPane tab='我的云板书' key ='2'>
                    <List />
                </TabPane>
                <TabPane tab='新建云板书' key='1'>
                    <New />
                </TabPane>
           </Tabs>
        );
    }
}

export default Manage;