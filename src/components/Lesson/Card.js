import React, { Component } from 'react'
import LessonBar from './LessonBar'
import BusinessCard from '../BusinessCard'
import { LESSON_BUSINESSCARD } from '../../constants'

class LessonBusinessCard extends Component {
    render() {
        const id = this.props.params.id
        return (
            <div>
                <LessonBar current='card' lid={id}/>
                <BusinessCard type='lesson' srcs={LESSON_BUSINESSCARD} id={id} />
            </div>
        );
    }
}

export default LessonBusinessCard