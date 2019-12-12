export default class GgbWidget {
  // class GgbWidget {
  constructor(divElementId, config, answer = null, onAnswer, options) {
    this.divElementId = divElementId
    this.ggbId = `${this.divElementId}GGBcontainer`
    // default values
    let parameters = {
      id: divElementId,
      width: document.getElementById(divElementId).clientWidth < 800 ? 600 : 800,
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
      language: 'nb'
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
  }

  addUpdateListener = (api, name, type, vars = false, aux = false) => {
    const appendVar = (objName = name) => {
      let value = api.getValue(objName)
      if (!isNaN(value) && value !== null) {
        this.vars[name] = value
      }
      if (type == 'point') {
        let x = api.getXcoord(objName),
          y = api.getYcoord(objName)

        this.vars[name + 'x'] = x
        this.vars[name + 'y'] = y
      }
    }
    let listener = objName => {
      if (vars) appendVar(objName)
      if (!aux) this.logger(api, name)
    }
    api.registerObjectUpdateListener(name, _debounced(250, listener))
    appendVar()
  }
  /**
   * Logs action to the answer.log array
   */
  logger = (api, objName = null, action = 'UPDATE') => {
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
    if (action === 'ADD') this.addUpdateListener(api, objName, type)
    let data = {}
    let value = api.getValue(objName)
    if (value !== NaN && value !== null) data.value = value
    if (type === 'point') {
      data = {
        x: api.getXcoord(objName).toFixed(5),
        y: api.getYcoord(objName).toFixed(5)
      }
    } else if (type === 'angle') {
      data.value *= 180 / Math.PI
    }
    let def = api.getDefinitionString(objName)
    if (def !== '') data['definition_string'] = def
    if (Object.keys(data).length > 0) log.data = data
    this.ans.log.push(log)
    this.putAns()
  }

  appletOnLoad = api => {
    this.api = api
    const addListener = objName => {
      this.logger(api, objName, 'ADD')
    }
    api.registerAddListener(addListener)

    const clearListener = () => {
      this.logger(api, null, 'RESET')
    }
    api.registerClearListener(clearListener)

    // const clickListener = obj => {
    // 	console.log(obj)
    // }
    // api.registerClickListener(clickListener)

    const clientListener = evt => {
      if (evt[0] == 'removeMacro') this.logger(api, null, 'RESET')
    }
    api.registerClientListener(clientListener)

    for (let o of this.config.vars) {
      this.addUpdateListener(api, o.name, o.type, true, o.aux)
    }
    api.recalculateEnvironments()
  }

  putAns() {
    this.onAnswer(this.ans.log)
  }

  buildDOM() {
    let parent = document.getElementById(this.divElementId)
    parent.setAttribute('height', `${this.config.ggbApplet.height}px`)
    let ggb = document.createElement('div')
    ggb.classList.add('widget-box')
    ggb.id = this.ggbId

    parent.append(ggb)
  }

  runscript() {
    this.applet = new GGBApplet(this.config.ggbApplet, '5.0', this.ggbId)
    this.applet.setPreviewImage(
      'data:image/gif;base64,R0lGODlhAQABAAAAADs=',
      'https://www.geogebra.org/images/GeoGebra_loading.png',
      'https://www.geogebra.org/images/applet_play.png'
    )
    this.applet.inject(this.ggbId)
  }
}

var ggbWidget = {
  scripts: ['https://cdn.geogebra.org/apps/deployggb.js'],
  links: [],
  widgetClass: GgbWidget,
  contributesAnswer: true,
  jsonSchema: {
    title: 'GoeGebra widget',
    description: 'Geogebra',
    type: 'object',
    properties: {
      ggbApplet: {
        type: 'object',
        title: 'GGBApplet'
      },
      vars: {
        type: 'array',
        title: 'Variables',
        description: 'Variables for feedback checking'
      },
      feedback: {
        type: 'object',
        properties: {
          parameters: {
            type: 'object',
            title: 'Parameters',
            description: 'Parameters for feedback module'
          },
          default: {
            type: 'string',
            title: 'defaultFB',
            description: 'fallback feedback if no condition is true'
          },
          feedbacks: {
            type: 'array',
            title: 'feedbacks',
            description: 'Array of arrays for feedback (1-1 correspondance with conditions)'
          },
          conditions: {
            type: 'array',
            title: 'conditions',
            description:
              'Array of conditions to check which feedback to give (1-1 correspondance with feedbacks)'
          }
        }
      }
    }
  },

  // prettier-ignore
  jsonSchemaData: {
		"ggbApplet": {},
		"vars": []
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
    ]
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
