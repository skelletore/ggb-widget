// import Widget from "./ggbWidget.js"
import Widget from "./test.js"

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

// Config for widget
let config = {
  condition: {
    op: "and",
    a: {
      op: "eq",
      a: 3,
      b: "a"
    },
    b: {
      op: "gt",
      a: "b",
      b: 7
    }
  }
}

let widget = new Widget(divElement.id, config, null, onAnswer, {})

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
