import React, { Component } from 'react'
import { Entity, Modifier, EditorState } from 'draft-js'
import { createPlugin, pluginUtils } from 'draft-extend'
import { Button, Modal, message } from 'antd'
import LinkSelect from '../../Resource/LinkSelect'
import TextSelect from '../../Resource/Text/Select'
import { WX, DOC, TEXT, BAIKE } from '../../../constants/api'

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
                        target: '_blank'
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
class text extends Component {
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
                        target: '_blank'
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
                    title="选择名词"
                    onOk={this.okHandler}
                    onCancel={this.toggleVisible}
                    maskClosable={false}
                >
                    <TextSelect category={TEXT} onChange={val => this.setState({ record: val })} />
                </Modal>
                <Button onClick={() => this.setState({ visible: true })}>添加名词</Button>
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
                        target: '_blank'
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
                        target: '_blank'
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

// Decorator to render links while editing
const LinkDecorator = {
    strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
    component: (props) => {
        const entity = Entity.get(props.entityKey);
        const {href, target} = entity.getData();

        return (
            <a href={href} target={target}>
                {props.children}
            </a>
        );
    }
};

// Convert links in input HTML to entities
const htmlToEntity = (nodeName, node) => {
    if (nodeName === 'a') {
        return Entity.create(
            ENTITY_TYPE,
            'MUTABLE',
            {
                href: node.getAttribute('href'),
                target: node.getAttribute('target')
            }
        )
    }
};

// Convert entities to HTML for output
const entityToHTML = (entity, originalText) => {
    if (entity.type === ENTITY_TYPE) {
        return `<a href="${entity.data.href}" target="${entity.data.target}">${originalText}</a>`;
    }
    return originalText;
};

const LinkPlugin = createPlugin({
    displayName: 'LinkPlugin',
    buttons: [weixin, doc, baike],
    decorators: LinkDecorator,
    htmlToEntity,
    entityToHTML
});

export default LinkPlugin;
