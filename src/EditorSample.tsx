import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, convertToRaw, Modifier, RichUtils, CompositeDecorator, ContentBlock, ContentState, getDefaultKeyBinding } from 'draft-js';
import { Tag } from './Tag'
import { blocks, decorator } from './RawContent';

type Props = {};

export const EditorSample: React.FC<Props> = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createWithContent(blocks, decorator));
  const editor = useRef<Editor>(null);

  const getColor = () => Math.floor(Math.random() * 255)
  const editorStyle = {
    ...styles.editor,
    color: `rgb(${getColor()},${getColor()},${getColor()})`,
  };

  const onChange = (editorState: EditorState) => {
    const isCompositionMode = editorState.isInCompositionMode();
    if (!isCompositionMode) {
      setEditorState(editorState);
    }
  };

  const focusEditor = () => {
    if (editor.current) {
      editor.current.focus();
    }
  }

  useEffect(() => {
    focusEditor();
  }, []);

  const handleClick = () => {
    console.log("hoge")
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const entity = contentState.createEntity('TAG', 'IMMUTABLE', { label: 'hoge' });
    const key = entity.getLastCreatedEntityKey();
    const modifiedEntity = Modifier.applyEntity(entity, selection, key);
    const newEditorState = EditorState.push(editorState,
      modifiedEntity,
      'insert-characters'
    )
    setEditorState(newEditorState); // not work :cry:
  }

  const handleKeyCommand = (command: string, editorState: EditorState, timestamp: number) => {
    // console.log(command, timestamp);
    return 'not-handled' as const;
  }

  const handleBoldClick = () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
    setEditorState(newEditorState);
  }

  const HANDLE_REGEX = /@[\w]+/g;
  const HASHTAG_REGEX = /#[\w\u0590-\u05ff]+/g;

  function handleStrategy(contentBlock: ContentBlock, callback: Function, contentState: ContentState) {
    findWithRegex(HANDLE_REGEX, contentBlock, callback);
  }

  function hashtagStrategy(contentBlock: ContentBlock, callback: Function, contentState: unknown) {
    findWithRegex(HASHTAG_REGEX, contentBlock, callback);
  }

  function findWithRegex(regex: RegExp, contentBlock: ContentBlock, callback: Function) {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  }

  const HandleSpan: React.FC<{}> = props => {
    return (
      <span {...props}>
        {props.children}
      </span>
    );
  };

  const HashtagSpan: React.FC<{}> = props => {
    return (
      <span {...props}>
        {props.children}
      </span>
    );
  };

  const compositeDecorator = new CompositeDecorator([
    {
      strategy: handleStrategy,
      component: HandleSpan,
    },
    {
      strategy: hashtagStrategy,
      component: HashtagSpan,
    },
  ]);
  EditorState.set(editorState, { decorator: compositeDecorator })

  const handleKeyBinding = (e: React.KeyboardEvent<{}>) => {
    // console.log('keyBindingFn', e.keyCode, e.key)
    if (e.keyCode === 229) {
      return 'not-handled';
    }
    const defaultKeyBinding = getDefaultKeyBinding(e);
    // console.log("getDefault", defaultKeyBinding)
    return defaultKeyBinding;
  }

  console.log('render')
  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleClick}>button</button>
      {" "}
      <button style={styles.button} onClick={handleBoldClick}>BOLD</button>
      <div style={editorStyle} onClick={focusEditor}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={handleKeyBinding}
          blockStyleFn={blockStyleFn}
          blockRendererFn={blockRenderer}
        />
      </div>
      <Tag label={"tag"} />
      <pre style={styles.console}>
        {JSON.stringify(convertToRaw(editorState.getCurrentContent()), null, '  ')}
      </pre>
    </div>
  );
};

function blockStyleFn(contentBlock: ContentBlock) {
  const type = contentBlock.getType();
  // console.log('blockStyle', type)
  if (type === 'blockquote') {
    return 'superFancyBlockquote';
  }
  return '';
}

function blockRenderer(contentBlock: ContentBlock) {
  const type = contentBlock.getType();
  console.log('blocktype', type)
}

const styles = {
  container: {
    maxWidth: '640px',
    margin: '50px auto',
  },
  editor: {
    border: '1px solid gray',
    borderRadius: '10px',
    minHeight: '6em',
    padding: '10px 20px',
    lineHeight: '1.5',
  },
  console: {
    maxHeight: '200px',
    overflowY: 'scroll' as const,
  },
  button: {
    border: '1px solid grey',
    borderRadius: '8px',
    padding: '4px 12px',
    margin: '10px 0',
    lineHeight: '1.5',
    cursor: 'pointer',
  },
};
