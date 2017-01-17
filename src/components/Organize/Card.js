import React, { Component } from 'react'
import { connect } from 'react-redux'
import OrganizeBar from './organize_bar'
import { ORGANIZE_BUSINESSCARD } from '../../constants'
import BusinessCard from '../BusinessCard'

class OrganzieBusinessCard extends Component {
    render () {
        return (
            <div>
                <OrganizeBar selectedKey="card" organize={this.props.organize} />
                <BusinessCard id={this.props.params.id} type="organize" srcs={ORGANIZE_BUSINESSCARD} />
            </div>
        )
    }
}

export default connect(
    state => ({
        organize: state.organize.entity
    })
)(OrganzieBusinessCard)