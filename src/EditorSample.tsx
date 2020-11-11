import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, convertToRaw, RichUtils, ContentBlock, getDefaultKeyBinding } from 'draft-js';
import { Tag } from './Tag'
import { decorator, insertEntity } from './Decorator';

type Props = {};

export const EditorSample: React.FC<Props> = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
  const editor = useRef<Editor>(null);

  // const getColor = () => Math.floor(Math.random() * 255)
  const getColor = () => 0
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
    const newEditorState = insertEntity(editorState);
    setEditorState(newEditorState);
  }

  const handleKeyCommand = (command: string, editorState: EditorState, timestamp: number) => {
    // console.log(command, timestamp);
    return 'not-handled' as const;
  }

  const handleBoldClick = () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
    setEditorState(newEditorState);
  }

  const handleKeyBinding = (e: React.KeyboardEvent<{}>) => {
    // console.log('keyBindingFn', e.keyCode, e.key)
    if (e.keyCode === 229) {
      return 'not-handled';
    }
    const defaultKeyBinding = getDefaultKeyBinding(e);
    // console.log("getDefault", defaultKeyBinding)
    return defaultKeyBinding;
  }

  // console.log('render')
  return (
    <div style={styles.container}>
      <div style={styles.buttons}>
        <Tag label={"tag"} onClick={handleClick} style={styles.tag}>Tag</Tag>
        {" "}
        <button style={styles.button} onClick={handleBoldClick}>BOLD</button>
      </div>
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
  // const type = contentBlock.getType();
  // console.log('blocktype', type)
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
  tag: {
    cursor: 'pointer',
  },
  buttons: {
    display: 'flex',
    margin: '10px 0',
  },
  button: {
    border: '1px solid grey',
    borderRadius: '8px',
    padding: '4px 12px',
    marginLeft: '4px',
    lineHeight: '1.5',
    cursor: 'pointer',
  },
};
