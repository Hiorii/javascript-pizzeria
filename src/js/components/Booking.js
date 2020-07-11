import {templates, select} from '/js/settings.js';

class Booking{
  constructor(bookingElement){
    const thisBooking = this;
    
    thisBooking.render(bookingElement);
    thisBooking.initWidgets();
  }
  render(bookingElement){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};

    thisBooking.dom.wrapper = bookingElement;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    console.log(thisBooking.dom.wrapper);
    thisBooking.dom.peopleAmount =  document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    //thisBooking.generatedHTML = document.querySelector(templates.bookingWidget); 
  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;