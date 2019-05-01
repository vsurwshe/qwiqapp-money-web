import { Component } from 'react';
import AttachmentApi from '../../../services/AttachmentApi';

class CountAttachments extends Component{
  constructor(props){
    super(props)
    this.state= {
        profileId:props.profileId,
        contactId: props.contactId,
        show:props.show,
       
        count :''
    }
  }
  componentDidMount () {
      new AttachmentApi().getAttachments(this.successCall,this.errorCall,this.state.profileId,this.state.contactId)
  }

  successCall = (json) =>{
    this.setState({ count : json.length})
  }
  render(){
    const { count } = this.state
    if (count === 0) {
      return null;
    } else {
      return ("( "+count+" Attchments )")
    }
   
    // return this.handleCount(count);
  }
  handleCount = (count) =>{
    this.props.handleCount(count)
    return this.state.count;
  }

  bytesToSize (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }
}
export default CountAttachments;