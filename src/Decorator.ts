import { CompositeDecorator, ContentBlock, ContentState, EditorState, Modifier } from "draft-js";
import { Tag } from "./Tag";

export const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy(),
    component: Tag,
  },
]);

function getEntityStrategy() {
  return function(contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return !!entityKey;
      },
      (start, end) => callback(start, end -1)
    );
  };
}

export function insertEntity(editorState: EditorState): EditorState {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const entity = contentState.createEntity('TAG', 'IMMUTABLE', { label: 'hoge' });
  const key = entity.getLastCreatedEntityKey();

  const text = `hoge\u200b`;
  const newContentState = Modifier.insertText(contentState, selection, text, undefined, key)
  let newEditorState = EditorState.push(editorState,
    newContentState,
    'insert-characters'
  );
  newEditorState = EditorState.moveFocusToEnd(newEditorState);
  newEditorState = EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter())
  return newEditorState;
}
