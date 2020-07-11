import {select} from '/js/settings.js';
import AmountWidget from '/js/components/AmountWidget.js';

class CartProduct{
  constructor(menuProoduct, element){
    const thisCartProduct = this;

    thisCartProduct.id = menuProoduct.id;
    thisCartProduct.name = menuProoduct.name;
    thisCartProduct.price = menuProoduct.price;
    thisCartProduct.priceSingle = menuProoduct.priceSingle;
    thisCartProduct.amount = menuProoduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProoduct.params));
    
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
  }
  getElements(element){
    const thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget); 
    thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
  }
  initAmountWidget(){
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
    thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      console.log('thisCartProduct.amount', thisCartProduct.amount);
      thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
      console.log('thisCartProduct.price', thisCartProduct.price);
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }
  remove(){
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
    console.log(thisCartProduct);
  }
  initActions(){
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function(e){
      e.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click', function(e){
      e.preventDefault();
      thisCartProduct.remove();
    });
  }
  getData(){
    const thisCartProduct = this;

    const data = {
      id: thisCartProduct.id,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      params: thisCartProduct.params,
    };
    return data;     
  }
}

export default CartProduct;