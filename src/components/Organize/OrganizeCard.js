import React,{ Component,PropTypes } from 'react'
import { Card,Icon } from 'antd'
import { Link } from 'react-router'
import './OrganizeCard.css'

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
                        <img alt='pic' width="160" height='160' src={organize.logo} />
                    </Link>
                </div>
                <div className='organize-card'>
                <Link 
                            to={`/organize/edit/${organize.id}`}
                            style = {{float:'right'}}
                        >
                            <Icon type="edit" />
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