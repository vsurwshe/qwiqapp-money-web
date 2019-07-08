import React  from 'react';
import Store from '../../data/Store';

class SetProfile extends React.Component {    
  componentDidMount = async () => {
    const {match: { params: { id } } } = this.props;
    const selectedProfile = Store.getUserProfiles().filter(profile=>id === profile.id.toString())
    await Store.saveProfile(selectedProfile[0])
    await Store.setSelectedValue(true)
    await Store.userDataClear()
    window.location.href="/profiles"
  }
   
  render() { 
      return<></>
  }
}
 
export default SetProfile;