import React, { Component } from 'react';
import Store from '../../../data/Store';
import Axios from 'axios';


class DownloadAttachment extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          downloadLink: props.downloadLink,
          pic:'',
         }
    }
    componentDidMount = () => {
      this.getImage("https://124apps.com/bills/app1/profile/115/contacts/7/attachments/15/download")
    }
    getImage =(url)=>{
      Axios.get(url, {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + Store.getAppUserAccessToken()
        }
      })
      .then(response=> {
        if (response.status === 200) {
          let contentType = response.headers["content-type"]
          console.log(response)
          let objUrl = window.URL.createObjectURL( new Blob([response.data]));
            let link = document.createElement("a");
            link.href=objUrl;
            link.setAttribute('download', "file.txt");
            link.style.display='none';
            document.body.appendChild(link)
            link.click();
      }})
      .catch(err=>{console.log(err)})  
     }
    render() { 
        return (  <div>
          {this.state.pic}
          {/* <img style={{width: 175, height: 175}} className='tc br3' alt='none' src={'data:image/png;base64,'+this.state.pic } /> */}
        </div>);
    }
}
 
export default DownloadAttachment;