import { EditorState } from "draft-js";

type CursorDirection = 'ArrowLeft' | 'ArrowRight';

export const isZeroWidthSpace = (editorState: EditorState, direction: CursorDirection) => {
    return getAnchorChar(editorState, direction) === '\u200b';
}

const getAnchorChar = (editorState: EditorState, direction: CursorDirection) => {
    const selection = editorState.getSelection();
    const offset = selection.getAnchorOffset();
    const content = editorState.getCurrentContent().getBlockForKey(selection.getAnchorKey());
    const text = content.getText();

    const toBeOffset = nextOffset(offset, direction, text)
    const char = text.charAt(toBeOffset);
    console.log("anchorOffset", toBeOffset, "char", char, direction)
    return char;
}

const nextOffset = (currentOffset: number, direction: CursorDirection, text: string) => {
    const toBeOffset = direction === 'ArrowRight' ? currentOffset : currentOffset -2;
    if (toBeOffset < 0) {
        return 0;
    }
    return Math.min(toBeOffset, text.length);
}

export const jumpCursor = (editorState: EditorState, direction: CursorDirection) => {
    const selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const anchorOffset = selection.getAnchorOffset();
    const focusKey = selection.getFocusKey();

    const destOffset = direction === 'ArrowRight' ? anchorOffset + 2: anchorOffset - 2;
    const newSelection = selection.merge({
        anchorKey: anchorKey,
        anchorOffset: destOffset,
        focusKey: focusKey,
        focusOffset: destOffset,
    });
    return EditorState.forceSelection(editorState, newSelection);
}
