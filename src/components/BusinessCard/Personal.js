import React from 'react'
import BusinessCard from './index'
import { PERSONAL_BUSINESSCARD } from '../../constants'
import Help from '../help'

const PersonalBusinessCard = () => (
    <div>
        <Help help_id={23} />
        <BusinessCard srcs={PERSONAL_BUSINESSCARD} type="account" id={JSON.parse(localStorage.getItem('auth')).key}/>
    </div>
)

export default PersonalBusinessCard
