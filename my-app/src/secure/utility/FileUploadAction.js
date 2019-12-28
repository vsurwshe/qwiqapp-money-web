import React, { Fragment } from 'react';
import { Row, Button } from 'reactstrap';
import { FaFile } from "react-icons/fa";
import Files from 'react-files';

export const FileUploadForm = (props) => < Fragment>
  <span> supported files (<b>Ex: </b> image/*, audio/*, video/mp4, text, .pdf, .xlsx, .docx, .doc) </span>
  <Files accepts={['image/*', 'audio/*', 'video/mp4', 'text/*', '.pdf', '.xlsx', '.docx', '.doc']}
    onChange={props.handleInput} multiple={false} clickable >
    <Button color="link"><u>click here</u></Button> to upload a file
  </Files>
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