import {settings, select} from './settings.js';

class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element); 
    thisWidget.initActions();     
    thisWidget.value = settings.amountWidget.defaultValue;    
    thisWidget.setValue(thisWidget.input.value);      
  }
  getElements(element){
    const thisWidget = this;
  
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value){
    const thisWidget = this;

    const newValue = parseInt(value);
    if(newValue != thisWidget.value && newValue>=settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
      thisWidget.value = newValue;
      thisWidget.announce();
      thisWidget.input.addEventListener('focusout', (event) => {
        event.target.value = thisWidget.value;
      });
    }
    thisWidget.input.value = thisWidget.value;      
  }   
  initActions(){
    const thisWidget = this;

    thisWidget.input.addEventListener('change', thisWidget.setValue(thisWidget.value));
    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });      
  } 
  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated',{
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;