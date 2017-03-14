import React, { Component } from 'react'
import { Col, Button, Tabs } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import OrganizeBar from '../organize_bar'
import organize_product from '../../../services/organize_product'
import { DEFAULT_COVER } from '../../../constants/api'
import ProductEdit from './edit'
import ProductSetting from './setting'
import ProductRecord from './record'
import ProductQrcode from './qrcode'

class ProductDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      product: {},
      visible: false
    }
  }
  componentWillMount() {
    organize_product.get({ id: this.props.params.pid }).then(data => {
      this.setState({ product: data.get })
    })
  }

  visibleToggle = () => this.setState(prevState => ({
    visible: !prevState.visible
  }))

  okHandler = product => {
    return organize_product.edit(product).then(() =>
    this.setState(prevState => ({
      product: {
        ...prevState.product,
        ...product
      },
      visible: false
    })))
  }
  
  render() {
    const { organize } = this.props
    const { product, visible } = this.state
    return (
      <div>
        <OrganizeBar organize={organize} selectedKey="product" />
        <div style={{ margin: '20px 0', display: 'flex' }}>
          <Button style={{ marginRight: 10 }}>
            <Link to={`/organize/${organize.id}/product`}>返回产品列表</Link>
          </Button>
          <h3>{product.title}</h3>
        </div>
        <Tabs defaultActiveKey="detail" tabPosition="right">
            <Tabs.TabPane tab="产品信息" key="detail">
              <ProductEdit product={product} visible={visible} onCancle={this.visibleToggle} onOk={this.okHandler}/>
              <Col span={12}>
                <img src={product.cover || DEFAULT_COVER} width="100%" />
              </Col>
              <Col span={11} offset={1}>
                <h3>{product.title}</h3>
                <span>创建时间: {(new Date(product.add_ms * 1000)).toLocaleString()}</span>
                <p>{product.descript}</p>
                <Button type="primary" onClick={this.visibleToggle}>编辑</Button>
                <Button style={{ marginLeft: 10 }}><Link to={`/lesson/show/${product.lesson_id}`}>课程详情</Link></Button>
              </Col>
            </Tabs.TabPane>
            <Tabs.TabPane tab="红包设置" key="setting">
              <ProductSetting product={product}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="产品二维码" key="qrcode">
              <ProductQrcode pid={product.id} id={organize.id}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="购买记录" key="records">
              <ProductRecord id={organize.id} pid={product.id}/>
            </Tabs.TabPane>
          </Tabs>
      </div>
    );
  }
}

export default connect(
  state => ({
    organize: state.organize.entity
}))(ProductDetail)