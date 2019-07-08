import React from 'react';
import { Table } from 'reactstrap';
import { FaCheck, FaMinus } from "react-icons/fa";

const green = { color: '#008000' }
const red = { color: '#FF0000' }

export default class ProfileInfoTable extends React.Component {
  render() {
    var featureColor = { color: '#330561', fontWeight: 'bold', textAlign: 'left' }
    return (
      <Table size="sm" hover striped bordered responsive >
        <thead>
          <tr align="center" style={{ color: '#7E0462' }}>
            <th></th>
            <th>Free Version</th>
            <th>Basic Version</th>
            <th>Premium Version</th>
          </tr>
        </thead>
        <tbody align="center" >
          <tr >
            <td style={featureColor}>Cost Per Month</td>
            <td><FaMinus /></td>
            <td>$ 0.67</td>
            <td>$ 0.99</td>
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
          <tr>
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
          </tr>
        </tbody>
      </Table>
    );
  }
}