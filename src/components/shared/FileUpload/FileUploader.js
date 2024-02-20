import React from 'react';

const FileUploader = props => {
  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    
    props.handleFile(fileUploaded);
  };
  return (
    <>
      <button onClick={handleClick} className={ props.className }>
        {props.buttonTxt}
      </button>
      <input type="file"
             ref={hiddenFileInput}
             onChange={handleChange}
             style={{display:'none'}} 
      /> 
    </>
  );
};
export default FileUploader;