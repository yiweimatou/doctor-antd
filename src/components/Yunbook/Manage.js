import React, {Component} from 'react';
import { Tabs } from 'antd'
import New from './New'
import List from './List'
import { UPLOAD_YUNBOOK_API, UPLOAD_PPT_API } from '../../constants/api'
const TabPane = Tabs.TabPane

class Manage extends Component {
    state = {
        activeKey: '2'
    }
    render() {
        return (
           <Tabs defaultActiveKey='2' activeKey={this.state.activeKey} onTabClick={
               activeKey => this.setState({ activeKey })
           }>
                <TabPane tab='我的云板书' key ='2'>
                    <List />
                </TabPane>
                <TabPane tab='图片转云板书' key='1'> 
                    <New addAfterHandler={() => this.setState({ activeKey: '2' })} action={UPLOAD_YUNBOOK_API}/>
                </TabPane>
                <TabPane tab='PPT转云板书' key='3'>
                    <New addAfterHandler={() => this.setState({ activeKey: '2' })} action={UPLOAD_PPT_API}/>
                </TabPane>
           </Tabs>
        );
    }
}

export default Manage;