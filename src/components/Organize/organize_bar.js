import React, { PropTypes } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router'
import { DEFAULT_COVER } from '../../constants/api'
import Paper from '../Paper'

const MenuItem = Menu.Item
class OrganizeBar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hidden: false,
		}
	}
	// shouldComponentUpdate = (nextProps) => {
	// 	if (this.props.organize.id === nextProps.organize.id && this.props.organize.logo === nextProps.organize.logo) {
	// 	return false
	// 	} else {
	// 	return true
	// 	}
	// }

	
	componentWillMount() {
		window.addEventListener('resize', this.onResize)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize)
	}
	

	onResize = () => {
		if (window.matchMedia('(min-width: 1500px)').matches) {
			this.setState({ hidden: false })
		} else {
			this.setState({ hidden: true })
		}
	}
	render () {
		const { selectedKey, organize } = this.props
		const menux = !this.state.hidden ? 
			<Menu
				selectedKeys={[ selectedKey || '' ]} mode="horizontal"
				style={{ display: 'inline-block', marginLeft: 20 }}
			>
				<MenuItem key="show" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/show/${organize.id}`}>机构详情</Link>
				</MenuItem>
				<MenuItem key="lesson" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/lesson/${organize.id}`}>认购的课程</Link>
				</MenuItem>
				<MenuItem key="draft" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/draft?oid=${organize.id}&lid=0`}>草稿箱</Link>
				</MenuItem>
				<MenuItem key="section" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/section?oid=${organize.id}&lid=0`}>已发表</Link>
				</MenuItem>
				<MenuItem key="team" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/${organize.id}/team/`}>管理团队</Link>
				</MenuItem>
				<MenuItem key="person" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/${organize.id}/person`}>人员管理</Link>
				</MenuItem>
				<MenuItem key="product" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/${organize.id}/product`}>产品管理</Link>
				</MenuItem>
				<MenuItem key="card" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/card/${organize.id}`}>机构名片</Link>
				</MenuItem>
				<MenuItem key="trade" style={{ height: '80px', lineHeight: '80px' }}>
					<Link to={`/organize/trade/${organize.id}`}>发货管理</Link>
				</MenuItem>
			</Menu> :
			<Menu selectedKeys={[ selectedKey || '' ]} mode="horizontal"
				style={{ display: 'inline-block', marginLeft: 20, height: '80px', lineHeight: '80px' }}
			>
				<Menu.SubMenu title= {<span>导航</span>}>
					<MenuItem key="show">
						<Link to={`/organize/show/${organize.id}`}>机构详情</Link>
					</MenuItem>
					<MenuItem key="lesson">
						<Link to={`/organize/lesson/${organize.id}`}>认购的课程</Link>
					</MenuItem>
					<MenuItem key="draft">
						<Link to={`/organize/draft?oid=${organize.id}&lid=0`}>草稿箱</Link>
					</MenuItem>
					<MenuItem key="section">
						<Link to={`/organize/section?oid=${organize.id}&lid=0`}>已发表</Link>
					</MenuItem>
					<MenuItem key="team">
						<Link to={`/organize/${organize.id}/team/`}>管理团队</Link>
					</MenuItem>
					<MenuItem key="person">
						<Link to={`/organize/${organize.id}/person`}>人员管理</Link>
					</MenuItem>
					<MenuItem key="product">
						<Link to={`/organize/${organize.id}/product`}>产品管理</Link>
					</MenuItem>
					<MenuItem key="card">
						<Link to={`/organize/card/${organize.id}`}>机构名片</Link>
					</MenuItem>
					<MenuItem key="trade">
						<Link to={`/organize/trade/${organize.id}`}>发货管理</Link>
					</MenuItem>
				</Menu.SubMenu>
			</Menu>
		return (
		<Paper>
			<div style={{ margin: '0 10px 10px', height: '80px' }}>
			<div style={{ display: 'inline-block', float: 'left', margin: '5px', width: 70, height: 70 }}>
				<img
				style={{ borderRadius: '50%' }}
				src={ organize.logo || organize.cover || DEFAULT_COVER }
				width="100%" height="100%"
				/>
			</div>
			<div style={{ display: 'inline-block', overflow: 'hidden', height: '80px', lineHeight: '80px', marginLeft: '10px' }}>
				{organize.title}
			</div>
			{ menux }
			</div>
		</Paper>
		)
	}
}

OrganizeBar.propTypes = {
   organize: PropTypes.object.isRequired,
   selectedKey: PropTypes.string
}

export default OrganizeBar
