import Widget from "./ggbWidget.js"
// import Widget from './test.js'

const configFile = "configA.json"

/**
 * Widget constructor
 * Widget (divElement, config, answer, onAnswer, options)
 */
let answerEl = document.getElementById("answer")
let ans
let onAnswer = answer => {
  ans = answer
  // console.log(answer)
  // let answerJSON = JSON.stringify(answer, null, 2)
  // answerEl.innerText = answerJSON
  answerEl.value = answer
}
let divElement = document.getElementById("widget")

fetch(`./configs/${configFile}`)
  .then(resp => resp.json())
  .then(
    config =>
      (window.widget = new Widget(divElement.id, config, null, onAnswer, {}))
  )

let setAns = () => {
  console.log("setting answer...")
  let ansWidget = new Widget(
    document.getElementById("setAns").id,
    config,
    ans,
    function(arg) {
      console.log("new ans:", arg)
    },
    {}
  )
}

document.getElementById("setBtn").onclick = setAns
