mergeInto(LibraryManager.library, {
	WebGLSpeechSynthesisPluginDebugToggle: function (toggle) {
		document.mWebGLSpeechSynthesisPluginDebugToggle = toggle;

		if (!document.mWebGLSpeechSynthesisPluginDebugToggle) {
			return; // skip when debugging is not enabled
		}

		// make function accessible
		if (!document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog = function (text) {
				if (!document.mWebGLSpeechSynthesisPluginDebugToggle) {
					return;
				}
				if (!document.mWebGLSpeechSynthesisPluginDivLog) {

					// check for existing element -
					document.mWebGLSpeechSynthesisPluginDivLog =
						document.getElementById('debugWebGLSpeechSynthesisPlugin');

					// create elemnent debug log element if missing
					var addDivDebugLog = !document.mWebGLSpeechSynthesisPluginDivLog;
					if (addDivDebugLog) {
						document.mWebGLSpeechSynthesisPluginDivLog =
							document.createElement('pre');
						const attr = document.createAttribute("style");
						attr.value = "float: right";
						document.mWebGLSpeechSynthesisPluginDivLog.setAttributeNode(attr);
					}

					// set initial text
					document.mWebGLSpeechSynthesisPluginDivLog.innerText = "WebGLSpeechSynthesisPlugin Debug Log\r\n";

					setTimeout(function () {

						// add the log div
						if (addDivDebugLog) {
							document.body.appendChild(document.mWebGLSpeechSynthesisPluginDivLog);
						}
					}, 3000);

				}
				document.mWebGLSpeechSynthesisPluginDivLog.innerText =
					document.mWebGLSpeechSynthesisPluginDivLog.innerText + "\r\n" + text;
			};
		}

		if (document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('DebugToggle: ' + toggle);
		}
	},
	WebGLSpeechSynthesisPluginDebugLog: function (text) {
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			let inputText = UTF8ToString(text);
			document._WebGLSpeechSynthesisPluginConsoleLog('DebugLog: ' + inputText);
		}
	},
	WebGLSpeechSynthesisPluginIsAvailable: function () {
		let result;
		if (typeof speechSynthesis === "undefined") {
			result = false;
		} else {
			result = true;
		}
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('IsAvailable: ' + result);
		}
		return result;
	},
	WebGLSpeechSynthesisPluginGetVoices: function () {
		let returnStr = "";
		let jsonData = {};
		if (typeof speechSynthesis === "undefined") {
			// not supported
		} else {
			let voices = document.mWebGLSpeechSynthesisPluginVoices;
			if (voices != undefined) {
				jsonData.voices = [];
				for (let voiceIndex = 0; voiceIndex < voices.length; ++voiceIndex) {
					let voice = voices[voiceIndex];
					let speechSynthesisVoice = {};
					speechSynthesisVoice._default = voice.default; //default is reserved word
					speechSynthesisVoice.lang = voice.lang;
					speechSynthesisVoice.localService = voice.localService;
					speechSynthesisVoice.name = voice.name;
					speechSynthesisVoice.voiceURI = voice.voiceURI;
					jsonData.voices.push(speechSynthesisVoice);
				}
				returnStr = JSON.stringify(jsonData);
			}
		}

		/*
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('GetVoices: ' + JSON.stringify(jsonData, null, 2));
		}
		*/

		let bufferLength = lengthBytesUTF8(returnStr) + 1;
		let buffer = _malloc(bufferLength);
		if (stringToUTF8 == undefined) {
			writeStringToMemory(returnStr, buffer);
		} else {
			stringToUTF8(returnStr, buffer, bufferLength);
		}
		return buffer;
	},
	WebGLSpeechSynthesisPluginInit: function () {

		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('Init: ');
		}

		if (typeof speechSynthesis === "undefined") {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('Init: speechSynthesis is undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginVoices != undefined) {
			return; //already initialized
		}
		var initVoices = function () {
			let voices = speechSynthesis.getVoices();
			if (voices.length == 0) {
				setTimeout(function () { initVoices() }, 10);
				return;
			}
			document.mWebGLSpeechSynthesisPluginVoices = voices;

			/*
			// this just prints the inits {}
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('GetVoices: ' + JSON.stringify(document.mWebGLSpeechSynthesisPluginVoices, null, 2));
			}
			*/
		}
		initVoices();

		// dynamically create interact button
		var createInteractButton = function () {
			if (!document.mWebGLSpeechSynthesisPluginAddedInteractButton) {
				document.mWebGLSpeechSynthesisPluginAddedInteractButton = true;
			} else {
				return;
			}
			var speechActivated = false;
			var div = document.getElementById('divActivateSpeechAPI');
			if (!div) {
				div = document.createElement('div');
				const idAttr = document.createAttribute("id");
				idAttr.value = "divActivateSpeechAPI";
				div.setAttributeNode(idAttr);
				div.style = "display: flex; justify-content: center; align-items: center; text-align: center; background: black; color: white; font-size: 4em; position: absolute; float: left; top: 0px; left: 0x; width: 100%; height: 100%";
				const label = document.createElement('label');
				label.style.width = "300px";
				label.innerHTML = "Press to enable Speech API";
				div.appendChild(label);
				document.body.appendChild(div);
			}
			var handleClick = function(evt) {
				if (speechActivated) {
					return;
				}
				const iosWorkaroundSpeechSynthesis = window.speechSynthesis || window.webkitSpeechSynthesis;
				const iosWorkaroundSpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;
				if (iosWorkaroundSpeechSynthesis && iosWorkaroundSpeechSynthesisUtterance) {
					const msg = new iosWorkaroundSpeechSynthesisUtterance();
					if (msg) {
						msg.text = "Speech activated";
						iosWorkaroundSpeechSynthesis.speak(msg);
						div.style.display = "none";
						div.removeEventListener('click', handleClick);
						speechActivated = true;
					}
				}
			}
			div.addEventListener('click', handleClick);
		}

		// create interact button to enable speech API
		setTimeout(function() {
			createInteractButton();
		}, 2000);
	},
	WebGLSpeechSynthesisPluginCreateSpeechSynthesisUtterance: function () {
		if (typeof speechSynthesis === "undefined") {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('CreateSpeechSynthesisUtterance: speechSynthesis is undefined');
			}
			return -1;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances == undefined) {
			document.mWebGLSpeechSynthesisPluginUtterances = [];
		}
		let index = document.mWebGLSpeechSynthesisPluginUtterances.length;
		let instance = new SpeechSynthesisUtterance();
		document.mWebGLSpeechSynthesisPluginUtterances.push(instance);
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('CreateSpeechSynthesisUtterance: ' + index);
		}
		return index;
	},
	WebGLSpeechSynthesisPluginSetUtterancePitch: function (index, pitch) {
		if (typeof speechSynthesis === "undefined") {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtterancePitch: speechSynthesis is undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtterancePitch: mWebGLSpeechSynthesisPluginUtterances is undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances.length <= index) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtterancePitch: index out of range');
			}
			return;
		}
		let instance = document.mWebGLSpeechSynthesisPluginUtterances[index];
		if (instance == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtterancePitch: Voice is not set');
			}
			return;
		}
		let strPitch = UTF8ToString(pitch);
		instance.pitch = parseFloat(strPitch);
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('SetUtterancePitch: set pitch=' + instance.pitch);
		}
	},
	WebGLSpeechSynthesisPluginSetUtteranceRate: function (index, rate) {
		if (typeof speechSynthesis === "undefined") {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceRate: speechSynthesis is undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceRate: utterance is undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances.length <= index) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceRate: index out of range');
			}
			return;
		}
		let instance = document.mWebGLSpeechSynthesisPluginUtterances[index];
		if (instance == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceRate: Voice is not set');
			}
			return;
		}
		let strRate = UTF8ToString(rate);
		instance.rate = parseFloat(strRate);
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceRate: rate=' + instance.rate);
		}
	},
	WebGLSpeechSynthesisPluginSetUtteranceText: function (index, text) {
		if (document.mWebGLSpeechSynthesisPluginUtterances == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceText: Utterances are undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances.length <= index) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceText: Index out of range');
			}
			return;
		}
		let instance = document.mWebGLSpeechSynthesisPluginUtterances[index];
		if (instance == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceText: Voice is not set');
			}
			return;
		}
		instance.text = UTF8ToString(text);
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceText: Text=' + instance.text);
		}
	},
	WebGLSpeechSynthesisPluginSetUtteranceVoice: function (index, voiceURI) {
		if (document.mWebGLSpeechSynthesisPluginUtterances == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVoice: Utterances are undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances.length <= index) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVoice: Index out of range');
			}
			return;
		}
		let instance = document.mWebGLSpeechSynthesisPluginUtterances[index];
		if (instance == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVoice: Voice is not set index=' + index);
			}
			return;
		}
		let voices = document.mWebGLSpeechSynthesisPluginVoices;
		if (voices == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVoice: Voices are undefined');
			}
			return;
		}
		let strVoice = UTF8ToString(voiceURI);
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVoice: voiceURI=' + strVoice);
		}
		for (let voiceIndex = 0; voiceIndex < voices.length; ++voiceIndex) {
			let voice = voices[voiceIndex];
			if (voice == undefined) {
				continue;
			}
			if (voice.voiceURI == strVoice) {
				if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
					document._WebGLSpeechSynthesisPluginConsoleLog) {
					document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVoice: Matched voice name=' + voice.name + ' uri=' + voice.voiceURI + ' lang=' + voice.lang);
				}
				instance.voice = voice;
				return;
			}
		}
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVoice: Failed to match index=' + index + ' voiceURI=' + strVoice);
		}
	},
	WebGLSpeechSynthesisPluginSetUtteranceVolume: function (index, volume) {
		if (document.mWebGLSpeechSynthesisPluginUtterances == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVolume: Utterances are undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances.length <= index) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVolume: Index out of range');
			}
			return;
		}
		let instance = document.mWebGLSpeechSynthesisPluginUtterances[index];
		if (instance == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVolume: Voice is not set');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('SetUtteranceVolume: Volume=' + volume);
		}
		instance.volume = volume;
	},
	WebGLSpeechSynthesisPluginSpeak: function (index) {
		if (typeof speechSynthesis === "undefined") {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('Speak: speechSynthesis is undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('Speak: Utterances are undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginUtterances.length <= index) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('Speak: Index out of range');
			}
			return;
		}
		let instance = document.mWebGLSpeechSynthesisPluginUtterances[index];
		if (instance == undefined) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('Speak: Voice is not set');
			}
			return;
		}
		//console.log('WebGLSpeechSynthesisPluginSpeak: setting callback for synthesis onend');
		instance.onend = function (event) {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('Speak: synthesis onend callback invoked');
			}
			let jsonData = {};
			jsonData.index = index;
			jsonData.elapsedTime = event.elapsedTime;
			jsonData.type = event.type;
			//console.log(JSON.stringify(jsonData, null, 2));
			if (document.mWebGLSpeechSynthesisPluginOnEnd == undefined) {
				document.mWebGLSpeechSynthesisPluginOnEnd = [];
			}
			document.mWebGLSpeechSynthesisPluginOnEnd.push(JSON.stringify(jsonData));
		}
		//console.log('WebGLSpeechSynthesisPluginSpeak: invoke speak', instance.text);
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('Speak: invoke speak text=' + instance.text);
		}
		speechSynthesis.speak(instance);
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('Speak: speak invoked text=' + instance.text);
		}
	},
	WebGLSpeechSynthesisPluginHasOnEnd: function () {
		if (document.mWebGLSpeechSynthesisPluginOnEnd == undefined) {
			document.mWebGLSpeechSynthesisPluginOnEnd = [];
		}
		let result = (document.mWebGLSpeechSynthesisPluginOnEnd.length > 0);
		/*
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('HasOnEnd: ' + result);
		}
		*/
		return result;
	},
	WebGLSpeechSynthesisPluginGetOnEnd: function () {
		let returnStr = "";
		if (document.mWebGLSpeechSynthesisPluginOnEnd == undefined) {
			document.mWebGLSpeechSynthesisPluginOnEnd = [];
		}
		if (document.mWebGLSpeechSynthesisPluginOnEnd.length == 0) {
			returnStr = "No results available";
		} else {
			returnStr = document.mWebGLSpeechSynthesisPluginOnEnd[0];
		}
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('GetOnEnd: ' + returnStr);
		}
		document.mWebGLSpeechSynthesisPluginOnEnd = document.mWebGLSpeechSynthesisPluginOnEnd.splice(1);
		let bufferLength = lengthBytesUTF8(returnStr) + 1;
		let buffer = _malloc(bufferLength);
		if (stringToUTF8 == undefined) {
			writeStringToMemory(returnStr, buffer);
		} else {
			stringToUTF8(returnStr, buffer, bufferLength);
		}
		return buffer;
	},
	WebGLSpeechSynthesisPluginCancel: function () {
		if (typeof speechSynthesis === "undefined") {
			if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
				document._WebGLSpeechSynthesisPluginConsoleLog) {
				document._WebGLSpeechSynthesisPluginConsoleLog('Cancel: speechSynthesis is undefined');
			}
			return;
		}
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('Cancel: Invoke cancel');
		}
		speechSynthesis.cancel();
		if (document.mWebGLSpeechSynthesisPluginDebugToggle &&
			document._WebGLSpeechSynthesisPluginConsoleLog) {
			document._WebGLSpeechSynthesisPluginConsoleLog('Cancel: Cancel invoked');
		}
	}
});
