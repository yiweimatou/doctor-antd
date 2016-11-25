import React, { Component } from 'react'
import { Entity, Modifier, EditorState } from 'draft-js'
import { createPlugin, pluginUtils } from 'draft-extend'
import { Button, Modal, message } from 'antd'
import LinkSelect from '../../Resource/LinkSelect'
import { WX, DOC, BAIKE } from '../../../constants/api'
import './index.css'

const ENTITY_TYPE = 'LINK'
class baike extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            record: null
        }
    }
    toggleVisible = () => this.setState({ visible: !this.state.visible })
    okHandler = () => {
        const { record } = this.state
        if (record) {
            const { editorState, onChange } = this.props
            const contentState = Modifier.insertText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                record.title,
                null,
                Entity.create(
                    ENTITY_TYPE,
                    'MUTABLE',
                    {
                        href: record.path,
                        target: '_blank',
                        title: record.title,
                        descript: record.descript,
                        name: 'baike',
                        className: 'icon-artboard f-fc4'
                    }
                )
            );
            onChange(
                EditorState.push(
                    editorState,
                    contentState,
                    'apply-entity'
                )
            )
            this.toggleVisible()
        } else {
            message.warn('请至少选择一项！')
        }
    }
    render() {
        const { visible } = this.state
        return (
            <div>
                <Modal
                    visible={visible}
                    title="选择百科"
                    onOk={this.okHandler}
                    onCancel={this.toggleVisible}
                    maskClosable={false}
                >
                    <LinkSelect category={BAIKE} onChange={val => this.setState({ record: val })} />
                </Modal>
                <Button onClick={() => this.setState({ visible: true })}>添加百科</Button>
            </div>
        )
    }
}

class doc extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            record: null
        }
    }
    toggleVisible = () => this.setState({ visible: !this.state.visible })
    okHandler = () => {
        const { record } = this.state
        if (record) {
            const { editorState, onChange } = this.props
            const contentState = Modifier.insertText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                record.title,
                null,
                Entity.create(
                    ENTITY_TYPE,
                    'MUTABLE',
                    {
                        href: record.path,
                        target: '_blank',
                        name: 'doc',
                        title: record.title,
                        descript: record.descript,
                        className: 'icon-wenxian f-fc3'
                    }
                )
            );
            onChange(
                EditorState.push(
                    editorState,
                    contentState,
                    'apply-entity'
                )
            )
            this.toggleVisible()
        } else {
            message.warn('请至少选择一项！')
        }
    }
    render() {
        const { visible } = this.state
        return (
            <div>
                <Modal
                    visible={visible}
                    title="选择文献"
                    onOk={this.okHandler}
                    onCancel={this.toggleVisible}
                    maskClosable={false}
                >
                    <LinkSelect category={DOC} onChange={val => this.setState({ record: val })} />
                </Modal>
                <Button onClick={() => this.setState({ visible: true })}>添加文献</Button>
            </div>
        )
    }
}
class weixin extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            record: null
        }
    }
    toggleVisible = () => this.setState({ visible: !this.state.visible })
    okHandler = () => {
        const { record } = this.state
        if (record) {
            const { editorState, onChange } = this.props
            const contentState = Modifier.insertText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                record.title,
                null,
                Entity.create(
                    ENTITY_TYPE,
                    'MUTABLE',
                    {
                        href: record.path,
                        target: '_blank',
                        name: 'wx',
                        title: record.title,
                        descript: record.descript,
                        className: 'icon-weixin f-fc2'
                    }
                )
            );
            onChange(
                EditorState.push(
                    editorState,
                    contentState,
                    'apply-entity'
                )
            )
            this.toggleVisible()
        } else {
            message.warn('请选择一项！')
        }
    }
    render() {
        const { visible } = this.state
        return (
            <div>
                <Modal
                    visible={visible}
                    title="选择微信"
                    onOk={this.okHandler}
                    onCancel={this.toggleVisible}
                    maskClosable={false}
                >
                    <LinkSelect category={WX} onChange={val => this.setState({ record: val })} />
                </Modal>
                <Button onClick={() => this.setState({ visible: true })}>添加微信</Button>
            </div>
        )
    }
}


const LinkDecorator = {
    strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
    component: (props) => {
        const entity = Entity.get(props.entityKey)
        const { href, name, target, title, descript, className } = entity.getData()
        return (
            <a className="currencyStyle" name={name} href={href} target={target}>
                <i className={className}></i>
                <div>
                    <span>{title}</span>
                    <em>{descript}</em>
                </div> 
            </a>
        )
    }
}

// Convert links in input HTML to entities
const htmlToEntity = (nodeName, node) => {
    if (nodeName === 'a') {
        return Entity.create(
            ENTITY_TYPE,
            'MUTABLE',
            {
                href: node.getAttribute('href'),
                target: node.getAttribute('target'),
                name: node.getAttribute('name'),
                title: node.getAttribute('title'),
                descript: node.getAttribute('descript'),
                className: node.childNodes[0].getAttribute('class')
            }
        )
    }
};

// Convert entities to HTML for output
const entityToHTML = (entity, originalText) => {
    if (entity.type === ENTITY_TYPE) {
        const { href, name, target, className, title, descript } = entity.data
        return `<a href="${href}" class="currencyStyle" name="${name}" target="${target}" title="${title}" descript="${descript}"><i class="${className}" /><div><span>${title}</span><em>${descript}</em></div></a>`;
    }
    return originalText;
};

const LinkPlugin = createPlugin({
    displayName: 'LinkPlugin',
    buttons: [ weixin, doc, baike ],
    decorators: [LinkDecorator],
    htmlToEntity,
    entityToHTML
});

export default LinkPlugin;
