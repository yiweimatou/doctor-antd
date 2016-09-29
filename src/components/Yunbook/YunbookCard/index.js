import React,{ Component,PropTypes } from 'react'
import { Card,Icon } from 'antd'
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
                    <Link 
                        to={`/yunbook/edit/${yunbook.id}`}
                        style = {{float:'right'}}
                    >
                        编辑
                        <Icon type="edit" />
                    </Link>
                    <h3>{yunbook.title}</h3>
                </div>
            </Card>
        )
    }
}

export default YunbookCard