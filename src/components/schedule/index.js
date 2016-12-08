import React, { Component } from 'react'
import { get, add, edit } from '../../services/timetable'
import { message, Spin, Button } from 'antd'
import Item from './item'
import './index.css'

class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: 0,
            loading:  true,
            data: {
                mon_am: '', mon_pm: '', mon_mm: '',
                tue_am: '', tue_pm: '', tue_mm: '',
                wed_am: '', wed_pm: '', wed_mm: '',
                thu_am: '', thu_pm: '', thu_mm: '',
                fri_am: '', fri_pm: '', fri_mm: '',
                sat_am: '', sat_pm: '', sat_mm: '',
                sun_am: '', sun_pm: '', sun_mm: ''
            },
            editable: false
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.editHandler = this.editHandler.bind(this)
    }
    componentWillMount() {
        const auth = localStorage.getItem('auth')
        let userId = 0
        if (auth) {
            userId = JSON.parse(auth).key
            this.setState({ userId })
        } else {
            return
        }
        get({ account_id: userId }).then((data) => {
            if (data.get.id > 0) {
                this.setState({ data: data.get })
            }
            this.setState({ loading: false })
        })
        .catch(error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }
    
    changeHandler(value, target) {
        this.setState((prevState) => {
            prevState.data[target] = value
            return {
                data: prevState.data
            }
        })
    }
    editHandler() {
        this.setState((prevState) => ({
            editable: !prevState.editable
        }))
    }
    submitHandler = () => {
        const { data } = this.state
        this.setState({ loading: true })
        if (data.id > 0) {
            edit(data).then(() => {
                message.success('保存成功！')
                this.setState({ loading: false, editable: false })
            }).catch(error => {
                message.error(error)
                this.setState({ loading: false })
            })
        } else {
             add(data).then((result) => {
                message.success('保存成功！')
                this.setState((prevState) => ({
                    data: {
                        ...prevState.data,
                        id: result.identity
                    },
                    loading: false,
                    editable: false,
                }))
            }).catch(error => {
                message.error(error)
                this.setState({ loading: false })
            })
        }
    }
    render() {
        const { loading, data, editable } = this.state
        let btn = null
        if (editable) {
            btn = (
                <div>
                    <Button onClick={this.submitHandler} type="primary">保存</Button>
                    <Button onClick={this.editHandler} style={{ marginLeft: '10px'}}>取消</Button>
                </div>
            )
        } else {
            btn = (
                <Button onClick={this.editHandler} type="primary">编辑</Button>
            )
        }
        const date = []
        const oneDay = 1000*60*60*24
        let today = new Date()
        let time = today.getTime()
        let dayOfWeek = today.getDay()
        date[dayOfWeek] = `${today.getMonth() + 1}月${today.getDate()}日`
        while (dayOfWeek > 0) {
            time = time - oneDay
            today.setTime(time)
            dayOfWeek = today.getDay()
            date[dayOfWeek] = `${today.getMonth() + 1}月${today.getDate()}日`
        }
        today = new Date()
        time = today.getTime()
        while (dayOfWeek < 6) {
            time = time + oneDay
            today.setTime(time)
            dayOfWeek = today.getDay()
            date[dayOfWeek] = `${today.getMonth() + 1}月${today.getDate()}日`
        }
        return (
            <Spin spinning={loading}>
                <div style={{ float: 'right', margin: '20px' }}>
                    { btn }
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>周日<div>{date[0]}</div></th>
                            <th>周一<div>{date[1]}</div></th>
                            <th>周二<div>{date[2]}</div></th>
                            <th>周三<div>{date[3]}</div></th>
                            <th>周四<div>{date[4]}</div></th>
                            <th>周五<div>{date[5]}</div></th>
                            <th>周六<div>{date[6]}</div></th>            
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="td">上午</td>
                            <td><Item content={data.mon_am} editable={editable} onChange={(value) => this.changeHandler(value, 'mon_am')}/></td>
                            <td><Item content={data.tue_am} editable={editable} onChange={(value) => this.changeHandler(value, 'tue_am')}/></td>
                            <td><Item content={data.wed_am} editable={editable} onChange={(value) => this.changeHandler(value, 'wed_am')}/></td>
                            <td><Item content={data.thu_am} editable={editable} onChange={(value) => this.changeHandler(value, 'thu_am')}/></td>
                            <td><Item content={data.fri_am} editable={editable} onChange={(value) => this.changeHandler(value, 'fri_am')}/></td>
                            <td><Item content={data.sat_am} editable={editable} onChange={(value) => this.changeHandler(value, 'sat_am')}/></td>
                            <td><Item content={data.sun_am} editable={editable} onChange={(value) => this.changeHandler(value, 'sun_am')}/></td> 
                        </tr>
                        <tr>
                            <td className="td">下午</td>
                            <td><Item content={data.mon_pm} editable={editable} onChange={(value) => this.changeHandler(value, 'mon_pm')}/></td>
                            <td><Item content={data.tue_pm} editable={editable} onChange={(value) => this.changeHandler(value, 'tue_pm')}/></td>
                            <td><Item content={data.wed_pm} editable={editable} onChange={(value) => this.changeHandler(value, 'wed_pm')}/></td>
                            <td><Item content={data.thu_pm} editable={editable} onChange={(value) => this.changeHandler(value, 'thu_pm')}/></td>
                            <td><Item content={data.fri_pm} editable={editable} onChange={(value) => this.changeHandler(value, 'fri_pm')}/></td>
                            <td><Item content={data.sat_pm} editable={editable} onChange={(value) => this.changeHandler(value, 'sat_pm')}/></td>
                            <td><Item content={data.sun_pm} editable={editable} onChange={(value) => this.changeHandler(value, 'sun_pm')}/></td>
                        </tr>
                        <tr>
                            <td className="td">晚上</td>
                            <td><Item content={data.mon_mm} editable={editable} onChange={(value) => this.changeHandler(value, 'mon_mm')}/></td>
                            <td><Item content={data.tue_mm} editable={editable} onChange={(value) => this.changeHandler(value, 'tue_mm')}/></td>
                            <td><Item content={data.wed_mm} editable={editable} onChange={(value) => this.changeHandler(value, 'wed_mm')}/></td>
                            <td><Item content={data.thu_mm} editable={editable} onChange={(value) => this.changeHandler(value, 'thu_mm')}/></td>
                            <td><Item content={data.fri_mm} editable={editable} onChange={(value) => this.changeHandler(value, 'fri_mm')}/></td>
                            <td><Item content={data.sat_mm} editable={editable} onChange={(value) => this.changeHandler(value, 'sat_mm')}/></td>
                            <td><Item content={data.sun_mm} editable={editable} onChange={(value) => this.changeHandler(value, 'sun_mm')}/></td>                    
                        </tr>
                    </tbody>
                </table>
            </Spin>
        )
    }
}

export default Schedule