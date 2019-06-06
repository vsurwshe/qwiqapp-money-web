import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import CreateLabel from "./Createlabel";
import UpdateLabel from "./UpdateLabel";
import DeleteLabel from "./DeleteLabel";
import LabelApi from "../../services/LabelApi";
import Loader from 'react-loader-spinner'
import Store from "../../data/Store";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { ReUseComponents } from "../utility/ReUseComponents";
import { DeleteModel } from "../utility/deleteModel";

class Lables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      requiredLabel: [],
      id: 0,
      name: "",
      version: "",
      addContainer: false,
      createLabel: false,
      visible: false,
      updateLabel: false,
      deleteLabel: false,
      profileId: 0,
      accordion: [],
      danger: false,
      show: true,
      dropdownOpen: [],
      onHover: false,
      hoverAccord: [],
      spinner: false,
      search: ''
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    if (Store.getProfile() !== null && Store.getProfile().length !== 0) {
      var iterator = Store.getProfile().values()
      await this.setState({ profileId: iterator.next().value.id });
      this.getLabels();
    }
  }

  getLabels = () => {
    new LabelApi().getSublabels(this.successCall, this.errorCall, this.state.profileId);
  }

  successCall = async lable => {
    if (lable === []) {
      this.setState({ labels: [] })
    } else {
      await this.setState({ labels: lable, spinner: true })
      this.loadCollapse();
    }
  }


  loadCollapse = () => {
    this.state.labels.map(lables => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        hoverAccord: [...prevState.hoverAccord, false],
        dropdownOpen: [...prevState.dropdownOpen, false]
      }))
    });
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

  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({ accordion: state });
  }

  toggleSublabel = () => {
    this.setState({ show: !this.state.show });
    this.getLabels(!this.state.show);
  }
  toggleDropDown = (tab) => {
    const prevState = this.state.dropdownOpen;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({ dropdownOpen: state });
  }

  hoverAccordion = (hKey) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((x, index) => hKey === index ? !x : false);
    this.setState({ hoverAccord: state });
  }
  onHover = (e, hKey) => {
    this.setState({ onHover: true });
    this.hoverAccordion(hKey)
  }

  onHoverOff = (e, hKey) => {
    this.setState({ onHover: false });
    this.hoverAccordion(hKey)
  }

  setSearch = e => { this.setState({ search: e.target.value }) }
  setLabelId = (labels) => { this.setState({ id: labels.id }) }
  callCreateLabel = () => { this.setState({ createLabel: true }) }

  render() {
    const { labels, createLabel, updateLabel, id, deleteLabel, visible, profileId, requiredLabel, spinner, search } = this.state
    if (Store.getProfile() === null || Store.getProfile().length === 0) {
      return (<ProfileEmptyMessage />)
    } else if (labels.length === 0 && !createLabel) {
      return <div>{labels.length === 0 && !createLabel && !spinner
        ? this.loadSpinner()
        : this.loadNotLabel()}</div>
    } else if (createLabel) {
      return (<CreateLabel pid={profileId} label={labels} />)
    } else if (updateLabel) {
      return (<UpdateLabel pid={profileId} label={requiredLabel} lables={labels} />)
    } else if (deleteLabel) {
      return <DeleteLabel id={id} pid={profileId} />
    } else {
      return <div>{this.loadShowLabel(visible, labels, search)}{this.loadDeleteLabel()}</div>
    }
  }

  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Label</strong>
        <Button color="success" className="float-right" onClick={this.callCreateLabel}> + Create Label </Button>
      </CardHeader>);
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
    return (<div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center style={{ paddingTop: '20px' }}>
          <CardBody> <h5><b>You haven't created any Lables yet... </b></h5><br /> </CardBody>
        </center>
      </Card>
    </div>)
  }

  loadShowLabel = (visible, labels, search) => {
    return ReUseComponents.loadItems(labels, this.setSearch, search, this.callCreateLabel, visible, this.toggleAccordion, this.state.accordion, this.setLabelId, this.toggleDanger, this.updateLabel,
      this.state.dropdownOpen, this.toggleDropDown);
  }

  loadDeleteLabel = () => {
    return (
      <DeleteModel danger={this.state.danger} headerMessage="Delete Label" bodyMessage="Are You Sure Want to Delete Label?"
        toggleDanger={this.toggleDanger} delete={this.deleteLabel} cancel={this.toggleDanger} />)
  }

  loadDropDown = (labels, ukey) => {
    return ReUseComponents.loadDropDown(labels, ukey, this.state.dropdownOpen[ukey], this.toggleDropDown, this.updateLabel, this.setLabelId, this.toggleDanger)
  }
}

export default Lables;