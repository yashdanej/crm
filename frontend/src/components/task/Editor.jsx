import React from 'react'
import JoditEditor from 'jodit-react';
import { useRef } from 'react';
import { useState } from 'react';

const Editor = ({task, content, setContent}) => {
    const editor = useRef(null);
  return (
    <JoditEditor
        ref={editor}
        value={content}
        onChange={newContent=>{setContent({...task, description: newContent})}}
    />
  )
}

export default Editor