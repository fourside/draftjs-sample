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
      callback
    );
  };
}

export function insertEntity(editorState: EditorState): EditorState {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const entity = contentState.createEntity('TAG', 'IMMUTABLE', { label: 'hoge' });
  const key = entity.getLastCreatedEntityKey();

  // const text = `hoge\u200b`; // not work
  const text = `hoge`;
  const newContentState = Modifier.insertText(contentState, selection, text, undefined, key)
  return EditorState.push(editorState,
    newContentState,
    'insert-characters'
  );
}
