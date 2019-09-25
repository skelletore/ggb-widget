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
  feedback: {
    default: "Kan ikke se hva jeg kan si annet enn det som er sagt før...",
    fb: [
      [
        "Det er to betingelser som må være møtt samtidig...",
        "TEST1B",
        "<b>TEST1B</b>"
      ],
      [
        "Hva kan du si om forholdet mellom <i>a</i> og <i>b</i>?",
        "Hvorfor er <i>a</i> mindre enn <i>b</i>?"
      ]
    ],
    condition: [
      {
        op: "and",
        a: {
          op: "eq",
          a: 3,
          b: "_a"
        },
        b: {
          op: "gt",
          a: "_b",
          b: 7
        }
      },
      {
        op: "leq",
        a: "_a",
        b: "_b"
      }
    ]
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
