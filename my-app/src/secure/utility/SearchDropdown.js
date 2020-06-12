import React from 'react';
import Select from 'react-select';

export const SearchableDropdown=(props)=>{

const {isMulti, defaultValue, options, onChangeHandler, required, placeholder, styles}=props;
    return <Select isMulti= {isMulti}
        options={options} 
        styles={styles} 
        defaultValue={defaultValue} 
        isSearchable={true}
        filterOption={customFilter}
        placeholder={placeholder} 
        onChange={onChangeHandler}
        required={required} 
        isClearable={true}/>
}

//Add your search logic here.
const customFilter = (option, searchText) => {
    if ( option.label && option.label.props && option.label.props.children.toLowerCase().includes(searchText.toLowerCase()) ) {
        return true;
    } else {
        return false;
    }
}