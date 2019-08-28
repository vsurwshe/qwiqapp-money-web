import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Store from "../../data/Store";
import Config from "../../data/Config";
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import DeleteCategory from "./DeleteCategory";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { ReUseComponents } from "../utility/ReUseComponents";
import { DeleteModel } from "../utility/DeleteModel";


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
      accordion: [],
      dropDownAccord: [],
      danger: false,
      visible: props.visible,
      spinner: false,
      search: '',
      index:''
    };
  }

  componentDidMount = () => {
    this.setProfileId()
  }

  setProfileId = async () => {
    if (Store.getProfile()) {
      await this.setState({ profileId: Store.getProfile().id });
      this.getCategory();
    }
  }

  getCategory = () => {
    new CategoryApi().getCategories(this.successCall, this.errorCall, this.state.profileId);
  }

  //This Method is called for Api's Success Call
  successCall = async categories => {
    await this.categoriesSet(categories);
    this.loadCollapse();
  }

  categoriesSet = (categories) => {
    const prevState = categories;
    const state = prevState.map((x, index) => {
      return { ...x, childName: this.displaySubCategoryName(x) }
    });
    this.setState({ categories: state });
  }

  displaySubCategoryName = (categories) => {
    if (categories.subCategories !== null) {
      const name = categories.subCategories.map(sub => sub.name);
      return name;
    } else {
      return null;
    }
  }

  loadCollapse = () => {
    this.state.categories.map(category => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        dropDownAccord: [...prevState.dropDownAccord, false]
      }))
    })
    this.toggleAccordion(this.props.index);
  }

  //Method that shows API's Error Call
  errorCall = error => {
    console.log(error);
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
      }, Config.apiTimeoutMillis)
    }
  };

  toggleAccordion = (specificIndex) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => specificIndex === index ? !x : false);
    this.setState({ accordion: state, index: specificIndex });
  }

  dropDownAccordion = (dKey) => {
    const prevStat = this.state.dropDownAccord;
    const state = prevStat.map((x, index) => dKey === index ? !x : false);
    this.setState({ dropDownAccord: state });
  }

  render() {
    const { requiredCategory, createCategory, updateCategory, deleteCategory, profileId, categoryId, visible, spinner, search, categories, index } = this.state;
    let profile = Store.getProfile()
    if (!profile) {
      return <ProfileEmptyMessage />
    } else if (categories.length === 0 && !spinner) {
      return ReUseComponents.loadSpinner("Categories : " + categories.length)
    } else if (createCategory) {
      return <AddCategory category={categories} id={profileId} />
    } else if (updateCategory) {
      return <EditCategory  index={index} categories={categories} category={requiredCategory} id={profileId} />
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
    if (color) {
      this.callAlertTimer()
    }
    return ReUseComponents.loadItems(categories, this.setSearch, search, this.callAddCategory, visible,
      this.toggleAccordion, this.state.accordion, this.setCategoryID, this.toggleDanger, this.updateCategory,
      this.state.dropDownAccord, this.dropDownAccordion, color, this.props.content);
  }

  loadDeleteCategory = () => {
    return <DeleteModel danger={this.state.danger} headerMessage="Delete Category" bodyMessage={this.state.categoryName}
      toggleDanger={this.toggleDanger} delete={this.deleteCategory} cancel={this.toggleDanger} >category</DeleteModel>
  }

  showDropdown = (category, uKey) => {
    console.log(this.updateCategory,'===category==' ,this.setCategoryID)
    return ReUseComponents.loadDropDown(category, this.updateCategory, this.setCategoryID, this.toggleDanger)
  }

  setCategoryID = category => {
    this.setState({ categoryId: category.id, categoryName: category.name });
  }
}

export default Categories;