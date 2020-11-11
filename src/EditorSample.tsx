import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, convertToRaw } from 'draft-js';
import { Tag } from './Tag'

type Props = {};

export const EditorSample: React.FC<Props> = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editor = useRef<Editor>(null);

  const onChange = (editorState: EditorState) => {
    setEditorState(editorState);
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
  }

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleClick}>button</button>
      <div style={styles.editor} onClick={focusEditor}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={onChange}
        />
      </div>
      <Tag label={"tag"} />
      <pre style={styles.console}>
        {JSON.stringify(convertToRaw(editorState.getCurrentContent()), null, '  ')}
      </pre>
    </div>
  );
};

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
