import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ViewProfile extends Component {
  render() {
    const {id,name,url,type,creation}=this.props.view;
    return (
       <div>
           <b>Profile Id :  </b>  {id} <br />
           <b>Profile Name :  </b>  {name}<br />
           <b>Profile Type :   </b> {type}<br />
           <b>Profile Creation :</b>{creation}<br />
           <b>Profile URL :    </b> {url}<br />
             
      </div>
    );
  }
}
ViewProfile.propTypes={
    view:PropTypes.array.isRequired
}
export default ViewProfile;
