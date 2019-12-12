import Widget from './ggbWidget.js'
// import Widget from './test.js'

const configFile = 'configA.json'
let currentConfig
// const configFile = 'configB.json'

const divContainer = document.getElementById('widget-container')
const fileUpload = document.getElementById('config-file')
const setAns = document.getElementById('set-ans')
const playback = document.getElementById('playback')

let ans = {}

setAns.onclick = () => {
  console.log('SETTING ANSWER')
  makeWidget(currentConfig, ans)
}
playback.onclick = () => {
  console.log('PLAYBACK')
  makeWidget(currentConfig, ans, true)
}

fileUpload.onchange = inn => {
  console.log('SETTING CONFIG')
  let file = fileUpload.files[0]
  let fr = new FileReader()
  fr.onload = evt => {
    let config = JSON.parse(evt.target.result)
    currentConfig = config
    makeWidget(config)
  }
  fr.readAsText(file)
}
let onAnswer = answer => {
  ans = answer
  console.log('ONANSWER')
  console.log(answer)
}

fetch(`./configs/${configFile}`)
  .then(resp => resp.json())
  .then(config => {
    currentConfig = config
    makeWidget(config)
  })

function makeWidget(config, answer = null, playback = false) {
  // Next block only for GeoGebra
  if (window.widget && window.widget.applet)
    window.widget.applet.removeExistingApplet(window.widget.applet.getParameters().id)
  if (divContainer.hasChildNodes()) divContainer.removeChild(divContainer.firstChild)
  delete window.widget
  let divEl = document.createElement('div')
  divEl.id =
    'widget' +
    Math.random()
      .toString(36)
      .substring(2, 15)
  divContainer.append(divEl)
  window.widget = new Widget(divEl.id, config, answer, onAnswer, { playback: playback })
}
