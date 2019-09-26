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
  constructor(eid, params = {}) {
    if (!eid) {
      console.error("An element ID is required")
      return void 0
    }
    this.eid = eid
    let defaultParams = {
      pos: "t",
      dismissable: true,
      multi: true
    }
    if (params.pos && !pos.includes(params.pos))
      console.error(
        "position must be on of the following: ",
        pos.join(", "),
        "\ncontinuing with default position!"
      )
    this.params = { ...defaultParams, ...params }
    window.onloadend = this.init()
  }
  init() {
    this.feedback = document.createElement("div")
    this.feedback.classList.add("feedback")
    let pos = this.params.pos
    if (pos == "t" || pos == "r")
      document.getElementById(this.eid).prepend(this.feedback)
    else if (pos == "b" || pos == "l")
      document.getElementById(this.eid).append(this.feedback)
    if (pos == "t" || pos == "b")
      document.getElementById(this.eid).classList.add("feedback-column")
    else document.getElementById(this.eid).classList.add("feedback-row")
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
