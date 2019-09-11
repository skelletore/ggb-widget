import Widget from "./ggbWidget.js"

/**
 * Widget constructor
 * Widget (divElement, config, answer, onAnswer, options)
 */
let answerEl = document.getElementById("answer")
let ans
let onAnswer = answer => {
  ans = answer
  console.log(answer)
  // let answerJSON = JSON.stringify(answer, null, 2)
  // answerEl.innerText = answerJSON
  answerEl.value = answer
}

let divElement = document.getElementById("widget")

let widget = new Widget(divElement.id, {}, null, onAnswer, {})

let setAns = () => {
  console.log("setting answer...")
  let ansWidget = new Widget(
    document.getElementById("setAns").id,
    {},
    ans,
    function(arg) {
      console.log("new ans:", arg)
    },
    {}
  )
}

document.getElementById("setBtn").onclick = setAns
