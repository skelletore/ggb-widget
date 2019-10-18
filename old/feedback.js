/**
 * Class for showing feedback
 * eid: DOM element id where the feedback should live *REQUIRED*
 * takes inn params (objec)
 * dismissable: Boolean wheter feedbacks are dismissable
 *              default: true
 *
 * This class comes with a style sheet (feedback.css)
 */

/**
 * Feedback class
 * Handles feedback wrt a widget.
 *
 * @class FeedBack
 */
class FeedBack {
  /**
   *Creates an instance of FeedBack.
   * @param {string} eid DOM-element id for where the feedback div should append it self to.
   * @param {object} [config={}]
   * @param {array} [feedbacks=[]] array of feedback objects of type { @param {object} condition, @param {array} strings, @param {string} class}
   * @param {object} [def={}] feedback object for default feedback, if no conditions are met this feedback will be given.
   * @param {object} [vars=null] object with reference to values to check conditions up against
   * @param {function} [cb=null] Callback to send feedback given up to the widget scope
   * @memberof FeedBack
   */
  constructor(
    eid,
    config = {},
    feedbacks = [],
    def = {},
    vars = null,
    cb = null,
    jmpToState = null
  ) {
    if (!eid) {
      console.error("An element ID is required")
      return void 0
    }
    this.eid = eid
    let defaultConfig = {
      dismissable: true,
      multi: true,
      forgetful: false,
      random: true,
      strict: false,
      maxCount: null
    }

    this.config = { ...defaultConfig, ...config }
    this.feedbacks = feedbacks
    this.defaultFb = def
    this.givenFb = []
    this.vars = vars
    this.cb = cb
    this.jmpToState = jmpToState

    this.count = 0
    this.btn
    window.onloadend = this.init()
  }
  init() {
    this.container = document.createElement("div")
    this.container.classList.add("feedback-container")
    this.container.setAttribute(
      "style",
      `max-height: ${document.getElementById(this.eid).clientHeight}px;`
    )
    this.feedback = document.createElement("div")
    this.feedback.classList.add("feedback")
    this.feedback.setAttribute(
      "style",
      `height: ${document.getElementById(this.eid).clientHeight - 100}px ;`
    )
    let heading = document.createElement("div")
    heading.classList.add("feedback-heading")
    heading.innerHTML = "<em>FEEDBACK</em>"
    let footer = document.createElement("div")
    footer.classList.add("feedback-footer")
    this.btn = document.createElement("div")
    this.btn.classList.add("feedback-button")
    this.btn.innerHTML = "CHECK"
    this.btn.onclick = this.checkAns
    footer.append(this.btn)
    this.container.append(heading, this.feedback, footer)
    document.getElementById(this.eid).append(this.container)
    document.getElementById(this.eid).classList.add("feedback-grid")
  }
  checkAns = event => {
    let fbs = this.feedbacks
      .filter(f => {
        return check(f.condition, this.vars)
      })
      .map(x => {
        let strings = this.config.forgetful
          ? x.strings
          : x.strings.filter(f => !this.givenFb.includes(f))
        return {
          class: x.class,
          strings: strings,
          meta: x.meta
        }
      })
      .filter(x => x.strings.length)
    let msg, cls, meta
    if (fbs.map(x => x.strings).flat().length) {
      console.log(fbs)
      if (this.config.strict) {
        let current = fbs.find(x => x.strings.length)
        msg = current.strings[0]
        cls = current.class
        meta = current.meta
      } else if (this.config.random) {
        let current = fbs[Math.floor(Math.random() * fbs.length + 1) - 1]
        msg =
          current.strings[
            Math.floor(Math.random() * current.strings.length + 1) - 1
          ]
        cls = current.class
        meta = current.meta
      }
    } else {
      msg = this.defaultFb.string
      cls = this.defaultFb.class
      meta = "default"
    }
    if (msg) {
      this.givenFb.push(msg)
      this.push(msg, meta, cls)
      this.count++
    }
    if (
      (this.config.maxCount && this.count >= this.config.maxCount) ||
      cls === "sucess"
    ) {
      //Disable check btn!
      this.btn.classList.add("disabled")
    }
  }

  push(msg, meta, cls = "info") {
    let id = this.count
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
    if (this.config.dismissable) {
      // add dismiss button
      let dismiss = document.createElement("div")
      dismiss.classList.add("dismiss-feedback")
      fb.append(dismiss)
      dismiss.onclick = function(event) {
        event.target.parentElement.style.display = "none"
      }
    }
    if (this.jmpToState) {
      fbWrapper.onclick = () => {
        this.jmpToState(id)
      }
    }
    if (!this.config.multi) {
      while (this.feedback.firstChild) {
        this.feedback.removeChild(this.feedback.firstChild)
      }
    }
    this.feedback.prepend(fbWrapper)

    this.cb({ feedback: msg, meta: meta })
  }
}
