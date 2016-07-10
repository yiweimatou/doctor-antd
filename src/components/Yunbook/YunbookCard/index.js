import React,{ Component,PropTypes } from 'react'
import { Card,Icon } from 'antd'
import { Link } from 'react-router'
import './index.css'

const styles ={
    card:{
        width:240
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
                    <Link to={`/yunbook/show/${yunbook.bid}`}>
                        <img alt='pic' width="100%" src={yunbook.cover} />
                    </Link>
                </div>
                <div className='yunbook-card'>
                    <Link 
                        to={`/yunbook/edit/${yunbook.bid}`}
                        style = {{float:'right'}}
                    >
                        <Icon type="edit" />
                    </Link>
                    <h3>{yunbook.title}</h3>
                </div>
            </Card>
        )
    }
}

export default YunbookCard