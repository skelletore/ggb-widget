import Widget from "./ggbWidget.js"
// import Widget from './test.js'

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
let b64 =
  "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"

// Config for widget
let config = {
  ggbApplet: {
    ggbBase64: b64,
    showMenuBar: false,
    showToolBar: true
  },
  vars: [{ name: "A", type: "point" }, { name: "B", type: "point" }],
  // ggbApplet: par,
  feedback: {
    params: {
      pos: "b",
      dismissable: false,
      multi: true
    },
    default: "Kan ikke se hva jeg kan si annet enn det som er sagt før...",
    fb: [
      [
        "Hvordan finner man stigningstallet?",
        "Hva vet du om fortegnet til stigningstallet?",
        "Kan stigningstallet være negativt?"
      ],
      [
        "Hva kan du si om forholdet mellom <i>a</i> og <i>b</i>?",
        "Hvorfor er <i>a</i> mindre enn <i>b</i>?"
      ]
    ],
    condition: [
      {
        op: "geq",
        a: 0,
        b: {
          op: "div",
          a: {
            op: "sub",
            a: "_By",
            b: "_Ay"
          },
          b: {
            op: "sub",
            a: "_Bx",
            b: "_Ax"
          }
        }
      },
      {
        op: "leq",
        a: "_Ax",
        b: "_Bx"
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
