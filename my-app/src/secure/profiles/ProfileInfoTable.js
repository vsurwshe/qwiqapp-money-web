import React from 'react';
import { Table } from 'reactstrap';
import { FaCheck, FaMinus } from "react-icons/fa";
import Config from '../../data/Config';
import Store from '../../data/Store';

const green = { color: '#008000' }
const red = { color: '#FF0000' }

export default class ProfileInfoTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      profileTypes: [],
      loader: true
    }
  }

  componentDidMount = () => {
    let profileTypes = Store.getProfileTypes();
    if (profileTypes) {
      this.setState({ profileTypes })
    } 
  }

  render() {
    var featureColor = { color: '#330561', fontWeight: 'bold', textAlign: 'left' }
    let profileTypeCost = this.state.profileTypes.map(profile => { return <td key={profile.type}>{profile.cost}</td> });
    let profileTypeName = this.state.profileTypes.map(profile => { return <td key={profile.type}><b>{profile.name}</b></td> });
    return <> {this.state.loader ? this.loader() : this.loadProfileDifferences(featureColor, profileTypeName, profileTypeCost)} </>
  }

  loadProfileDifferences = (featureColor, profileTypeName, profileTypeCost) => {
    return (
      <Table size="sm" hover striped bordered responsive >
        <thead>
          <tr align="center" style={{ color: '#7E0462' }}>
            <th></th>
            {profileTypeName}
          </tr>
        </thead>
        <tbody align="center" >
          <tr >
            <td style={featureColor}>Cost Per Month</td>
            {profileTypeCost}
          </tr>
          <tr>
            <td style={featureColor}>Multi currency</td>
            <td><FaCheck style={green} /></td>
            <td><FaCheck style={green} /></td>
            <td><FaCheck style={green} /></td>
          </tr>
          <tr>
            <td style={featureColor}>Multi Device</td>
            <td>2</td>
            <td><FaCheck style={green} /></td>
            <td><FaCheck style={green} /></td>
          </tr>
          <tr>
            <td style={featureColor}>Bills</td>
            <td>300</td>
            <td>Unlimited</td>
            <td>Unlimited</td>
          </tr>
          <tr>
            <td style={featureColor}>Categories</td>
            <td>70</td>
            <td>Unlimited</td>
            <td>Unlimited</td>
          </tr>
          <tr>
            <td style={featureColor}>Lables</td>
            <td>5</td>
            <td>Unlimited</td>
            <td>Unlimited</td>
          </tr>
          <tr>
            <td style={featureColor}>Contacts</td>
            <td>5</td>
            <td>Unlimited</td>
            <td>Unlimited</td>
          </tr>
          <tr>
            <td style={featureColor}>Recurring Bills</td>
            <td><FaMinus style={red} /></td>
            <td>Unlimited</td>
            <td>Unlimited</td>
          </tr>
          <tr>
            <td style={featureColor}>Attachments</td>
            <td><FaMinus style={red} /></td>
            <td><FaMinus style={red} /></td>
            <td><FaCheck style={green} /></td>
          </tr>
          {/* <tr>
            <td style={featureColor}>Multi User</td>
            <td><FaMinus style={red} /></td>
            <td><FaMinus style={red} /></td>
            <td><FaCheck style={green} /></td>
          </tr>
          <tr>
            <td style={featureColor}>Sharing</td>
            <td><FaMinus style={red} /></td>
            <td><FaMinus style={red} /></td>
            <td><FaCheck style={green} /></td>
          </tr>
          <tr>
            <td style={featureColor}>Team Security</td>
            <td><FaMinus style={red} /></td>
            <td><FaMinus style={red} /></td>
            <td><FaCheck style={green} /></td>
          </tr>
          <tr>
            <td style={featureColor}>AccessLevels</td>
            <td><FaMinus style={red} /></td>
            <td><FaMinus style={red} /></td>
            <td><FaCheck style={green} /></td>
          </tr> */}
        </tbody>
      </Table>
    );
  }
  loader = () => {
    setTimeout(() => {
      this.setState({ loader: false });
    }, Config.notificationMillis)
  }
}