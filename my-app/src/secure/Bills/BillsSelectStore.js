export const colourOptions = this.props.labels;

export const optionLength = [
    { value: 1, label: "general" },
    {
      value: 2,
      label:
        "Evil is the moment when I lack the strength to be true to the Good that compels me."
    },
    {
      value: 3,
      label:
        "It is now an easy matter to spell out the ethic of a truth: 'Do all that you can to persevere in that which exceeds your perseverance. Persevere in the interruption. Seize in your being that which has seized and broken you."
    }
  ];
  
  let bigOptions = [];
  for (let i = 0; i < 10000; i++) {
    bigOptions = bigOptions.concat(colourOptions);
  }
  
  export const groupedOptions = [
    {
      label: "Colours",
      options: colourOptions
    }
  ];