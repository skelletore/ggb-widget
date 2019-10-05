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
  constructor(eid, params = {}, conditions = [], fbs = [], def = null, vars = null, ans = null) {
    if (!eid) {
      console.error("An element ID is required")
      return void 0
    }
    this.eid = eid
    let defaultParams = {
      dismissable: true,
      multi: true,
      forgetful: false,
      random: true
    }

    this.params = { ...defaultParams, ...params }
    this.conditions = conditions
    this.feedbacks = fbs
    this.defaultFb = def
    this.givenFb = []
    this.vars = vars
    this.feedbackCB = ans
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
    btn.classList.add("feedback-button")
    btn.innerHTML = "check"
    btn.onclick = this.checkAns
    this.container.append(heading, btn, this.feedback)

    document.getElementById(this.eid).append(this.container)
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
      this.push(fb)
      return
    }
    event.disabled = true
  }

  push(msg, cls = "error") {
    let btn
    let fbWrapper = document.createElement("div")
    fbWrapper.classList.add("content-wrapper")
    let fb = document.createElement("div")
    fb.classList.add("content")
    let status = document.createElement("span")
    status.classList.add("status", cls)
    let fbmsg = document.createElement("span")
    fbmsg.classList.add("feedback-message")
    fbmsg.innerHTML = msg
    fb.append(status, fbmsg)
    fbWrapper.append(fb)
    // if (cls) fb.classList.add(cls)
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
    this.feedback.append(fbWrapper)
    this.feedbackCB(msg)
  }
}
