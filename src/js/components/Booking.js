import {templates, select, settings} from '/js/settings.js';
import AmountWidget from '/js/components/AmountWidget.js';
import DatePicker from '/js/components/DatePicker.js';
import HourPicker from '/js/components/HourPicker.js';
import utils from '../utils.js';

class Booking{
  constructor(bookingElement){
    const thisBooking = this;
    
    thisBooking.render(bookingElement);
    thisBooking.initWidgets();
    thisBooking.getData();
  }
  getData(){
    const thisBooking = this;    

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventRepeat: [
        settings.db.repeatParam,
        startDateParam,
        endDateParam,
      ],
    };

    const urls = {
      booking:      settings.db.url + '/' + settings.db.booking 
                                    + '?' + params.booking.join('&'),
      eventCurrent: settings.db.url + '/' + settings.db.event   
                                    + '?' + params.eventCurrent.join('&'),
      eventRepeat:  settings.db.url + '/' + settings.db.event   
                                    + '?' + params.eventRepeat.join('&'),
    };

    fetch(urls.booking)
      .then(function(bookingsResponse){        
        return bookingsResponse.json();        
      })
      .then(function(bookings){
        console.log(bookings);
      });
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
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}

export default Booking;