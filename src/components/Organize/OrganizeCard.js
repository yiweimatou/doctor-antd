import React,{ Component,PropTypes } from 'react'
import { Card,Icon } from 'antd'
import { Link } from 'react-router'
import './OrganizeCard.css'
import { DEFAULT_LOGO } from '../../constants/api'

const styles ={
    card:{
        width: 240,
        marginBottom: 20
    },
    bodyStyle:{
        padding: 0
    }
}
class OrganizeCard extends Component{
    render(){
        const {
            organize
        } = this.props
        return(
            <Card
                style={styles.card}
                bodyStyle = {styles.bodyStyle}
            >
                <div className='organize-image'>
                    <Link to={`/organize/show/${organize.id}`}>
                        <img alt='pic' width="100%" height='160' src={organize.logo || DEFAULT_LOGO} />
                    </Link>
                </div>
                <div className='organize-card'>
                    <Link to={`/organize/edit/${organize.id}`} style = {{float:'right'}}>
                        <Icon type="edit"/>
                    </Link>
                    <h3>{organize.title}</h3>  
                </div>
            </Card>
        )
    }
}

OrganizeCard.propTypes = {
    organize:PropTypes.object
}

export default OrganizeCard