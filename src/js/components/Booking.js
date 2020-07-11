import {templates, select} from '/js/settings.js';
import AmountWidget from '/js/components/AmountWidget.js';
import DatePicker from '/js/components/DatePicker.js';
import HourPicker from '/js/components/HourPicker.js';

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
    thisBooking.dom.peopleAmount =  document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.datePicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}

export default Booking;