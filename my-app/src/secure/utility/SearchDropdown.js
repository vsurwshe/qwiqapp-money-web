import React from 'react';
import Select from 'react-select';

export const SearchableDropdown=(props)=>{

const {isMulti, labelName, options, onChangeHandler, required, placeholder, styles}=props;
    return <Select isMulti= {isMulti}
        options={options} 
        styles={styles} 
        defaultValue={labelName} 
        isSearchable={true}
        filterOption={customFilter}
        placeholder={placeholder} 
        onChange={onChangeHandler}
        required={required} />
}

//Add your search logic here.
const customFilter = (option, searchText) => {
    if ( option.label && option.label.props.children.toLowerCase().includes(searchText.toLowerCase()) ) {
        return true;
    } else {
        return false;
    }
}