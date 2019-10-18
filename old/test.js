import Widget from "./ggbWidget.js"
// import Widget from './test.js'

const configFile = "configA.json"
// const configFile = 'configB.json'

const divContainer = document.getElementById("widget-container")
const fileUpload = document.getElementById("config-file")

fileUpload.onchange = inn => {
  let file = fileUpload.files[0]
  let fr = new FileReader()
  fr.onload = evt => {
    let config = JSON.parse(evt.target.result)
    makeWidget(config)
  }
  fr.readAsText(file)
}
let onAnswer = answer => {
  console.log(answer)
}

fetch(`./configs/${configFile}`)
  .then(resp => resp.json())
  .then(config => makeWidget(config))

function makeWidget(config) {
  // Next block only for GeoGebra
  if (window.widget && window.widget.applet)
    window.widget.applet.removeExistingApplet(
      window.widget.applet.getParameters().id
    )
  if (divContainer.hasChildNodes())
    divContainer.removeChild(divContainer.firstChild)
  delete window.widget
  let divEl = document.createElement("div")
  divEl.id =
    "widget" +
    Math.random()
      .toString(36)
      .substring(2, 15)
  divContainer.append(divEl)
  window.widget = new Widget(divEl.id, config, null, onAnswer, {})
}
