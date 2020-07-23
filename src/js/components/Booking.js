import {templates, select, settings, classNames} from '../settings.js';
import AmountWidget from '../components/AmountWidget.js';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';
import utils from '../utils.js';

class Booking {
  constructor(bookingElement){
    const thisBooking = this;

    thisBooking.render(bookingElement);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.pickedTable();
    thisBooking.makeReservation();
  }

  selectedTable;

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

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventCurrent),
      fetch(urls.eventRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventCurrentResponse = allResponses[1];
        const eventRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventCurrentResponse.json(),
          eventRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){        
        thisBooking.parsedData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parsedData (bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat  == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate,1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;
    let hourArray = thisBooking.booked[thisBooking.date][thisBooking.hour];

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(hourArray.length === 0){
        thisBooking.dom.rangeSlider.classList.add(classNames.booking.slideGreen);        
        thisBooking.dom.rangeSlider.classList.remove(classNames.booking.slideYellow);
        thisBooking.dom.rangeSlider.classList.remove(classNames.booking.slideRed);
      } else if(hourArray.length === 1){
        thisBooking.dom.rangeSlider.classList.add(classNames.booking.slideGreen);
        thisBooking.dom.rangeSlider.classList.remove(classNames.booking.slideYellow);
        thisBooking.dom.rangeSlider.classList.remove(classNames.booking.slideRed);
      } else if(hourArray.length === 2){
        thisBooking.dom.rangeSlider.classList.add(classNames.booking.slideYellow);        
        thisBooking.dom.rangeSlider.classList.remove(classNames.booking.slideGreen);
        thisBooking.dom.rangeSlider.classList.remove(classNames.booking.slideRed);
      } else if(hourArray.length === 3) {
        thisBooking.dom.rangeSlider.classList.add(classNames.booking.slideRed);   
        thisBooking.dom.rangeSlider.classList.remove(classNames.booking.slideYellow);
        thisBooking.dom.rangeSlider.classList.remove(classNames.booking.slideGreen);     
      }   
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) //srawdzenie czy elemnt tableId znajduje sie w tablicy
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  makeReservation(){
    const thisBooking = this;

    thisBooking.dom.submit.addEventListener('click', function(e){
      e.preventDefault();
      thisBooking.sendOrder();
    });
  }

  pickedTable(){
    const thisBooking = this;

    for(let table of thisBooking.dom.tables){
      table.addEventListener('click', function(){
        table.classList.add(classNames.booking.tableBooked);
        thisBooking.selectedTable = table.getAttribute(settings.booking.tableIdAttribute);        
      });     
    }
    //thisBooking.updateDOM();
  }
  sendOrder(){
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    const reservation = {
      'date': thisBooking.datePicker.value,
      'hour': thisBooking.hourPicker.value,
      'table': parseInt(thisBooking.selectedTable),
      'duration': parseInt(thisBooking.dom.hoursAmountInput.value),
      'ppl': parseInt(thisBooking.dom.peopleAmountInput.value),
      'starters': [],
      'phone': parseInt(thisBooking.dom.phone.value),
      'email': thisBooking.dom.email.value,
    };

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked === true) {
        reservation.starters.push(starter.value);
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        thisBooking.parsedResponse = {};
        console.log(parsedResponse);
      });
  }


  render(bookingElement){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingElement;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount =  document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.peopleAmountInput =  document.querySelector(select.booking.peopleAmountInput);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.hoursAmountInput = document.querySelector(select.booking.hoursAmountInput);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.phone = document.querySelector(select.booking.phone);
    thisBooking.dom.email = document.querySelector(select.booking.email);
    thisBooking.dom.submit = document.querySelector(select.booking.bookTable);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    thisBooking.dom.rangeSlider = document.querySelector('.range-slider');
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }
}

export default Booking;