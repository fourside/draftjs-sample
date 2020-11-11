import React from "react";

export const Tag: React.FC<{label: string}> = (props) => {
  return (
    <div style={styles.tag}>
      <div style={styles.tagContainer}>
        <span>🎃</span>
        <span style={styles.tagLabel}>{props.label}</span>
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
  },
  tagContainer: {
    display: 'flex',
    positon: 'absolute',
  },
  tagLabel: {
    margin: '0',
    fontWeight: 'bold' as const,
  }
}