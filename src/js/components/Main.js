import {select, templates} from '/js/settings.js';



class Main{
  constructor(mainElement){
    const thisMain = this;

    thisMain.render(mainElement);

    
  }
  render(mainElement){
    const thisMain = this;

    console.log(thisMain);

    const generatedHTML = templates.main();

    thisMain.dom = {};
    thisMain.dom.wrapper = mainElement;
    thisMain.dom.wrapper.innerHTML = generatedHTML;

    thisMain.dom.naviItems = document.querySelector(select.main.naviItems);
    console.log(thisMain.naviItems);
  }

}

export default Main;