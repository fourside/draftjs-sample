import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, convertToRaw, RichUtils, ContentBlock, getDefaultKeyBinding } from 'draft-js';
import { Tag } from './Tag'
import { decorator, insertEntity } from './Decorator';
import { isZeroWidthSpace, jumpCursor } from "./Cursor";
import { customCommands, isHandleCommand } from "./CustomCommand";

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

  const onChange = (newEditorState: EditorState) => {
    const beforeText = editorState.getCurrentContent().getLastBlock().getText()
    const afterText = newEditorState.getCurrentContent().getLastBlock().getText()
    if (beforeText !== afterText) {
      // console.log("before", beforeText)
      // console.log("after", afterText)
      // console.log("-----")
    }
    const isCompositionMode = newEditorState.isInCompositionMode();
    if (!isCompositionMode) {
      setEditorState(newEditorState);
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
    if (isHandleCommand(command)) {
      return 'handled';
    }
    return 'not-handled' as const;
  }

  const handleBoldClick = () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
    setEditorState(newEditorState);
  }

  const handleKeyBinding = (e: React.KeyboardEvent<{}>) => {
    // console.log('keyBindingFn', e.keyCode, e.key, e.timeStamp)
    if (e.key === 'ArrowLeft' && isZeroWidthSpace(editorState, e.key)) {
      const newEditorState = jumpCursor(editorState, e.key);
      if (newEditorState) {
        setEditorState(newEditorState);
      }
      return customCommands.jumpCusor;
    }
    if (e.key === 'ArrowRight' && isZeroWidthSpace(editorState, e.key)) {
      const newEditorState = jumpCursor(editorState, e.key);
      if (newEditorState) {
        setEditorState(newEditorState);
      }
      return customCommands.jumpCusor;
    }
    // if (e.keyCode === 229) {
    //   return 'not-handled';
    // }
    const defaultKeyBinding = getDefaultKeyBinding(e);
    // console.log("getDefault", defaultKeyBinding)
    return defaultKeyBinding;
  }

  const getFocusLog = () => {
    const selection = editorState.getSelection()
    const focuses = [
`forcusOffset: ${selection.getFocusOffset()}`,
`anchorOffset: ${selection.getAnchorOffset()}`,
`startOffset: ${selection.getStartOffset()}`,
`endOffset: ${selection.getEndOffset()}`,
`forcusKey: ${selection.getFocusKey()}`,
`anchorKey: ${selection.getAnchorKey()}`,
    ];
    const log = focuses.join("\n");
    return (
      <>
        {log}
      </>
    )
  }

  const handleReturn = (e: React.KeyboardEvent<{}>, editorState: EditorState) => {
    // console.log('handleReturn')
    return 'not-handled' as const;
  }

  const handleBeforeInput = (chars: string, editorState: EditorState, eventTimeStamp: number) => {
    // not work by IME input
    // console.log("handleBeforeInput", chars);
    return 'not-handled' as const;
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
          handleReturn={handleReturn}
          handleBeforeInput={handleBeforeInput}
        />
      </div>
      <div style={styles.console}>
        <pre className="consoleColumn">
          {JSON.stringify(convertToRaw(editorState.getCurrentContent()), null, '  ')}
        </pre>
        <pre>
          {getFocusLog()}
        </pre>
      </div>
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
    display: 'flex',
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
