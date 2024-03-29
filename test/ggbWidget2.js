// export default class GgbWidget2 {
// kun for matistikk
class GgbWidget2 {
  constructor(divElementId, config, answer = null, onAnswer, options) {
    this.divElementId = divElementId
    this.ggbId = `${this.divElementId}GGBcontainer`
    // this.fbId = `${this.divElementId}-fb`
    // default values
    let parameters = {
      id: divElementId,
      width:
        document.getElementById(divElementId).clientWidth < 800 ? 600 : 800,
      // width: 600,
      height: 450,
      // borderColor: null,
      showMenuBar: false,
      // showAlgebraInput: false,
      showToolBar: false,
      // customToolbar: '0|1', //see https://wiki.geogebra.org/en/Reference:Toolbar for codes
      showResetIcon: false,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      enableRightClick: false,
      // enableCAS: false,
      // capturingThreshold: null,
      // appName: 'graphing',
      showToolBarHelp: false,
      errorDialogsActive: true,
      useBrowserForJS: false,
      autoHeight: true,
      language: "nb"
      // showLogging: 'true' //only for testing/debugging
    }
    // overwrite default values with values passed down from config
    // this.config.parameters = { ...parameters, ...config.ggbApplet }
    this.config = {
      ggbApplet: { ...parameters, ...config.ggbApplet },
      feedback: config.feedback || null,
      vars: config.vars || []
    }

    this.vars = {}
    this.ans = answer || { log: [], states: [] }
    this.onAnswer = onAnswer
    if (options.playback) {
      this.playback = options.playback
    }

    this.buildDOM()
    this.config.ggbApplet.appletOnLoad = this.appletOnLoad
    window.onload = this.runscript()
    if (this.config.feedback) {
      this.fb = new FeedBack(
        divElementId,
        this.config.feedback.params,
        config.feedback.feedbacks,
        config.feedback.default,
        this.vars,
        this.setFb,
        this.jmpToFeedbackState
      )
    }
  }

  addUpdateListener = (api, name, type, vars = false, logger = true) => {
    // console.log("name:", name, "type:", type)
    const appendVar = (objName = name) => {
      let value = api.getValue(objName)
      // console.log("value:", value, "typeof", typeof value)
      if (!isNaN(value) && value !== null) {
        this.vars[name] = value
      }
      if (type == "point") {
        let x = api.getXcoord(objName),
          y = api.getYcoord(objName)

        this.vars[name + "x"] = x
        this.vars[name + "y"] = y
      }
    }
    let listener = objName => {
      if (vars) appendVar(objName)
      if (logger) this.logger(api, name)
    }
    api.registerObjectUpdateListener(name, _debounced(250, listener))
    appendVar()
  }
  /**
   * Logs action to the answer.log array
   */
  logger = (api, objName = null, action = "UPDATE") => {
    let log = {
      action: action,
      time: Date.now(),
      delta_time: this.ans.log.length
        ? Date.now() - this.ans.log[this.ans.log.length - 1].time
        : null
    }
    let type = api.getObjectType(objName)
    if (objName) {
      log.object_name = objName
      log.object_type = type
    }
    if (action === "ADD") this.addUpdateListener(api, objName, type)
    let data = {}
    let value = api.getValue(objName)
    if (value !== NaN && value !== null) data.value = value
    if (type === "point") {
      data = {
        x: api.getXcoord(objName).toFixed(5),
        y: api.getYcoord(objName).toFixed(5)
      }
    } else if (type === "angle") {
      data.value *= 180 / Math.PI
    }
    let def = api.getDefinitionString(objName)
    if (def !== "") data["definition_string"] = def
    if (Object.keys(data).length > 0) log.data = data
    this.ans.log.push(log)
    this.putAns()
  }

  appletOnLoad = api => {
    this.api = api
    const addListener = objName => {
      this.logger(api, objName, "ADD")
    }
    api.registerAddListener(addListener)

    const clearListener = () => {
      this.logger(api, null, "RESET")
    }
    api.registerClearListener(clearListener)

    // const clickListener = obj => {
    // 	console.log(obj)
    // }
    // api.registerClickListener(clickListener)

    const clientListener = evt => {
      if (evt[0] == "removeMacro") this.logger(api, null, "RESET")
      // console.log('Client:', evt)
    }
    api.registerClientListener(clientListener)

    for (let o of this.config.vars) {
      this.addUpdateListener(api, o.name, o.type, true, o.logger)
    }
    api.recalculateEnvironments()
  }

