(function(){
  "use strict";
  
  const ModuleCUS = (function(){

    const WIDGET_DEFAULT_PREFIX = 'CUS'

    class Widget {
      selects = [];
      _collectDataOfSelects(){
        const selectsElements = document.querySelectorAll(`select.${WIDGET_DEFAULT_PREFIX}`);
        selectsElements.forEach((selectEl, index) => {
          const selectValue = selectEl.value;
          const selectName = selectEl.getAttribute('name') || `CUS-${index}`;
          const selectPlaceholder = selectEl.getAttribute('placeholder');
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
            placeholder: selectPlaceholder,
          }
          this.selects.push(select)
        })
      };
      init(){
        this._collectDataOfSelects()
        console.log(this.selects)
      }
    }

    const widget = new Widget()
    widget.init()
  
  })('ModuleCUS')

})();
