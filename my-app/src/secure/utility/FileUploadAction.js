import React, { Fragment } from 'react';
import { Row } from 'reactstrap';
import { FaFile } from "react-icons/fa";
import Files from 'react-files';

export const FileUploadForm = (props) => < Fragment><p> supported files (<b>Ex: </b> image/*, audio/*, video/mp4, text, .pdf, .xlsx, .docx, .doc) </p>
  <Files placeholder="'image/*', 'audio/*', 'video/mp4', 'text/*', '.pdf', '.xlsx', '.docx', '.doc'"
    className='files-dropzone-active'
    onChange={props.handleInput}
    accepts={['image/*', 'audio/*', 'video/mp4', 'text/*', '.pdf', '.xlsx', '.docx', '.doc']}
    multiple={false}
    clickable ><u>click here</u> to upload a file</Files>
</Fragment>
export const FilePreview = (props) => {
  const { file } = props
  return <div> {file ? <div className='files-list'>
    <div className='files-list-item-preview'>
      <Row>
        {file.preview && file.preview.type === 'image'
          ? <object size="xl" data={file.preview.url} >
            <embed src={file.preview.url} />
          </object>
          : <div className='files-list-item-preview-extension'><FaFile /></div>}
        &nbsp; &nbsp;<div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div> &nbsp; &nbsp;
                    <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
      </Row>
    </div>
    <div
      id={file.id}
      className='files-list-item-remove' />
  </div>
    : null
  }
  </div>
}