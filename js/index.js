"use strict"

class Widget {
  defaultPrefix = "CUS";
};

class Select {
  value = null;
  options = [];
  placeholder = "Select...";
  search = false;
  searchPlaceholder = "Search:";

  constructor(value, options, placeholder, search, searchPlaceholder){
    this.value = value;
    this.options = options;
    this.placeholder = placeholder;
    this.search = search;
    this.searchPlaceholder = searchPlaceholder;
  };

};

class SelectOption {
  name = '';
  value = '';
  selected = false;
  constructor(name, value, selected){
    this.name = name
    this.value = value
    this.selected = selected
  }
}

const selects = document.querySelectorAll('select.CUS');
selects.forEach((select) => {

  const selectValue = select.value;
  const selectOptions = [];
  const selectOptionsElements = select.childNodes;

  selectOptionsElements.forEach((optionEl, index) => {
    const optionName = optionEl.text;
    const optionValue = optionEl.value;
    const optionSelected = optionEl.selected;
    if(optionName && optionValue && typeof optionSelected === 'boolean'){
      const option = new SelectOption(optionName, optionValue, optionSelected)
      selectOptions.push(option)
    }
  })

})
