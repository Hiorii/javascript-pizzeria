import {select, templates} from '../settings.js';

class Main{
  constructor(mainElement){
    const thisMain = this;

    thisMain.render(mainElement);

    
  }
  render(mainElement){
    const thisMain = this;

    const generatedHTML = templates.main();

    thisMain.dom = {};
    thisMain.dom.wrapper = mainElement;
    thisMain.dom.wrapper.innerHTML = generatedHTML;

    thisMain.dom.naviItems = document.querySelector(select.main.naviItems);
  }

}

export default Main;