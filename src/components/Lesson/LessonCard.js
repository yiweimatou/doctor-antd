import React,{ Component,PropTypes } from 'react'
import { Link } from 'react-router'
import './LessonCard.css'
import ChooseBar from '../Section/ChooseBar'

class LessonCard extends Component{
    render(){
        const {
            lesson
        } = this.props
        return(
            <div>
               <Link className='courseList' to={`/section/draft/?oid=0&lid=${lesson.id}`}>
                    <div className="courseImg">
                        <img src={lesson.cover} width='256' height='96'/>
                        {lesson.state === 2 ?
                        <em style={{
                            position: 'absolute',left: 10,top: 20, display: 'inline-block',
                            textAlign: 'center',width: 256, height: 100, lineHeight: '100px', 
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            fontSize: '200%',
                            color: 'white'
                        }}
                        >
                            未上架
                        </em>:null}
                    </div>
                    <div className="lessonTitle">
                        <span>{lesson.title}</span>
                    </div>
                    <ul className="courseOther">
                        <li>
                            <em>学员数</em><span>{lesson.uv||0}</span>
                        </li>
                        <li>
                            <em>浏览量</em><span>{lesson.pv||0}</span>
                        </li>
                    </ul>
                </Link>
                <div className="newArticle">
                    <ChooseBar lid={lesson.id.toString()} oid="0" />
                </div>
            </div>
        )
    }
}

LessonCard.propTypes = {
    lesson:PropTypes.object
}

export default LessonCard