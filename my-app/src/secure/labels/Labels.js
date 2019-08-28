import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import Loader from 'react-loader-spinner'
import CreateLabel from "./Createlabel";
import UpdateLabel from "./UpdateLabel";
import DeleteLabel from "./DeleteLabel";
import LabelApi from "../../services/LabelApi";
import Store from "../../data/Store";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { ReUseComponents } from "../utility/ReUseComponents";
import { DeleteModel } from "../utility/DeleteModel";
import Config from "../../data/Config";

class Lables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      requiredLabel: [],
      id: 0,
      name: "",
      createLabel: false,
      visible: props.visible,
      updateLabel: false,
      deleteLabel: false,
      profileId: "",
      accordion: [],
      danger: false,
      dropdownOpen: [],
      spinner: false,
      search: '',
      index: '',
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    if (Store.getProfile()) {
      await this.setState({ profileId: Store.getProfile().id });
      this.getLabels();
    }
  }

  getLabels = () => {
    new LabelApi().getSublabels(this.successCall, this.errorCall, this.state.profileId);
  }

  successCall = async labels => {
    if (labels === []) {
      this.setState({ labels: [] })
    } else {
      await this.setState({ spinner: true })
      await this.labelsSet(labels)
      this.loadCollapse();
    }
  };

  labelsSet = (labels) => {
    const prevState = labels;
    const state = prevState.map((x, index) => {
      return { ...x, childName: this.displaySubLabelName(x) }
    });
    this.setState({ labels: state });
  }

  displaySubLabelName = (labels) => {
    if (labels.subLabels) {
      const name = labels.subLabels.map(sub => sub.name);
      return name;
    } else {
      return null;
    }
  }

  errorCall = err => this.setState({ visible: true })

  loadCollapse = () => {
    this.state.labels.map(lables => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        dropdownOpen: [...prevState.dropdownOpen, false]
      }))
    });
    this.toggleAccordion(this.props.index);
  }

  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
  }

  updateLabel = (ulable) => {
    this.setState({ updateLabel: true, requiredLabel: ulable })
  };

  deleteLabel = () => {
    this.setState({ deleteLabel: true })
  };

  toggleAccordion = (specificIndex) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => specificIndex === index ? !x : false);
    this.setState({ accordion: state, index: specificIndex });
  }

  toggleDropDown = (tab) => {
    const prevState = this.state.dropdownOpen;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({ dropdownOpen: state });
  }

  setSearch = e => this.setState({ search: e.target.value })
  setLabelId = (labels) => this.setState({ id: labels.id, labelname: labels.name })
  callCreateLabel = () => this.setState({ createLabel: true })

  render() {
    const { labels, createLabel, updateLabel, id, deleteLabel, visible, profileId, requiredLabel, spinner, search, index } = this.state
    let profile = Store.getProfile()
    if (!profile) {
      return <ProfileEmptyMessage />
    } else if (!labels.length && !createLabel) {
      return <div>{!labels.length && !createLabel && !spinner
        ? this.loadSpinner()
        : this.loadNotLabel()}</div>
    } else if (createLabel) {
      return <CreateLabel pid={profileId} label={labels} />
    } else if (updateLabel) {
      return <UpdateLabel pid={profileId} label={requiredLabel} lables={labels} index={index} />
    } else if (deleteLabel) {
      return <DeleteLabel id={id} pid={profileId} />
    } else {
      return <div>{this.loadShowLabel(visible, labels, search)}{this.loadDeleteLabel()}</div>
    }
  }

  loadHeader = () => {
    return <CardHeader>
      <strong>Labels</strong>
      <Button color="success" className="float-right" onClick={this.callCreateLabel}> + Create Label </Button>
    </CardHeader>;
  }

  loadSpinner = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center style={{ paddingTop: '20px' }}>
            <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60} /></CardBody>
          </center>
        </Card>
      </div>)
  }

  loadNotLabel = () => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center style={{ paddingTop: '20px' }}>
          <CardBody> <h5><b>You haven't created any Lables yet... </b></h5><br /> </CardBody>
        </center>
      </Card>
    </div>
  }

  callAlertTimer = () => {
    if (this.state.visible) {
      setTimeout(() => {
        this.setState({ visible: false });
      }, Config.apiTimeoutMillis)
    }
  };

  loadShowLabel = (visible, labels, search) => {
    const color = this.props.color;
    if (color) {
      this.callAlertTimer()
    }
    return ReUseComponents.loadItems(labels, this.setSearch, search, this.callCreateLabel, visible, this.toggleAccordion, this.state.accordion, this.setLabelId, this.toggleDanger, this.updateLabel,
      this.state.dropdownOpen, this.toggleDropDown, color, this.props.content);
  }

  loadDeleteLabel = () => {
    return  <DeleteModel danger={this.state.danger} headerMessage="Delete Label" bodyMessage={this.state.labelname}
        toggleDanger={this.toggleDanger} delete={this.deleteLabel} cancel={this.toggleDanger} >label</DeleteModel>
  }

  loadDropDown = (labels, ukey) => {
    return ReUseComponents.loadDropDown(labels, this.updateLabel, this.setLabelId, this.toggleDanger)
  }
}

export default Lables;