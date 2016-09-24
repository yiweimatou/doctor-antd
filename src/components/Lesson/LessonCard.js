import React,{ Component,PropTypes } from 'react'
import { Link } from 'react-router'
import './LessonCard.css'

class LessonCard extends Component{
    render(){
        const {
            lesson
        } = this.props
        return(
            <div>
               <Link className='courseList' to={`/lesson/show/${lesson.id}`}>
                    <div className="courseImg">
                        <img src={lesson.cover} width='256' height='96'/>
                    </div>
                    <div className="lessonTitle">
                        <span>{lesson.title}</span>
                    </div>
                    <ul className="courseOther">
                        <li>
                            <em>粉丝数</em><span>{lesson.uv||0}</span>
                        </li>
                        <li>
                            <em>浏览量</em><span>{lesson.pv||0}</span>
                        </li>
                    </ul>
                </Link>
                <div className="newArticle">
                    <Link to={`/section/add/choose?lid=${lesson.id}&oid=0`}>
                        新建文章
                    </Link>
                </div>
            </div>
        )
    }
}

LessonCard.propTypes = {
    lesson:PropTypes.object
}

export default LessonCard