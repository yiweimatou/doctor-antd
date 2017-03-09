import React,{ Component,PropTypes } from 'react'
import { Card, Icon, Modal } from 'antd'
import { Link } from 'react-router'
import './index.css'

const styles ={
    card:{
        width:240,
        marginBottom: 20
    },
    bodyStyle:{
        padding:0
    }
}
class YunbookCard extends Component{
    static propTypes = {
        yunbook:PropTypes.object
    }

    remove = id => {
        Modal.confirm({
            onOk: () => {
                this.props.afterDel(id)
            },
            title: '确认',
            content: '是否删除?'
        })
    }

    render(){
        const {
            yunbook
        } = this.props
        return(
            <Card
                style={styles.card}
                bodyStyle = {styles.bodyStyle}
            >
                <div className='yunbook-image'>
                    <Link to={`/yunbook/show?yid=${yunbook.id}`}>
                        <img alt='pic' width="256" height ='160' src={yunbook.cover} />
                    </Link>
                </div>
                <div className='yunbook-card'>
                    <a onClick={this.props.onClick}><Icon type="to-top" />发布到课程</a>
                    <div style={{ float: 'right' }}>
                        <Link 
                            to={`/yunbook/edit/${yunbook.id}`}
                            style={{ marginRight: 5 }}
                        >
                            编辑
                            <Icon type="edit" />
                        </Link>
                        <a onClick={() => this.remove(yunbook.id)}>
                            删除<Icon type="close" />
                        </a>
                    </div>
                    
                    <h3 style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{yunbook.title}</h3>
                </div>
            </Card>
        )
    }
}

export default YunbookCard