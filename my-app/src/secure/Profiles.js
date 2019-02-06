import React, {Component} from 'react'
import ProfileApi from '../services/ProfileApi'


class Profiles extends Component {
    constructor(props) {
        super(props);
        this.state = { profiles: [] };

        this.successCall = this.successCall.bind(this);
        this.errorCall = this.errorCall.bind(this);
    }

    successCall(json) { 
        // console.log('Success '+Store.getAuthToken()); 
        console.log('Success date is: '+json);
        console.log(json[0].id);
        console.log(json[0].name);
        this.state.profiles = json;
        // this.setState({ profiles: json});
        this.forceUpdate();
    }

    componentDidMount() {
        new ProfileApi().getProfiles(this.successCall, this.errorCall);
    }

    errorCall() { 
        // console.log('Success '+Store.getAuthToken()); 
        console.log('Some Error..');
    }

    render() {
        if (this.state.profiles.length === 0) {
            return(<div> Retriving profiles... </div> );
        } else {
            return(<div> First proifle is: {this.state.profiles[0].name}</div>)
        }
    }
}

export default Profiles;