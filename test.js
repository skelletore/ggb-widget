export default class Test {
  constructor(divId, config, answer = null, onAnswer, options) {
    this.divId = divId
    this.onAnswer = onAnswer
    this.config = config
    this.vars = {}
    window.onload = this.buildDom()
  }
  buildDom() {
    // let div = document.getElementById(this.divId)
    let form = document.createElement("div")
    form.id = `${this.divId}-form`
    let inputs = ["a", "b"]
    for (let i of inputs) {
      let inp = document.createElement("input")
      inp.name = i
      let id = `${this.divId}-${i}`
      inp.id = id
      inp.type = "number"
      let val = Math.floor(Math.random() * 10)
      let vars = this.vars
      vars[i] = val
      // inp.value = val
      inp.setAttribute("value", val)
      // inp.innerHTML = `${i}`
      // inp.addEventListener("change", val => {
      //   this.vars[i] = document.getElementById(id).value
      //   console.log(this.vars)
      //   console.log(val)
      // })
      // inp.addEventListener("input", function(ev) {
      //   console.log(this.value)
      //   console.log(ev)
      //   vars[i] = document.getElementById(id).value
      //   console.log(vars)
      //   console.log(val)
      // })
      // inp.addEventListener("change", function(ev) {
      //   alert("CHANGE!")
      // })
      // inp.oninput = () => {
      //   console.log("input")
      // }
      form.innerHTML += `${i}: `
      form.append(inp)
      form.innerHTML += `<br>`
      // inp.onchange = function(i) {
      //   vars[i] = this.value
      //   console.log(vars)
      // }
    }
    form.innerHTML += `<br>`
    let sub = document.createElement("button")
    sub.innerHTML = "check"
    sub.onclick = this.checkAns
    form.append(sub)
    document.getElementById(this.divId).append(form)

    let inps = document.getElementById(this.divId).getElementsByTagName("input")
    let vars = this.vars
    let self = this
    for (let inp of inps) {
      inp.onchange = function() {
        let name = this.name
        let val = parseInt(this.value)
        vars[name] = val
        self.onAnswer(JSON.stringify(self.vars))
      }
    }
  }
  checkAns = event => {
    console.log(check(this.config.condition, this.vars))
    // event.preventDefault()
    // console.log(this.vars)
    // for (let x in this.vars) {
    //   console.log(x)
    // }
  }
}

function debounced(delay, fn) {
  let timerId
  return function(...args) {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}
