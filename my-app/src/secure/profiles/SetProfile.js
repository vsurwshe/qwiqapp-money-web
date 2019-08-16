import React from 'react';
import Store from '../../data/Store';
import { Redirect } from 'react-router';

class SetProfile extends React.Component {

  componentDidMount = async () => {
    const { match: { params: { id } } } = this.props;
    const selectedProfile = Store.getUserProfiles().filter(profile => id === profile.id.toString())
    await Store.saveProfile(selectedProfile[0])
    await Store.setSelectedValue(true)
    await Store.userDataClear()
  }

  render() {
    return <Redirect to="/profiles" />
  }
}

export default SetProfile;