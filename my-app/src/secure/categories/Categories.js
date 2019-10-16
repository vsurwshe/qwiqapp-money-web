import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Store from "../../data/Store";
import Config from "../../data/Config";
import DeleteCategory from "./DeleteCategory";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";
import { DeleteModel } from "../utility/DeleteModel";
import CategoryForm from "./CategoryForm";


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
      index: '',
      subCategoryHover: []
    };
  }

  componentDidMount = () => {
    this.setProfileId()
  }

  setProfileId = async () => {
    if (Store.getProfile()) {
      await this.setState({ profileId: Store.getProfile().id, spinner: true });
      this.getCategories();
    }
  }

  getCategories = () => {
    new CategoryApi().getCategories(this.successCall, this.errorCall, this.state.profileId);
  }

  //This Method is called for Api's Success Call
  successCall = async categories => {
    await this.categoriesSet(categories);
    this.loadCollapse();
  }

  categoriesSet = (categories) => {
    const prevState = categories;
    const state = prevState.map((x) => {
      return { ...x, childName: this.displaySubCategoryName(x) }
    });
    this.setState({ categories: state });
  }

  displaySubCategoryName = (categories) => {
    if (categories.subCategories) {
      const name = categories.subCategories.map(sub => sub.name);
      return name;
    } else {
      return null;
    }
  }

  loadCollapse = () => {
    this.state.categories.map(category => {
      if (category.subCategories) {
        category.subCategories.map(sub => {
          return this.setState(prevState => ({ subCategoryHover: [...prevState.subCategoryHover, false] }))
        })
      }
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        dropDownAccord: [...prevState.dropDownAccord, false]
      }))
    })
    this.toggleAccordion(this.props.index);
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
      }, Config.apiTimeoutMillis)
    }
  };

  toggleAccordion = (specificIndex) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => specificIndex === index ? !x : false);
    this.setState({ accordion: state, index: specificIndex, spinner: false });
  }

  dropDownAccordion = (dKey) => {
    const prevStat = this.state.dropDownAccord;
    const state = prevStat.map((x, index) => dKey === index ? !x : false);
    this.setState({ dropDownAccord: state });
  }

  subCategoryAccordion = (specificIndex) => {
    const prevState = this.state.subCategoryHover;
    const state = prevState.map((x, index) => specificIndex === index ? !x : false);
    this.setState({ subCategoryHover: state });
  }

  setSearch = e => {
    this.setState({ search: e.target.value });
  }

  setCategoryID = category => {
    this.setState({ categoryId: category.id, categoryName: category.name });
  }

  render() {
    const { requiredCategory, createCategory, updateCategory, deleteCategory, profileId, categoryId, visible, spinner, search, categories, index, danger } = this.state;
    if (!profileId) {
      return <ProfileEmptyMessage />
    } else if (spinner) {
      return ShowServiceComponent.loadSpinner("Categories : " + categories.length)
    } else if (createCategory) {
      return <CategoryForm categories={categories} id={profileId} />
    } else if (updateCategory) {
      return <CategoryForm index={index} categories={categories} category={requiredCategory} id={profileId} />
    } else if (deleteCategory) {
      return <DeleteCategory categoryId={categoryId} profileId={profileId} />
    }
    else {
      return <div>{danger && this.loadDeleteCategory()} {this.loadCategories(categories, visible, search)}</div>
    }
  }

  loadCategories = (categories, visible, search) => {
    const color = this.props.color;
    if (color) {
      this.callAlertTimer()
    }
    return ShowServiceComponent.loadItems("Categories", categories, this.setSearch, search, this.callAddCategory, visible,
      this.toggleAccordion, this.state.accordion, this.setCategoryID, this.toggleDanger, this.updateCategory,
      this.state.dropDownAccord, this.dropDownAccordion, color, this.props.content, this.state.subCategoryHover, this.subCategoryAccordion);
  }

  loadDeleteCategory = () => {
    return <DeleteModel danger={this.state.danger} headerMessage="Delete Category" bodyMessage={this.state.categoryName}
      toggleDanger={this.toggleDanger} delete={this.deleteCategory} cancel={this.toggleDanger} >category</DeleteModel>
  }

  showDropdown = (category, uKey) => {
    return ShowServiceComponent.loadDropDown(category, this.updateCategory, this.setCategoryID, this.toggleDanger)
  }

}

export default Categories;