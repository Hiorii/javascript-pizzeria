import {settings, select} from '/js/settings.js';
import BaseWidget from '/js/components/BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);

    const thisWidget = this;
    
    thisWidget.getElements(element); 
    thisWidget.initActions();          
  }
  getElements(){
    const thisWidget = this;
  
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }   
  isValid(value){
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin 
      && value <= settings.amountWidget.defaultMax;   
  }  
  rendeerValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;    
  }
  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', () => thisWidget.setValue(thisWidget.value));
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });      
  }  
}

export default AmountWidget;