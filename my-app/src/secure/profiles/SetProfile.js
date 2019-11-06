import React from 'react';
import Store from '../../data/Store';
import { Redirect } from 'react-router';
import Loader from 'react-loader-spinner';
import ProfileApi from '../../services/ProfileApi';

class SetProfile extends React.Component {
  state = {
    callDashboard: false
  }

  componentDidMount = async () => {
    const { match: { params: { id } } } = this.props;
    await this.setProfile(id);
  }

  setProfile = (profileId) => {
    return new ProfileApi().getProfileById(async (profile) => {
      await Store.saveProfile(profile)
      await Store.userDataClear()
      await Store.setSelectedValue(true)
      this.setState({ callDashboard: true });
    }, (err) => {
      this.setState({ callDashboard: true });
    }, profileId);
  }

  render() {
    const { callDashboard } = this.state
    return callDashboard ? <Redirect to={{ pathname: "/dashboard", state: { changeFlag: false } }} />
      : this.loadSpinner()
  }

  loadSpinner = () => {
    return <center style={{ paddingTop: '20px' }}>
      <Loader type="TailSpin" color="#2E86C1" height={60} width={60} />
    </center>
  }
}

export default SetProfile;