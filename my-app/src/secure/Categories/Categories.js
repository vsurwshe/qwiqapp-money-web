import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Store from "../../data/Store";
import Config from "../../data/Config";
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import DeleteCategory from "./DeleteCategory";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { ReUseComponents } from "../utility/ReUseComponents";
import { DeleteModel } from "../utility/deleteModel";


class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      profileId: 0,
      categoryId: 0,
      requiredCategory: [],
      createCategory: false,
      updateCategory: false,
      deleteCategory: false,
      viewRequest: false,
      toggle: false,
      accordion: [],
      hoverAccord: [],
      dropDownAccord: [],
      danger: false,
      onHover: false,
      visible: props.visible,
      spinner: false,
      search: ''
    };
  }

  componentDidMount = () => {
    this.setProfileId()
  }

  setProfileId = async () => {
    if (Store.getProfile() !== null && Store.getProfile().length !== 0) {
      var iterator = Store.getProfile().values();
      await this.setState({ profileId: iterator.next().value.id });
      this.getCategory();
    }
  }

  getCategory = () => {
    new CategoryApi().getCategories(this.successCall, this.errorCall, this.state.profileId);
  }

  //This Method is called for Api's Success Call
  successCall = async json => {
    await this.setState({ categories: json, spinner: true })
    this.loadCollapse();
  }

  loadCollapse = () => {
    this.state.categories.map(category => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        hoverAccord: [...prevState.hoverAccord, false],
        dropDownAccord: [...prevState.dropDownAccord, false]
      }))
    })
  }

  //Method that shows API's Error Call
  errorCall = error => {
    this.callAlertTimer('danger', 'Unable to Process Request, Please Try Again')
  }

  //Method calls the create category
  callAddCategory = () => {
    this.setState({ createCategory: true });
  }

  updateCategory = (category) => {
    this.setState({ updateCategory: true, requiredCategory: category });
  }

  deleteCategory = () => {
    this.setState({ deleteCategory: true })
  };

  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
  }

  callAlertTimer = () => {
    if (this.state.visible) {
      setTimeout(() => {
        this.setState({ visible: false });
      }, Config.notificationMillis);
    }
  };

  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({ accordion: state });
  }

  hoverAccordion = (hKey) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((x, index) => hKey === index ? !x : false);
    this.setState({ hoverAccord: state });
  }

  dropDownAccordion = (dKey) => {
    const prevStat = this.state.dropDownAccord;
    const state = prevStat.map((x, index) => dKey === index ? !x : false);
    this.setState({ dropDownAccord: state });
  }

  onHover = (e, hKey) => {
    this.setState({ onHover: true });
    this.hoverAccordion(hKey)
  }

  onHoverOff = (e, hKey) => {
    this.setState({ onHover: false });
    this.hoverAccordion(hKey)
  }

  render() {
    const { categories, requiredCategory, createCategory, updateCategory, deleteCategory, profileId, categoryId, visible, spinner, search } = this.state;
    if (Store.getProfile() === null || Store.getProfile().length === 0) {
      return (<ProfileEmptyMessage />)
    } else if (categories.length === 0 && !spinner) {
      return ReUseComponents.loadSpinner("Categories : " + this.state.categories.length)
    } else if (createCategory) {
      return <AddCategory category={categories} id={profileId} />
    } else if (updateCategory) {
      return <EditCategory categories={categories} category={requiredCategory} id={profileId} />
    } else if (deleteCategory) {
      return <DeleteCategory cid={categoryId} pid={profileId} />
    } else {
      return <div>{this.loadCategories(categories, visible, search)}{this.loadDeleteCategory()}</div>
    }
  }
  setSearch = e => {
    this.setState({ search: e.target.value });
  }
  loadCategories = (categories, visible, search) => {
    const color = this.props.color;
    if (color !== '' || color !== undefined) {
      this.callAlertTimer()
    }
    return ReUseComponents.loadItems(categories, this.setSearch, search, this.callAddCategory, visible,
      this.toggleAccordion, this.state.accordion, this.setCategoryID, this.toggleDanger, this.updateCategory,
      this.state.dropDownAccord, this.dropDownAccordion, color, this.props.content);
  }

  loadDeleteCategory = () => {
    return (<DeleteModel danger={this.state.danger} headerMessage="Delete Category" bodyMessage="Are You Sure Want to Delete Category?"
      toggleDanger={this.toggleDanger} delete={this.deleteCategory} cancel={this.toggleDanger} />);
  }

  showDropdown = (category, uKey) => {
    return ReUseComponents.loadDropDown(category, uKey, this.state.dropDownAccord[uKey], this.dropDownAccordion, this.updateCategory, this.setCategoryID, this.toggleDanger)
  }

  setCategoryID = category => {
    this.setState({ categoryId: category.id });
  }
}

export default Categories;