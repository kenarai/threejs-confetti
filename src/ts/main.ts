import "../scss/main.scss";

const sayHello = (name: string) : string => {
    return `Hello ${name}!`
  }
  
  console.log(sayHello('TS!'))

import { Elm } from '../Elm/Main.elm';
const mountNode = document.getElementById("elm");
var app = Elm.Elm.Main.init({node: mountNode}); //  ここずっとElm.Main.initだと思ってて三日くらい溶かした