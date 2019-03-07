import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ViewProfile extends Component {
  render() {
    const {id,name,url,type,creation}=this.props.view;
    return (
       <div>
           <b> profiel Id :  </b>  {id} <br />
           <b>profiel Name :  </b>  {name}<br />
           <b>profiel Type :   </b> {type}<br />
           <b>profiel creation :</b>{creation}<br />
           <b>profiel URL :    </b> {url}<br />
             
      </div>
    );
  }
}
ViewProfile.propTypes={
    view:PropTypes.array.isRequired
}
export default ViewProfile;

// export const ViewProfile = ()=>(
//     <div>
//         <b> profiel Id :  </b>  {this.props.view.id} <br />
//         {/*  <b>profiel Name :  </b>  {this.props.view.name}<br />
//         <b>profiel Type :   </b> {this.props.view.type}<br />
//         <b>profiel creation :</b>{this.props.view.creation}<br />
//         <b>profiel URL :    </b> {this.props.view.url}<br /> */}
//    </div>
// )