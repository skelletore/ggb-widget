/**
 * Class for showing feedback
 * eid: DOM element id where the feedback should live *REQUIRED*
 * takes inn params (objec)
 * pos: position where the feedback div is placed ('t', 'b', 'l', 'r')
 *      default: 't'
 * dismissable: Boolean wheter feedbacks are dismissable
 *              default: true
 *
 * This class comes with a style sheet (feedback.css)
 */
const pos = ["t", "b", "l", "r"]

class FeedBack {
  constructor(
    eid,
    params = {},
    conditions = [],
    fbs = [],
    def = null,
    vars = null,
    ans = null
  ) {
    if (!eid) {
      console.error("An element ID is required")
      return void 0
    }
    this.eid = eid
    let defaultParams = {
      pos: "t",
      dismissable: true,
      multi: true,
      forgetful: false,
      random: true
    }
    if (params.pos && !pos.includes(params.pos))
      console.error(
        "position must be on of the following: ",
        pos.join(", "),
        "\ncontinuing with default position!"
      )
    this.params = { ...defaultParams, ...params }
    this.conditions = conditions
    this.feedbacks = fbs
    this.defaultFb = def
    this.givenFb = []
    this.vars = vars
    this.ans = ans
    window.onloadend = this.init()
  }
  init() {
    this.container = document.createElement("div")
    this.container.classList.add("feedback-container")
    this.feedback = document.createElement("div")
    this.feedback.classList.add("feedback")
    let heading = document.createElement("div")
    heading.classList.add("feedback-heading")
    heading.innerHTML = "<em>Feedback</em>"
    let btn = document.createElement("button")
    btn.innerHTML = "check"
    btn.onclick = this.checkAns
    this.container.append(heading, btn, this.feedback)

    let pos = this.params.pos
    if (pos == "t" || pos == "r")
      document.getElementById(this.eid).prepend(this.container)
    else if (pos == "b" || pos == "l")
      document.getElementById(this.eid).append(this.container)
    // if (pos == 't' || pos == 'b')
    // 	document.getElementById(this.eid).classList.add('feedback-column')
    // else document.getElementById(this.eid).classList.add('feedback-row')
    document.getElementById(this.eid).classList.add("feedback-grid")
  }
  checkAns = event => {
    let conds = []
    for (let c of this.conditions) {
      let ch = check(c, this.vars)
      conds.push(ch)
      // console.log(`checking condition ${c}, evaluated to ${ch}`)
    }
    let fbs = this.feedbacks
      .filter((f, i) => {
        return conds[i]
      })
      .flat()
      .filter(f => !this.givenFb.includes(f))
    if (!fbs.length && !this.givenFb.includes(this.defaultFb)) {
      this.givenFb.push(this.defaultFb)
      this.push(this.defaultFb)
      return
    } else if (fbs.length) {
      // console.log(fbs)
      let rand = Math.random()
      let floor = Math.floor
      let fb = fbs[floor(rand * fbs.length + 1) - 1]
      this.givenFb.push(fb)
      this.push(fb, "sucess")
      return
    }
    event.disabled = true
  }

  push(msg, cls = null) {
    let btn
    let fb = document.createElement("div")
    fb.innerHTML = msg
    fb.classList.add("content")
    if (cls) fb.classList.add(cls)
    if (this.params.dismissable) {
      // add dismiss button
      btn = document.createElement("button")
      btn.classList.add("dismiss")
      btn.innerHTML = "X"
      fb.append(btn)
      console.log(btn)
      btn.onclick = function(event) {
        event.target.parentElement.style.display = "none"
      }
    }
    if (!this.params.multi) {
      while (this.feedback.firstChild) {
        this.feedback.removeChild(this.feedback.firstChild)
      }
    }
    this.feedback.append(fb)
  }
}
