(function(){
  "use strict";
  
  const moduleCUS = (function(){

    const CSS_BASE_CLASS = 'CUS';

    const CSS_CLASS_WRAPPER = CSS_BASE_CLASS + '-wrapper';
    const CSS_CLASS_INPUT_WRAPPER = CSS_BASE_CLASS + '-input-wrapper';
    const CSS_CLASS_INPUT = CSS_BASE_CLASS + '-input';
    const CSS_CLASS_LIST = CSS_BASE_CLASS + '-list';
    const CSS_CLASS_LIST_POS = CSS_BASE_CLASS + '-list-position';

    const CSS_MOD_JS = '_JS';
    const CSS_MOD_OPENED = '_opened';
    const CSS_MOD_SELECTED = '_selected';
    const CSS_MOD_SEARCHABLE = '_searchable';

    const TEXT_DEFAULT_PLACEHOLDER = 'Select...';
    const TEXT_DEFAULT_PLACEHOLDER_SEARCH = 'Search:';

    class Widget {

      constructor(){
        this.selects = [];
        this.init();
      };
      
      init(){
        this.collectDataOfSelects()
        this.createElements()
        this.renderSelects()
        this.addEventListeners()
      };

      collectDataOfSelects(){
        const selectElements = document.querySelectorAll(`select.${CSS_BASE_CLASS}`);
        selectElements.forEach((selectEl, index) => {

          let selectText
          const selectValue = selectEl.value;
          const selectWidth = selectEl.getAttribute('width');
          const selectName = selectEl.getAttribute('name') || `CUS-${index}`;
          const selectPlaceholder = selectEl.getAttribute('placeholder');
          const selectIsSearchable = Boolean(selectEl.getAttribute('searchable') !== null);

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
              if(optionSelected){
                selectText = optionName
              }
              selectOptions.push(option)
            }
          })

          const select = {
            name: selectName,
            text: selectText,
            value: selectValue,
            width: selectWidth,
            nativeSelect: selectEl,
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
          const list = new List(select.options, select.name) 

          select.list = list
          select.listEl = list.el
          selectInstance.el.appendChild(list.el)
          select.customSelect = selectInstance
        })
      };

      renderSelects(){
        this.selects.forEach((select) => {
          select.nativeSelect.style.display = 'none'
          const referenceNode = select.nativeSelect.parentNode
          referenceNode.insertBefore(select.customSelect.el, select.nativeSelect)
        })
      };

      addEventListeners(){

        this.selects.forEach((select) => {
          const isSearchableSelect = select.customSelect.input.classList.contains(CSS_CLASS_INPUT_WRAPPER + CSS_MOD_SEARCHABLE)
          if(isSearchableSelect){
            select.customSelect.input.querySelector('input').addEventListener('input', (event) => {
              select.nativeSelect.value = ""
              const searchString = event.target.value
              select.list.search(searchString)
            })
          }
        })
        
        document.addEventListener('click', (event) => {
          
          // Hide opened lists
          this.selects.forEach((select) => {
            const valueOfSelect = select.nativeSelect.value
            const nameOfSelectedOption = select.customSelect.input.querySelector('input').value
            if(!valueOfSelect){
              select.customSelect.input.querySelector('input').value = ""
            }
            select.customSelect.el.classList.remove(CSS_CLASS_WRAPPER + CSS_MOD_OPENED)
          })

          const isOpenSelectEvent = event.target.classList.contains(CSS_CLASS_INPUT + CSS_MOD_JS)
          const isChangeSelectValueEvent = event.target.classList.contains(CSS_CLASS_LIST_POS + CSS_MOD_JS)

          if(isOpenSelectEvent){
            const selectName = event.target.getAttribute('data-select-name')
            const select = this.getSelectByName(selectName)
            const selectValue = select.nativeSelect.value
            if(!selectValue){
              select.list.search("")
            }
            select.customSelect.el.classList.add(CSS_CLASS_WRAPPER + CSS_MOD_OPENED)
          }

          if(isChangeSelectValueEvent){
            const text = event.target.innerHTML
            const value = event.target.getAttribute('data-value')
            const selectName = event.target.getAttribute('data-select-name')
            const select = this.getSelectByName(selectName)
            select.customSelect.input.querySelector('input').value = text;
            select.nativeSelect.value = value;

            // Set clear selected element and set new
            const listPositions = select.listEl.childNodes
            listPositions.forEach((listPosition) => {
              listPosition.classList.remove(CSS_CLASS_LIST_POS + CSS_MOD_SELECTED)
            })
            console.log(event.target)
            event.target.classList.add(CSS_CLASS_LIST_POS + CSS_MOD_SELECTED)
          }

        })
      };

      getSelectByName(name){
        const select = this.selects.find((select) => {
          return select.name === name
        })
        return select || null
      };

    }

    class List {
      constructor(options, selectName){
        this.options = options
        this.selectName = selectName
        this.el = document.createElement('ul')
        this.el.classList.add(CSS_CLASS_LIST)
        this.el.classList.add(CSS_CLASS_LIST + CSS_MOD_JS)
        this.updateList(this.options)
      };
      search(searchStr){
        this.el.innerHTML = ""
        const result = this.options.filter((option) => {
          return option.name.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1
        })
        this.updateList(result)
      };
      updateList(options){
        options.forEach((option) => {
          const optionEl = document.createElement('li')
          optionEl.setAttribute('data-select-name', this.selectName)
          optionEl.textContent = option.name
          optionEl.classList.add(CSS_CLASS_LIST_POS)
          optionEl.classList.add(CSS_CLASS_LIST_POS + CSS_MOD_JS)
          optionEl.setAttribute('data-value', option.value)
          if(option.selected){
            optionEl.classList.add(CSS_CLASS_LIST_POS + CSS_MOD_SELECTED)
          }
          this.el.appendChild(optionEl)
        })
      
      };
    }

    class Select {

      constructor(selectData){
        this.el = document.createElement('div');
        this.el.classList.add(CSS_CLASS_WRAPPER);
        this.el.style.width = selectData.width

        const input = this.createInput(selectData)
        this.input = input
        this.el.appendChild(input)
      };

      createInput(selectData){

        const selectName = selectData.name
        const placeholder = selectData.placeholder
        const searchIsEnable = selectData.searchable

        const inputWrapperEl = document.createElement('div');
        const inputEl = document.createElement('input');

        inputWrapperEl.classList.add(CSS_CLASS_INPUT_WRAPPER);
        inputEl.classList.add(CSS_CLASS_INPUT);

        inputEl.disabled = true;

        if(searchIsEnable){
          inputEl.disabled = false
          inputEl.classList.add(CSS_CLASS_INPUT + CSS_MOD_JS)
          inputEl.classList.add(CSS_CLASS_INPUT + CSS_MOD_SEARCHABLE)
          inputEl.setAttribute('data-select-name', selectName)
          inputEl.placeholder = placeholder || TEXT_DEFAULT_PLACEHOLDER_SEARCH;
          inputWrapperEl.classList.add(CSS_CLASS_INPUT_WRAPPER + CSS_MOD_SEARCHABLE)
        }else{
          inputEl.placeholder = placeholder;
          inputWrapperEl.classList.add(CSS_CLASS_INPUT + CSS_MOD_JS)
          inputWrapperEl.setAttribute('data-select-name', selectName)
          inputEl.placeholder = placeholder || TEXT_DEFAULT_PLACEHOLDER;
        }

        // Set selected value
        if(selectData.value){
          inputEl.value = selectData.text
        }

        inputWrapperEl.appendChild(inputEl)
        return inputWrapperEl
      }

    }

    return {
      init: function(){
        const widget = new Widget()
      },
    }
  
  })()

  moduleCUS.init();

})();
