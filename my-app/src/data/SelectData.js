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
      //if (color === null || color !== null) {
        return {
          ...styles,
          backgroundColor: color.alpha(0.1).css(),
        };
      //}
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

  labels: function (labels) {
    const options = [];
    labels.map(label => {
      if (label.subLabels) {
        options.push({ label: label.name, color: !label.color ? "#000000" : label.color, value: label.id })
        label.subLabels.map(subLabel => {
          return options.push({ label: <b>{label.name + "/" + subLabel.name}</b>, color: !subLabel.color ? "#000000" : subLabel.color, value: subLabel.id })
        })
      } else {
        return options.push({ value: label.id, label: <b>{label.name}</b>, color: !label.color ? "#000000" : label.color })
      }
      return 0;
    })
    return options;
  },

  categories: function (categories) {
    const options = [];
    categories.map(category => {
      if (category.subCategories !== null) {
        options.push({ value: category.id, label: <b>{category.name}</b>, color: !category.color ? "#000000" : category.color })
        category.subCategories.map(subCategory => {
          return options.push({ label: <span style={{ paddingLeft: 30 }}>{subCategory.name}</span>, color: !subCategory.color ? "#000000" : subCategory.color, value: subCategory.id })
        })
      } else {
        return options.push({ value: category.id, label: <b>{category.name}</b>, color: !category.color ? "#000000" : category.color })
      }
      return 0;
    })
    return options;
  },
  contacts: function (contacts) {
    const options = [];
    contacts.map(contact => {
      return options.push({ value: contact.id, label: <b>{contact.name}</b> })
    })

    return options
  }

}
export default Data;
