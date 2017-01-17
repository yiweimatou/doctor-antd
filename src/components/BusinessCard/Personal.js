import React from 'react'
import BusinessCard from './index'
import { PERSONAL_BUSINESSCARD } from '../../constants'

const PersonalBusinessCard = () => (
    <BusinessCard srcs={PERSONAL_BUSINESSCARD} type="account" id={JSON.parse(localStorage.getItem('auth')).key}/>
)

export default PersonalBusinessCard
