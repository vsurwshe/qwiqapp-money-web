import chroma from 'chroma-js';
import React from 'react';

const Data = {
  colourStyles: {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
            ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
            : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
        },
      };
    },

    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },

    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),

    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  },

  singleStyles: {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
            ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
            : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
        },
      };
    },
    input: styles => ({ ...styles }),
    placeholder: styles => ({ ...styles }),
    singleValue: (styles, { data }) => ({ ...styles, color: data.color }),
  },

  categoriesOrLabels: function (items) {
    const options = [];
    if (items) {
      this.returnLabelOrCategories(items, options)
    }
    return options;
  },
  
  returnLabelOrCategories: function (items, options ) {
    items.map(item => {
      options.push({label: <b>{item.name}</b>, color: !item.color ? "#000000" : item.color, value: item.id });
      if (item.subCategories) {
        item.subCategories.map(subItem => {
          return this.returnSubItemOption(item, subItem, options);
        });
      } else if (item.subLabels) {
        item.subLabels.map(subItem => {
          return this.returnSubItemOption(item, subItem, options);
        });
      }
      return 0;
    });
    return options;
  },

  returnSubItemOption: function (item, subItem, options) {
    return options.push({label: <span>{item.name + "/" + subItem.name}</span>, color: !subItem.color ? "#000000" : subItem.color, value: subItem.id });
  },

  contacts: function (contacts) {
    const options = [];
    contacts && contacts.map(contact => {
      return options.push({ value: contact.id, label: <b>{contact.name}</b> })
    })
    return options
  },

  datePassToAPI:function(date){
    return date.split("-")[0] + date.split("-")[1] + date.split("-")[2]
  },
  
}
export default Data;
