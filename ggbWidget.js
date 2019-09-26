export default class GgbWidget {
	// kun for matistikk
	// class GgbWidget {
	constructor(divElementId, config, answer = null, onAnswer, options) {
		this.divElementId = divElementId
		this.ggbId = `${this.divElementId}-ggb-container`
		this.fbId = `${this.divElementId}-fb`
		// default values
		let parameters = {
			width: document.getElementById(divElementId).clientWidth || 600,
			height: 450,
			// borderColor: null,
			showMenuBar: true,
			// showAlgebraInput: false,
			// showToolBar: false,
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
			autoHeight: true
			// showLogging: 'true' //only for testing/debugging
		}
		// overwrite default values with values passed down from config
		// this.config.parameters = { ...parameters, ...config.ggbApplet }
		this.config = {
			parameters: { ...parameters, ...config.ggbApplet },
			feedback: config.feedback || []
		}
		// console.log(this.config.parameters)

		this.answer = answer || ''
		this.onAnswer = onAnswer
		if (options.playback) {
			this.playback = options.playback
		}

		this.buildDOM()
		this.config.parameters.appletOnLoad = this.appletOnLoad
		window.onload = this.runscript()
	}

	appletOnLoad = api => {
		const addListener = objName => {
			// console.log(this.answer)
			this.answer += `add:  ${objName}  \n`
			printConstructionState()
		}

		const removeListener = objName => {
			this.answer += `remove: ${objName} \n`
			printConstructionState()
		}

		const renameListener = (oldObjName, newObjName) => {
			this.answer += `rename: ${objName} \n`
			printConstructionState()
		}

		const updateListener = objName => {
			let strVal = api.getValueString(objName)
			this.answer += `update: ${strVal} \n`
			this.putAns()
		}

		const clearListener = () => {
			this.answer += `===CLEAR ANSWER=== \n`
			this.putAns()
		}

		const printConstructionState = () => {
			var objNumber = api.getObjectNumber()
			var strState = 'Number of objects: ' + objNumber
			for (let i = 0; i < objNumber; i++) {
				let strName = api.getObjectName(i)
				let strType = api.getObjectType(strName)
				let strCommand = api.getCommandString(strName)
				strState += '\n' + strType + ' ' + strName + ', ' + strCommand
			}
			this.answer += strState + '\n'
			this.putAns()
		}

		api.registerAddListener(addListener)
		api.registerRemoveListener(removeListener)
		api.registerRenameListener(renameListener)
		api.registerClearListener(clearListener)
		api.registerUpdateListener(updateListener)
	}

	currentTimeMs() {
		return this.startTime ? new Date() - this.startTime : 0
	}
	// kun for å sette svar/state til widget dersom svar blir gitt fra server
	setAns() {}

	putAns() {
		this.onAnswer(this.answer)
	}

	buildDOM() {
		// let feedback = document.createElement("div")
		// feedback.id = this.fbId
		// feedback.classList.add("feedback")
		// feedback.innerHTML = `<div class="feedback content">FEEDBACK<button class="closebtn">X</button></div>`
		let ggb = document.createElement('div')
		ggb.id = this.ggbId

		document.getElementById(this.divElementId).append(ggb)
	}

	runscript() {
		this.applet = new GGBApplet(this.config.parameters, '5.0', this.ggbId)
		this.applet.setPreviewImage(
			'data:image/gif;base64,R0lGODlhAQABAAAAADs=',
			'https://www.geogebra.org/images/GeoGebra_loading.png',
			'https://www.geogebra.org/images/applet_play.png'
		)
		// this.ggb = this.applet.getAppletObject()
		// this.applet.inject(this.ggbId)
		this.applet.inject()
	}
}

var ggbWidget = {
	scripts: ['https://cdn.geogebra.org/apps/deployggb.js'],
	links: [],
	widgetClass: ggbWidget,
	contributesAnswer: true,
	jsonSchema: {
		title: 'GoeGebra widget',
		description: 'Geogebra',
		type: 'object',
		properties: {
			height: {
				type: 'number',
				title: 'Height'
			},
			width: {
				type: 'number',
				title: 'Width'
			},
			swatches: {
				type: 'array',
				title: 'Color Swatches (in Hex)'
			},
			strokeWidths: {
				type: 'array',
				title: 'Allowed stroke sizes (from small to large)'
			},
			clear: {
				type: 'boolean',
				title: 'Allowed to clear canvas'
			},
			undo: {
				type: 'boolean',
				title: 'Allowed to undo last stroke'
			}
		}
	},
	// prettier-ignore
	jsonSchemaData: {
		"height": 600,
		"width": 600,
		"swatches": ["000","#666666","#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],
		"strokeWidths": [7, 14, 21, 35],
		"clear": true,
		"undo": true
	},
	// prettier-ignore
	configStructure: {
		"height": "600",
		"width": "600",
		"swatches": ["000","#666666","#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],
		"strokeWidths": [7, 14, 21, 35],
		"clear": "true",
		"undo": "true"
	}
}
