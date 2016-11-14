/* @flow */
import {hasCommandModifier} from 'draft-js/lib/KeyBindingUtil';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {EditorState, Entity, RichUtils, Modifier} from 'draft-js';
import {ENTITY_TYPE} from 'draft-js-utils';
import {
  INLINE_STYLE_BUTTONS,
  BLOCK_TYPE_DROPDOWN,
  BLOCK_TYPE_BUTTONS,
} from './EditorToolbarConfig';
import StyleButton from './StyleButton';
import PopoverIconButton from '../ui/PopoverIconButton';
import ButtonGroup from '../ui/ButtonGroup';
import Dropdown from '../ui/Dropdown';
import IconButton from '../ui/IconButton';
import getEntityAtCursor from './getEntityAtCursor';
import clearEntityForRange from './clearEntityForRange';
import autobind from 'class-autobind';
import cx from 'classnames';
import { Modal } from 'antd'
import ImageSelect from '../../Resource/Image/Select'
import VideoSelect from '../../Resource/Video/Select'
import Select from '../../Resource/Select'
import AudioSeelct from '../../Resource/Audio/Select'
import {BAIKE, WX, DOC} from '../../../constants/api'
import {message} from 'antd'
import './EditorToolbar.css';

import type EventEmitter from 'events';

type ChangeHandler = (state: EditorState) => any;

type Props = {
  className?: string;
  editorState: EditorState;
  keyEmitter: EventEmitter;
  onChange: ChangeHandler;
  focusEditor: Function;
};

type State = {
  showLinkInput: boolean;
  showImageButton: boolean;
  showBaike: boolean;
  showDoc: boolean;
  showWX: boolean;
  ulr: string;
  title: string;
  showVideo: boolean;
  showAudio: boolean;
};

export default class EditorToolbar extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      showLinkInput: false,
      showImageButton: false,
      showBaike: false,
      showDoc: false,
      showWX: false,
      showVideo: false,
      showAudio: false,
      url: '',
      title: '',
    };
  }

  componentWillMount() {
    // Technically, we should also attach/detach event listeners when the
    // `keyEmitter` prop changes.
    this.props.keyEmitter.on('keypress', this._onKeypress);
  }

  componentWillUnmount() {
    this.props.keyEmitter.removeListener('keypress', this._onKeypress);
  }

  render() {
    const {className} = this.props;
    return (
      <div className={cx('toolbar-root', className)}>
        {this._renderInlineStyleButtons()}
        {this._renderBlockTypeButtons()}
        {this._renderLinkButtons()}
        {this._renderMediaButtons()}
        {this._renderLinks()}
        {this._renderUndoRedo()}
      </div>
    );
  }

  _renderBlockTypeDropdown() {
    let blockType = this._getCurrentBlockType();
    let choices = new Map(
      BLOCK_TYPE_DROPDOWN.map((type) => [type.style, type.label])
    );
    if (!choices.has(blockType)) {
      blockType = Array.from(choices.keys())[0];
    }
    return (
      <ButtonGroup>
        <Dropdown
          choices={choices}
          selectedKey={blockType}
          onChange={this._selectBlockType}
        />
      </ButtonGroup>
    );
  }

  _renderBlockTypeButtons() {
    let blockType = this._getCurrentBlockType();
    let buttons = BLOCK_TYPE_BUTTONS.map((type, index) => (
      <StyleButton
        key={String(index)}
        isActive={type.style === blockType}
        label={type.label}
        onToggle={this._toggleBlockType}
        style={type.style}
      />
    ));
    return (
      <ButtonGroup>{buttons}</ButtonGroup>
    );
  }

  _renderInlineStyleButtons() {
    let {editorState} = this.props;
    let currentStyle = editorState.getCurrentInlineStyle();
    let buttons = INLINE_STYLE_BUTTONS.map((type, index) => (
      <StyleButton
        key={String(index)}
        isActive={currentStyle.has(type.style)}
        label={type.label}
        onToggle={this._toggleInlineStyle}
        style={type.style}
      />
    ));
    return (
      <ButtonGroup>{buttons}</ButtonGroup>
    );
  }

  _renderLinkButtons() {
    let {editorState} = this.props;
    let selection = editorState.getSelection();
    let entity = this._getEntityAtCursor();
    let hasSelection = !selection.isCollapsed();
    let isCursorOnLink = (entity != null && entity.type === ENTITY_TYPE.LINK);
    let shouldShowLinkButton = hasSelection || isCursorOnLink;
    return (
      <ButtonGroup>
        <PopoverIconButton
          label="Link"
          iconName="link"
          isDisabled={!shouldShowLinkButton}
          showPopover={this.state.showLinkInput}
          onTogglePopover={this._toggleShowLinkInput}
          onSubmit={this._setLink}
        />
        <IconButton
          label="Remove Link"
          iconName="remove-link"
          isDisabled={!isCursorOnLink}
          onClick={this._removeLink}
          focusOnClick={false}
        />
      </ButtonGroup>
    );
  }