  currentTimeMs() {
    return this.startTime ? new Date() - this.startTime : 0
  }
  // CB sendt til feedback klassen, legger til feedback til svar objektet
  setFb = msg => {
    this.ans.states.push(btoa(this.applet.getAppletObject().getXML()))
    this.ans.log.push({
      action: "FEEDBACK",
      data: msg,
      time: Date.now(),
      delta_time: this.ans.log.length
        ? Date.now() - this.ans.log[this.ans.log.length - 1].time
        : null
    })
    this.putAns()
  }
  jmpToFeedbackState = idx => {
    // get index
    // filter log by excluding feedbacks
    // let log = this.ans.log.filter(x => x.action != 'FEEDBACK')
    // let index = this.ans.log.map(x => x.data).indexOf(msg)
    // let adjIdx = log.length - index
    // this.applet.getAppletObject().setXML(atob(this.ans.states[adjIdx]))
    this.applet.getAppletObject().setXML(atob(this.ans.states[idx]))
  }

  putAns() {
    //! ONLY FOR DEBUGGING
    const tail = (arr = []) => {
      return arr.slice(-3)
    }
    //
    // console.log(JSON.stringify(this.ans.log, null, 2))
    this.onAnswer(JSON.stringify(tail(this.ans.log).reverse(), null, 2))
    // this.onAnswer(this.answer)
  }

  buildDOM() {
    let parent = document.getElementById(this.divElementId)
    parent.setAttribute("height", `${this.config.ggbApplet.height}px`)
    let ggb = document.createElement("div")
    ggb.classList.add("widget-box")
    ggb.id = this.ggbId

    parent.append(ggb)
  }

  runscript() {
    this.applet = new GGBApplet(this.config.ggbApplet, "5.0", this.ggbId)
    this.applet.setPreviewImage(
      "data:image/gif;base64,R0lGODlhAQABAAAAADs=",
      "https://www.geogebra.org/images/GeoGebra_loading.png",
      "https://www.geogebra.org/images/applet_play.png"
    )
    // this.ggb = this.applet.getAppletObject()
    this.applet.inject(this.ggbId)
    // this.applet.inject()
  }
}

var ggbWidget2 = {
  scripts: [
    "https://cdn.geogebra.org/apps/deployggb.js",
    "/libs/conditional/filtrex.js",
    "/libs/feedback/feedback_2v1.0.js"
  ],
  links: ["/libs/feedback/feedback_2v1.0.css"],
  widgetClass: GgbWidget2,
  contributesAnswer: true,
  jsonSchema: {
    title: "GoeGebra widget with feedback",
    description: "Geogebra",
    type: "object",
    properties: {
      ggbApplet: {
        type: "object",
        title: "GGBApplet"
      },
      vars: {
        type: "array",
        title: "Variables",
        description: "Variables for feedback checking"
      },
      feedback: {
        type: "object",
        properties: {
          parameters: {
            type: "object",
            title: "Parameters",
            description: "Parameters for feedback module"
          },
          default: {
            type: "string",
            title: "defaultFB",
            description: "fallback feedback if no condition is true"
          },
          feedbacks: {
            type: "array",
            title: "feedbacks",
            description: "Array of feedback objects"
          }
        }
      }
    }
  },

  // prettier-ignore
  jsonSchemaData: {
			"ggbApplet": {},
			"vars": [],
			"feedback": {},
		},
  // prettier-ignore
  configStructure: {
			"ggbApplet": {
				"ggbBase64":"XXX"
			}, // see https://wiki.geogebra.org/en/Reference:GeoGebra_App_Parameters
			"vars": [
				{
					"name": "Name of geogebra object",
					"type": "numeric | point | line | segment | polygon | ..."
			}
			],
			"feedback": {
				"parameters": {
          "strict": false,      // degault - if true, it will return first feedback that is true
					"forgetful": false,   // default - gives feedback regardless of if it is given before
					"random": true        // default - gives a random feedback string from the set of true conditions
				},
				"default": "Default feedback to give when no conditions return true",
				"feedbacks": [
					{
            "condition": "Cy==-1 and m==2",
            "strings": ["string1", "string2"],
            "meta": "meta information that is passed on to the answer obj"
          },
          {
            "condition": " m<0",
            "strings": [
              "Hvordan finner man stigningstallet?",
              "Hva vet du om fortegnet til stigningstallet?",
              "Kan stigningstallet være negativt?",
              "Dette er en fryktelig lang tilbakemelding for å teste hvordan det påvirker stilen. Hva skjer med statusfliken? blir den veldig smal?! Hva med linjeskift? <br> Dette er en ny linje, som fortsetter og fortsetter..."
            ],
            "meta": "negativ stigning"
          },
				],
			},
		}
}

function _debounced(delay, fn) {
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
