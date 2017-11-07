import React, { Component } from 'react'
import { Tabs } from 'antd'
import { connect } from 'react-redux'
import OrganizeBar from '../organize_bar'
import Link from '../link/list'
import Referee from './referee'
import Doctor from './doctor'
import Saler from './saler'
import Dealer from './dealer'

const TabPane = Tabs.TabPane
class person extends Component {
  constructor(props) {
    super(props)
    this.state = {
      organize: {}
    }
  }

  componentWillMount() {
    const organize = this.props.organize
    if (organize.id) {
      this.setState({ organize })
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const organize = nextProps.organize
    if (organize.id && this.state.organize.id != organize.id) {
      this.setState({
        organize
      })
    }
  }
  
  render() {
    const { organize } = this.state
    return (
      <div>
        <OrganizeBar organize={organize} selectedKey="person" />
        <Tabs defaultActiveKey="link">
          <TabPane tab="成员" key="link">
            <Link id={organize.id} />
          </TabPane>
          <TabPane tab="医药代表" key="referee">
            <Referee id={organize.id} />
          </TabPane>
          <TabPane tab="签约医生" key="doctor">
            <Doctor id={organize.id} />
          </TabPane>
          <TabPane tab="销售" key="saler">
            <Saler id={organize.id} />
          </TabPane>
          <TabPane tab="经销商" key="dealer">
            <Dealer id={organize.id} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default connect(
  state => ({
    organize: state.organize.entity
  })
)(person)