_onVideoOk = () => {
  const {url} = this.state
  if (!url) return message.error('请选择一项')
  let {editorState, onChange} = this.props;
    let contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let entityKey = Entity.create('VIDEO', 'IMMUTABLE', {src: url});
    const updatedContent = Modifier.insertText(contentState, selection, ' ', null, entityKey);
    this.setState({showVideo: false, url: ''})
    onChange(
      EditorState.push(editorState, updatedContent)
    );
    this._focusEditor();
}

_onAudioOk = () => {
  const {url} = this.state
  if (!url) return message.error('请选择一项')
  let {editorState, onChange} = this.props;
    let contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let entityKey = Entity.create('AUDIO', 'IMMUTABLE', {src: url});
    const updatedContent = Modifier.insertText(contentState, selection, ' ', null, entityKey);
    this.setState({showAudio: false, url: ''})
    onChange(
      EditorState.push(editorState, updatedContent)
    );
    this._focusEditor();
}
  _renderMediaButtons = () => {
    return(
      <ButtonGroup>
        <Modal title='选择图片' visible={this.state.showImageButton} onOk={this._onOk} onCancel={this._onCancel} width={720} maskClosable={false}>
          <ImageSelect onChange = {url => this.setState({url})}/>
        </Modal>
        <Modal title="选择视频" visible={this.state.showVideo} onOk={this._onVideoOk} onCancel={()=>this.setState({showVideo: false})} maskClosable={false} width={720}>
          <VideoSelect onChange={url => this.setState({url})}/>
        </Modal>
        <Modal title="选择音频" visible={this.state.showAudio} onOk={this._onAudioOk} onCancel={()=>this.setState({showVideo: false})} maskClosable={false} width={720}>
          <AudioSeelct onChange={(url) => this.setState({url})} />
        </Modal>
        <IconButton label="插入视频" value="插入视频" focusOnClick={false} onClick={() => this.setState({showVideo: true})} />
        <IconButton label="插入音频" value="插入音频" focusOnClick={false} onClick={() => this.setState({showAudio: true})} />
        <IconButton label="插入图片" value="插入图片" focusOnClick={false} onClick={this._toggleShowImage} />
      </ButtonGroup>
    )
  }

  _renderLinks = () => {
    return (
       <ButtonGroup>
        <Modal title='选择百科' maskClosable={false} visible={this.state.showBaike} onOk={() => this._onLinksOk(BAIKE)} onCancel={() => this.setState({showBaike: false})} width={720}>
          <Select category={BAIKE} onChange = {(url, title) => this.setState({url, title})}/>
        </Modal>
        <Modal title='选择微信' maskClosable={false} visible={this.state.showWX} onOk={() => this._onLinksOk(WX)} onCancel={() => this.setState({showWX: false})} width={720}>
          <Select category={WX} onChange = {(url, title) => this.setState({url, title})}/>
        </Modal>
        <Modal title='选择文档' maskClosable={false} visible={this.state.showDoc} onOk={() => this._onLinksOk(DOC)} onCancel={() => this.setState({showDoc: false})} width={720}>
          <Select category={DOC} onChange = {(url, title) => this.setState({url, title})}/>
        </Modal>
        <IconButton label="插入百科" value="插入百科" focusOnClick={false} onClick={() => this.setState({showBaike: true})} />
        <IconButton label="插入微信" value="插入微信" focusOnClick={false} onClick={() => this.setState({showWX: true})} />
        <IconButton label="插入文档" value="插入文档" focusOnClick={false} onClick={() => this.setState({showDoc: true})} />
      </ButtonGroup>
    )
  }

  _onLinksOk = category => {
    const {url, title} = this.state
    if (!url || !title) return message.error('请选择一项')
    let {editorState, onChange} = this.props;
    let contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let entityKey = Entity.create(ENTITY_TYPE.LINK, 'MUTABLE', {url});
    const updatedContent = Modifier.insertText(contentState, selection, title, null, entityKey);
    onChange(
      EditorState.push(editorState, updatedContent)
    );
    switch(category) {
      case WX:
        this.setState({showWX: false, url: '', title: ''})
        break;
      case BAIKE:
        this.setState({showBaike: false, url: '', title: ''})
        break;
      case DOC:
        this.setState({showDoc: false, url: '', title: ''})
        break
      default:
        break
    }
  }

  _onCancel = () => this.setState({showImageButton: false})

  _onOk = () => {
    const {url} = this.state
    if (!url) return message.error('请选择一项')
    let {editorState, onChange} = this.props;
    let contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let entityKey = Entity.create(ENTITY_TYPE.IMAGE, 'IMMUTABLE', {src: url});
    const updatedContent = Modifier.insertText(contentState, selection, ' ', null, entityKey);
    this.setState({showImageButton: false, url: ''})
    onChange(
      EditorState.push(editorState, updatedContent)
    );
    this._focusEditor();
  }

  _toggleShowImage = () => this.setState({showImageButton: !this.state.showImageButton})
  
  _renderUndoRedo() {
    let {editorState} = this.props;
    let canUndo = editorState.getUndoStack().size !== 0;
    let canRedo = editorState.getRedoStack().size !== 0;
    return (
      <ButtonGroup>
        <IconButton
          label="Undo"
          iconName="undo"
          isDisabled={!canUndo}
          onClick={this._undo}
          focusOnClick={false}
        />
        <IconButton
          label="Redo"
          iconName="redo"
          isDisabled={!canRedo}
          onClick={this._redo}
          focusOnClick={false}
        />
      </ButtonGroup>
    );
  }

  _onKeypress(event: Object, eventFlags: Object) {
    // Catch cmd+k for use with link insertion.
    if (hasCommandModifier(event) && event.keyCode === 75) {
      // TODO: Ensure there is some text selected.
      this.setState({showLinkInput: true});
      eventFlags.wasHandled = true;
    }
  }

  _toggleShowLinkInput(event: ?Object) {
    let isShowing = this.state.showLinkInput;
    // If this is a hide request, decide if we should focus the editor.
    if (isShowing) {
      let shouldFocusEditor = true;
      if (event && event.type === 'click') {
        // TODO: Use a better way to get the editor root node.
        let editorRoot = ReactDOM.findDOMNode(this).parentNode;
        let {activeElement} = document;
        let wasClickAway = (activeElement == null || activeElement === document.body);
        if (!wasClickAway && !editorRoot.contains(activeElement)) {
          shouldFocusEditor = false;
        }
      }
      if (shouldFocusEditor) {
        this.props.focusEditor();
      }
    }
    this.setState({showLinkInput: !isShowing});
  }

  _setLink(url: string) {
    let {editorState} = this.props;
    let selection = editorState.getSelection();
    let entityKey = Entity.create(ENTITY_TYPE.LINK, 'MUTABLE', {url});
    this.setState({showLinkInput: false});
    this.props.onChange(
      RichUtils.toggleLink(editorState, selection, entityKey)
    );
    this._focusEditor();
  }

  _removeLink() {
    let {editorState} = this.props;
    let entity = getEntityAtCursor(editorState);
    if (entity != null) {
      let {blockKey, startOffset, endOffset} = entity;
      this.props.onChange(
        clearEntityForRange(editorState, blockKey, startOffset, endOffset)
      );
    }
  }

  _getEntityAtCursor(): ?Entity {
    let {editorState} = this.props;
    let entity = getEntityAtCursor(editorState);
    return (entity == null) ? null : Entity.get(entity.entityKey);
  }

  _getCurrentBlockType(): string {
    let {editorState} = this.props;
    let selection = editorState.getSelection();
    return editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
  }

  _selectBlockType() {
    this._toggleBlockType(...arguments);
    this._focusEditor();
  }

  _toggleBlockType(blockType: string) {
    this.props.onChange(
      RichUtils.toggleBlockType(
        this.props.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle: string) {
    this.props.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }

  _undo() {
    let {editorState} = this.props;
    this.props.onChange(
      EditorState.undo(editorState)
    );
  }

  _redo() {
    let {editorState} = this.props;
    this.props.onChange(
      EditorState.redo(editorState)
    );
  }

  _focusEditor() {
    // Hacky: Wait to focus the editor so we don't lose selection.
    setTimeout(() => {
      this.props.focusEditor();
    }, 50);
  }
}
