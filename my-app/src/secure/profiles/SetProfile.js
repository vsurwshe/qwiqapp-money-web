import React from 'react';
import Store from '../../data/Store';
import { Redirect } from 'react-router';

class SetProfile extends React.Component {

  componentDidMount = async () => {
    const { match: { params: { id } } } = this.props;
    const selectedProfile = Store.getUserProfiles().filter(profile => id === profile.id.toString())
    await Store.saveProfile(selectedProfile[0])
    await Store.userDataClear()
    await Store.setSelectedValue(true)
  }

  render() {
    return <Redirect to={{pathname: "/dashboard", state: {changeFlag: false}}} />
  }
}

export default SetProfile;