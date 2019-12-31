import React, { Fragment } from 'react';
import { Row } from 'reactstrap';
import { FaFile } from "react-icons/fa";
import Files from 'react-files';

export const FileUploadForm = (props) => < Fragment>
  <p> supported files (<b>Ex: </b> image/*, audio/*, video/mp4, text, .pdf, .xlsx, .docx, .doc) </p>
  <Files onChange={props.handleInput} accepts={['image/*', 'audio/*', 'video/mp4', 'text/*', '.pdf', '.xlsx', '.docx', '.doc']} 
    multiple={false} clickable > <u>click here</u> to upload a file </Files>
</Fragment>

export const FilePreview = (props) => {
  const { file } = props
  return <div> 
    {file ? <div>
      <Row>
        {file.preview && file.preview.type === 'image'
          ? <object size="xl" data={file.preview.url} >
            <embed src={file.preview.url} />
          </object>
          : <div><FaFile /></div>} &nbsp; &nbsp;
        <div>{file.name}</div> &nbsp; &nbsp;
        <div>{file.sizeReadable}</div>
      </Row>
  </div>
    : null
  }
  </div>
}