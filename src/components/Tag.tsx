import React from "react";

type Props = {
    label: string;
    onClick: () => void;
    style: any;
}
export const Tag: React.FC<Props> = (props) => {
  const tagStyles = {
    ...props.style,
    ...styles.tag,
  }
  return (
    <div style={tagStyles} onClick={props.onClick} contentEditable={false}>
      <div style={styles.tagContainer}>
        <span role="img" aria-label={"pumpkin"}>🎃</span>
        <span style={styles.tagLabel}>{props.children}</span>
      </div>
    </div>
  )
}

const styles = {
  tag: {
    backgroundColor: '#3d0',
    color: '#333',
    borderRadius: '10px',
    width: '80px',
    height: '30px',
    positon: 'relative',
    display: 'inline-flex',
    justifyContent: 'center',
    margin: '0 8px',
  },
  tagContainer: {
    display: 'flex',
    positon: 'absolute',
    marginTop: '1px',
  },
  tagLabel: {
    margin: '0',
    marginLeft: '2px',
    fontWeight: 'bold' as const,
  }
}