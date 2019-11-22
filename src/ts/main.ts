import "../scss/main.scss";

const sayHello = (name: string) : string => {
    return `Hello ${name}!`
  }
  
  console.log(sayHello('TS!'))

const Elm = require('../Elm/Main.elm');
const mountNode = document.getElementById("elm");
const app = Elm.Main.init({node: mountNode});