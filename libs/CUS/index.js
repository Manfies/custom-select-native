(function(){
  "use strict";
  
  const ModuleCUS = (function(){

    const WIDGET_DEFAULT_PREFIX = 'CUS'

    class Widget {

      selects = [];

      constructor(){
        this.init()
      };

      static generateDefaultClassForElement(className){
        return `${WIDGET_DEFAULT_PREFIX}-${className}`
      };

      init(){
        this.collectDataOfSelects()
        this.createElements()
        this.renderSelects()
        this.addEventListeners()
      };

      collectDataOfSelects(){
        const selectsElements = document.querySelectorAll(`select.${WIDGET_DEFAULT_PREFIX}`);
        selectsElements.forEach((selectEl, index) => {
        
          let selectPlaceholder
          const selectValue = selectEl.value;
          const selectName = selectEl.getAttribute('name') || `CUS-${index}`;
          const selectUsersPlaceholder = selectEl.getAttribute('placeholder');
          const selectIsSearchable = Boolean(selectEl.getAttribute('searchable') !== null);

          if(selectIsSearchable){
            selectUsersPlaceholder ? selectPlaceholder = selectUsersPlaceholder : selectPlaceholder = 'Search:'
          }else{
            selectUsersPlaceholder ? selectPlaceholder = selectUsersPlaceholder : selectPlaceholder = 'Select...'
          }

          const selectOptions = [];
          const selectOptionsElements = selectEl.childNodes;

          selectOptionsElements.forEach((optionEl) => {

            const optionName = optionEl.text;
            const optionValue = optionEl.value;
            const optionSelected = optionEl.selected;

            if(optionName && optionValue && typeof optionSelected === 'boolean'){
              const option = {
                name: optionName,
                value: optionValue,
                selected: optionSelected
              }
              selectOptions.push(option)
            }
          })

          const select = {
            el: selectEl,
            name: selectName,
            value: selectValue,
            options: selectOptions,
            searchable: selectIsSearchable,
            placeholder: selectPlaceholder,
          }

          this.selects.push(select)

        })
      };

      createElements(){
        this.selects.forEach((select) => {
          const selectInstance = new Select(select)
          const list = new List(select.options) 

          selectInstance.el.appendChild(list.el)
          select.customSelect = selectInstance.el
        })
      };

      renderSelects(){
        this.selects.forEach((select) => {
          select.el.style.display = 'none'
          const referenceNode = select.el.parentNode
          referenceNode.insertBefore(select.customSelect, select.el)
        })
      };

      addEventListeners(){
        const selectOpenedClassName = 'CUS-wrapper_opened'
        const jsSelectInputClassName = 'CUS-input-JS'
        const selectInputWrapperClassName = 'CUS-input-wrapper'
        document.addEventListener('click', (event) => {

          this.selects.forEach((select) => {
            select.customSelect.classList.remove(selectOpenedClassName)
          })

          const isOpenSelect = event.target.classList.contains(jsSelectInputClassName)
          const isInputWrapper = event.target.classList.contains(selectInputWrapperClassName)
          if(isOpenSelect){
            let list
            if(isInputWrapper){
              list = event.target.parentNode.classList.add(selectOpenedClassName)
            }else{
              list = event.target.parentNode.parentNode.classList.add(selectOpenedClassName)
            }
          }
        })
      }

    }

    class List {
      listClassName = 'list'
      listJsClassName = 'list-JS'
      listPositionClassName = 'list-position'
      constructor(options){
        this.el = document.createElement('ul')
        this.el.classList.add(Widget.generateDefaultClassForElement(this.listClassName))
        this.el.classList.add(Widget.generateDefaultClassForElement(this.listJsClassName))
        options.forEach((option) => {
          const optionEl = document.createElement('li')
          optionEl.textContent = option.name
          optionEl.classList.add(Widget.generateDefaultClassForElement(this.listPositionClassName))
          this.el.appendChild(optionEl)
        })
      };
    }

    class Select {

      selectWrapperClassName = 'wrapper';
      selectInputJsClassName = 'input-JS';

      selectInputClassName = 'input';
      selectSearchableInputClassName = 'input_search';

      selectInputWrapperClassName = 'input-wrapper';
      selectSearchableInputWrapperClassName = 'input-wrapper_search';

      constructor(selectData){
        this.el = document.createElement('div');
        this.el.classList.add(Widget.generateDefaultClassForElement(this.selectWrapperClassName));
        const input = this.createInput(selectData.searchable, selectData.placeholder)
        this.el.appendChild(input)
      };

      createInput(searchIsEnable = false, placeholder){

        const inputWrapperEl = document.createElement('div');
        const inputEl = document.createElement('input');

        inputWrapperEl.classList.add(Widget.generateDefaultClassForElement(this.selectInputWrapperClassName))
        inputEl.classList.add(Widget.generateDefaultClassForElement(this.selectInputClassName));

        inputEl.placeholder = placeholder
        inputEl.disabled = true

        if(searchIsEnable){
          inputEl.disabled = false
          inputEl.classList.add(Widget.generateDefaultClassForElement(this.selectSearchableInputClassName))
          inputEl.classList.add(Widget.generateDefaultClassForElement(this.selectInputJsClassName))
          inputWrapperEl.classList.add(Widget.generateDefaultClassForElement(this.selectSearchableInputWrapperClassName))
        }else{
          inputWrapperEl.classList.add(Widget.generateDefaultClassForElement(this.selectInputJsClassName))
        }

        inputWrapperEl.appendChild(inputEl)
        return inputWrapperEl
      }

    }

    const widget = new Widget()
  
  })('ModuleCUS')

})();
