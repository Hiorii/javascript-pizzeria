import {settings, select, classNames, templates} from './settings.js';
import CartProduct from './components/CartProduct';
import {utils} from './utils.js';

class Cart{
  constructor(element){
    const thisCart = this;
    
    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();      
  }
  getElements(element){
    const thisCart = this;
    
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = document.querySelector(select.cart.productList);
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.adress = element.querySelector(select.cart.address);

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }
  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(){
      console.log(event);
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(e){
      e.preventDefault();
      thisCart.sendOrder();
    });
  }
  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;      
    const payload = {
      address: thisCart.dom.adress.value,        
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products:  []
    };
    console.log('adres: ', thisCart.dom.adress);
    for(let product of thisCart.products){
      const productData = product.getData();
      payload.products.push(productData);
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };    
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log(parsedResponse);
      });        
  }
  add(menuProduct){
    const thisCart = this;

    const generetedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generetedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();      
  }    
  update(){
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for(let product of thisCart.products){
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount; 
    }   
    if(thisCart.subtotalPrice === 0){   
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    } else {
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    }
    console.log(thisCart.totalNumber, thisCart.subtotalPrice, thisCart.totalPrice);

    for(let key of thisCart.renderTotalsKeys){
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct){
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    
    cartProduct.dom.wrapper.remove();   
    thisCart.update();
  }
}

export default Cart;