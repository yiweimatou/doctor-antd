import React, { Component } from 'react';
import { loadJS } from '../../utils'
import { DEFAULT_LOGO } from '../../constants/api'

class Simditor extends Component {
    state = {
        content: '',
    }
    tick = () => {
        if (window.Simditor) {
            clearInterval(this.interval)
            this.editor = new window.Simditor({
                textarea: $('#editor'),
                defaultImage: DEFAULT_LOGO
            })
            this.editor.setValue(this.state.content)
        }
    }
    getValue = () => {
        return this.editor.getValue()
    }
    shouldComponentUpdate() {
        return false
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.content === '' || nextProps.content === undefined) {
            return
        }
        if (this.editor) {
            this.editor.setValue(nextProps.content)
        } else {
            this.setState({ content: nextProps.content })        
        }
    }
    componentWillUnmount() {
        if (this.editor) {
            this.editor.destroy()
        }
    }
    componentDidMount() {
        if (!window.Simditor) {
            const head= document.getElementsByTagName('head')[0]
            const css = document.createElement('link')
            css.rel= 'stylesheet'
            css.href = 'http://7xp3s1.com1.z0.glb.clouddn.com/simditor.css'
            head.appendChild(css)    
            loadJS('//cdn.bootcss.com/jquery/2.2.4/jquery.min.js', () => {
                loadJS('http://7xp3s1.com1.z0.glb.clouddn.com/module.min.js', () => {
                    loadJS('http://7xp3s1.com1.z0.glb.clouddn.com/hotkeys.min.js', () => {
                        loadJS('http://7xp3s1.com1.z0.glb.clouddn.com/simditor.js', () => {
                            if (window.Simditor) {
                                this.editor = new window.Simditor({
                                    textarea: $('#editor'),
                                    defaultImage: DEFAULT_LOGO
                                })
                                this.editor.setValue(this.state.content)
                            } else {
                                this.interval = setInterval(this.tick, 1000)
                            }
                        })
                    })
                })
            })                      
        } else {
            this.editor = new window.Simditor({
                                    textarea: $('#editor'),
                                    defaultImage: DEFAULT_LOGO
                                })
            this.editor.setValue(this.state.content)
        }
    }
    render() {
        return (
            <textarea id="editor" placeholder="请填写内容" autoFocus>  
            </textarea>
        );
    }
}

export default Simditor;