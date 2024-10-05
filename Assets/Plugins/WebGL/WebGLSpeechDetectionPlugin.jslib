mergeInto(LibraryManager.library, {

  WebGLSpeechDetectionPluginIsAvailable: function () {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  WebGLSpeechDetectionPluginInit: function () {
    //console.log("WebGLSpeechDetectionPlugin: Init");
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition == undefined) {
      return;
    }
    if (document.mWebGLSpeechDetectionPluginRecognition != undefined) {
      return;
    }
    document.mWebGLSpeechDetectionPluginResults = [];
    document.mWebGLSpeechDetectionPluginRecognition = new SpeechRecognition();
    document.mWebGLSpeechDetectionPluginRecognition.interimResults = true;
    document.mWebGLSpeechDetectionPluginDetect = function (e) {
      const results = Array.from(e.results);
      if (results == undefined) {
        return;
      }
      var jsonData = {};
      jsonData.results = [];
      for (var resultIndex = 0; resultIndex < results.length; ++resultIndex) {
        //console.log(results[resultIndex]);
        // SpeechRecognitionResult
        var speechRecognitionResult = {};
        speechRecognitionResult.isFinal = results[resultIndex].isFinal;
        speechRecognitionResult.alternatives = [];
        for (var setIndex = 0; setIndex < results[resultIndex].length; ++setIndex) {
          //console.log(results[resultIndex][setIndex]);
          // SpeechRecognitionAlternative 
          var speechRecognitionAlternative = {};
          speechRecognitionAlternative.confidence = results[resultIndex][setIndex].confidence;
          speechRecognitionAlternative.transcript = results[resultIndex][setIndex].transcript;
          speechRecognitionResult.alternatives.push(speechRecognitionAlternative);
        }
        speechRecognitionResult.length = speechRecognitionResult.alternatives.length;
        jsonData.results.push(speechRecognitionResult);
      }
      //console.log(JSON.stringify(jsonData, undefined, 2));
      document.mWebGLSpeechDetectionPluginResults.push(JSON.stringify(jsonData));
    };
    document.mWebGLSpeechDetectionPluginRecognition.addEventListener('result', document.mWebGLSpeechDetectionPluginDetect);
    document.mWebGLSpeechDetectionPluginRecognition.addEventListener('end', document.mWebGLSpeechDetectionPluginRecognition.start);
    document.mWebGLSpeechDetectionPluginRecognition.stop();
    document.mWebGLSpeechDetectionPluginRecognition.start();
  },

  WebGLSpeechDetectionPluginStart: function () {
    if (document.mWebGLSpeechDetectionPluginRecognition == undefined) {
      return;
    }
    document.mWebGLSpeechDetectionPluginRecognition.start();
  },

  WebGLSpeechDetectionPluginAbort: function () {
    if (document.mWebGLSpeechDetectionPluginRecognition == undefined) {
      return;
    }
    document.mWebGLSpeechDetectionPluginRecognition.abort();
  },

  WebGLSpeechDetectionPluginStop: function () {
    if (document.mWebGLSpeechDetectionPluginRecognition == undefined) {
      return;
    }
    document.mWebGLSpeechDetectionPluginRecognition.stop();
  },

  WebGLSpeechDetectionPluginGetNumberOfResults: function () {
    if (document.mWebGLSpeechDetectionPluginResults == undefined) {
      document.mWebGLSpeechDetectionPluginResults = [];
    }
    //console.log("GetNumberOfResults length="+document.mWebGLSpeechDetectionPluginResults.length);
    return document.mWebGLSpeechDetectionPluginResults.length;
  },

  WebGLSpeechDetectionPluginGetResult: function () {
    if (document.mWebGLSpeechDetectionPluginResults == undefined) {
      document.mWebGLSpeechDetectionPluginResults = [];
    }
    //console.log("GetResult:");

    if (document.mWebGLSpeechDetectionPluginResults.length == 0) {
      returnStr = "No results available";
    } else {
      returnStr = document.mWebGLSpeechDetectionPluginResults[0];
    }

    //console.log('WebGLSpeechDetectionPluginGetResult', 'returns', returnStr);

    document.mWebGLSpeechDetectionPluginResults = document.mWebGLSpeechDetectionPluginResults.splice(1);

    var bufferSize = lengthBytesUTF8(returnStr) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(returnStr, buffer, bufferSize);
    return buffer;
  },

  WebGLSpeechDetectionPluginGetLanguages: function () {
    //console.log("GetLanguages:");

    // unity 2021.X build process broke handling of UTF8 characters
    // decode base64 here instead

    // ref: https://developer.mozilla.org/en-US/docs/Web/API/btoa#unicode_strings
    var WebGLSpeechDetectionPluginToBinary = function (string) {
      const codeUnits = new Uint16Array(string.length);
      for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
      }
      const charCodes = new Uint8Array(codeUnits.buffer);
      let result = '';
      for (let i = 0; i < charCodes.byteLength; i++) {
        result += String.fromCharCode(charCodes[i]);
      }
      return result;
    };

    var WebGLSpeechDetectionPluginFromBinary = function (binary) {
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const charCodes = new Uint16Array(bytes.buffer);
      let result = '';
      for (let i = 0; i < charCodes.length; i++) {
        result += String.fromCharCode(charCodes[i]);
      }
      return result;
    };

    document.mWebGLSpeechDetectionLanguages = JSON.parse(WebGLSpeechDetectionPluginFromBinary(atob(`ewAKACAAIAAiAGwAYQBuAGcAdQBhAGcAZQBzACIAOgAgAFsACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBBAHIAYQBiAGkAYwAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGEAcgAtAEkATAAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEEAcgBhAGIAaQBjACAAKABJAHMAcgBhAGUAbAApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGEAcgAtAEoATwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEEAcgBhAGIAaQBjACAAKABKAG8AcgBkAGEAbgApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGEAcgAtAEEARQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEEAcgBhAGIAaQBjACAAKABVAG4AaQB0AGUAZAAgAEEAcgBhAGIAIABFAG0AaQByAGEAdABlAHMAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBhAHIALQBCAEgAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBBAHIAYQBiAGkAYwAgACgAQgBhAGgAcgBhAGkAbgApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGEAcgAtAEQAWgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEEAcgBhAGIAaQBjACAAKABBAGwAZwBlAHIAaQBhACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAYQByAC0AUwBBACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAQQByAGEAYgBpAGMAIAAoAFMAYQB1AGQAaQAgAEEAcgBhAGIAaQBhACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAYQByAC0ASQBRACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAQQByAGEAYgBpAGMAIAAoAEkAcgBhAHEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBhAHIALQBLAFcAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBBAHIAYQBiAGkAYwAgACgASwB1AHcAYQBpAHQAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBhAHIALQBNAEEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBBAHIAYQBiAGkAYwAgACgATQBvAHIAbwBjAGMAbwApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGEAcgAtAFQATgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEEAcgBhAGIAaQBjACAAKABUAHUAbgBpAHMAaQBhACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAYQByAC0ATwBNACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAQQByAGEAYgBpAGMAIAAoAE8AbQBhAG4AKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBhAHIALQBQAFMAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBBAHIAYQBiAGkAYwAgACgAUwB0AGEAdABlACAAbwBmACAAUABhAGwAZQBzAHQAaQBuAGUAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBhAHIALQBRAEEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBBAHIAYQBiAGkAYwAgACgAUQBhAHQAYQByACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAYQByAC0ATABCACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAQQByAGEAYgBpAGMAIAAoAEwAZQBiAGEAbgBvAG4AKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBhAHIALQBFAEcAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBBAHIAYQBiAGkAYwAgACgARQBnAHkAcAB0ACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAQQBmAHIAaQBrAGEAYQBuAHMAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBhAGYALQBaAEEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBBAGYAcgBpAGsAYQBhAG4AcwAgACgAUwBvAHUAdABoACAAQQBmAHIAaQBjAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBCAGEAaABhAHMAYQAgAEkAbgBkAG8AbgBlAHMAaQBhACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAaQBkAC0ASQBEACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIASQBuAGQAbwBuAGUAcwBpAGEAbgAgACgASQBuAGQAbwBuAGUAcwBpAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBCAGEAaABhAHMAYQAgAE0AZQBsAGEAeQB1ACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAbQBzAC0ATQBZACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIATQBhAGwAYQB5ACAAKABNAGEAbABhAHkAcwBpAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBDAGEAdABhAGwA4AAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGMAYQAtAEUAUwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEMAYQB0AGEAbABhAG4AIAAoAFMAcABhAGkAbgApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAAwBZQBhAXQAaQBuAGEAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBjAHMALQBDAFoAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBDAHoAZQBjAGgAIAAoAEMAegBlAGMAaAAgAFIAZQBwAHUAYgBsAGkAYwApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAEQAYQBuAHMAawAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGQAYQAtAEQASwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEQAYQBuAGkAcwBoACAAKABEAGUAbgBtAGEAcgBrACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIARABlAHUAdABzAGMAaAAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGQAZQAtAEQARQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEcAZQByAG0AYQBuACAAKABHAGUAcgBtAGEAbgB5ACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIARQBuAGcAbABpAHMAaAAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAbgAtAEEAVQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIAQQB1AHMAdAByAGEAbABpAGEAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBuAC0AQwBBACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBDAGEAbgBhAGQAYQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBlAG4ALQBJAE4AIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAEkAbgBkAGkAYQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBlAG4ALQBOAFoAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAE4AZQB3ACAAWgBlAGEAbABhAG4AZAAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBlAG4ALQBaAEEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAFMAbwB1AHQAaAAgAEEAZgByAGkAYwBhACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAbgAtAEcAQgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIAVQBuAGkAdABlAGQAIABLAGkAbgBnAGQAbwBtACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAbgAtAFUAUwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIAVQBuAGkAdABlAGQAIABTAHQAYQB0AGUAcwAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBFAHMAcABhAPEAbwBsACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0AQQBSACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBBAHIAZwBlAG4AdABpAG4AYQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAcABhAG4AaQBzAGgAIAAoAEEAcgBnAGUAbgB0AGkAbgBhACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0AQgBPACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBCAG8AbABpAHYAaQBhACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAUwBwAGEAbgBpAHMAaAAgACgAQgBvAGwAaQB2AGkAYQApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAcwAtAEMATAAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIAQwBoAGkAbABlACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAUwBwAGEAbgBpAHMAaAAgACgAQwBoAGkAbABlACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0AQwBPACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBDAG8AbABvAG0AYgBpAGEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAHAAYQBuAGkAcwBoACAAKABDAG8AbABvAG0AYgBpAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBlAHMALQBDAFIAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAEMAbwBzAHQAYQAgAFIAaQBjAGEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAHAAYQBuAGkAcwBoACAAKABDAG8AcwB0AGEAIABSAGkAYwBhACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0ARQBDACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBFAGMAdQBhAGQAbwByACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAUwBwAGEAbgBpAHMAaAAgACgARQBjAHUAYQBkAG8AcgApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAcwAtAFMAVgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIARQBsACAAUwBhAGwAdgBhAGQAbwByACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAUwBwAGEAbgBpAHMAaAAgACgARQBsACAAUwBhAGwAdgBhAGQAbwByACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0ARQBTACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBFAHMAcABhAPEAYQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAcABhAG4AaQBzAGgAIAAoAFMAcABhAGkAbgApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAcwAtAFUAUwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIARQBzAHQAYQBkAG8AcwAgAFUAbgBpAGQAbwBzACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAUwBwAGEAbgBpAHMAaAAgACgAVQBuAGkAdABlAGQAIABTAHQAYQB0AGUAcwApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAcwAtAEcAVAAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIARwB1AGEAdABlAG0AYQBsAGEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAHAAYQBuAGkAcwBoACAAKABHAHUAYQB0AGUAbQBhAGwAYQApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAcwAtAEgATgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIASABvAG4AZAB1AHIAYQBzACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAUwBwAGEAbgBpAHMAaAAgACgASABvAG4AZAB1AHIAYQBzACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0ATQBYACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBNAOkAeABpAGMAbwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAcABhAG4AaQBzAGgAIAAoAE0AZQB4AGkAYwBvACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0ATgBJACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBOAGkAYwBhAHIAYQBnAHUAYQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAcABhAG4AaQBzAGgAIAAoAE4AaQBjAGEAcgBhAGcAdQBhACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0AUABBACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBQAGEAbgBhAG0A4QAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAcABhAG4AaQBzAGgAIAAoAFAAYQBuAGEAbQBhACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0AUABZACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBQAGEAcgBhAGcAdQBhAHkAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAHAAYQBuAGkAcwBoACAAKABQAGEAcgBhAGcAdQBhAHkAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBlAHMALQBQAEUAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAFAAZQByAPoAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAHAAYQBuAGkAcwBoACAAKABQAGUAcgB1ACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0AUABSACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBQAHUAZQByAHQAbwAgAFIAaQBjAG8AIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAHAAYQBuAGkAcwBoACAAKABQAHUAZQByAHQAbwAgAFIAaQBjAG8AKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBlAHMALQBEAE8AIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAFIAZQBwAPoAYgBsAGkAYwBhACAARABvAG0AaQBuAGkAYwBhAG4AYQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAcABhAG4AaQBzAGgAIAAoAEQAbwBtAGkAbgBpAGMAYQBuACAAUgBlAHAAdQBiAGwAaQBjACkAIgAKACAAIAAgACAAIAAgACAAIAB9ACwACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZQBzAC0AVQBZACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBVAHIAdQBnAHUAYQB5ACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAUwBwAGEAbgBpAHMAaAAgACgAVQByAHUAZwB1AGEAeQApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAcwAtAFYARQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIAVgBlAG4AZQB6AHUAZQBsAGEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAHAAYQBuAGkAcwBoACAAKABWAGUAbgBlAHoAdQBlAGwAYQApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAEUAdQBzAGsAYQByAGEAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBlAHUALQBFAFMAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBCAGEAcwBxAHUAZQAgACgAUwBwAGEAaQBuACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIARgBpAGwAaQBwAGkAbgBvACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZgBpAGwALQBQAEgAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBGAGkAbABpAHAAaQBuAG8AIAAoAFAAaABpAGwAaQBwAHAAaQBuAGUAcwApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAEYAcgBhAG4A5wBhAGkAcwAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGYAcgAtAEYAUgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEYAcgBlAG4AYwBoACAAKABGAHIAYQBuAGMAZQApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAEcAYQBsAGUAZwBvACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAZwBsAC0ARQBTACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIARwBhAGwAaQBjAGkAYQBuACAAKABTAHAAYQBpAG4AKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBIAHIAdgBhAHQAcwBrAGkAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBoAHIALQBIAFIAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBDAHIAbwBhAHQAaQBhAG4AIAAoAEMAcgBvAGEAdABpAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBJAHMAaQBaAHUAbAB1ACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAegB1AC0AWgBBACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAWgB1AGwAdQAgACgAUwBvAHUAdABoACAAQQBmAHIAaQBjAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgDNAHMAbABlAG4AcwBrAGEAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBpAHMALQBJAFMAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBJAGMAZQBsAGEAbgBkAGkAYwAgACgASQBjAGUAbABhAG4AZAApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAEkAdABhAGwAaQBhAG4AbwAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGkAdAAtAEkAVAAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIASQB0AGEAbABpAGEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBJAHQAYQBsAGkAYQBuACAAKABJAHQAYQBsAHkAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBpAHQALQBDAEgAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAFMAdgBpAHoAegBlAHIAYQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBMAGkAZQB0AHUAdgBpAHMBIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBsAHQALQBMAFQAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBMAGkAdABoAHUAYQBuAGkAYQBuACAAKABMAGkAdABoAHUAYQBuAGkAYQApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAE0AYQBnAHkAYQByACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAaAB1AC0ASABVACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIASAB1AG4AZwBhAHIAaQBhAG4AIAAoAEgAdQBuAGcAYQByAHkAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBOAGUAZABlAHIAbABhAG4AZABzACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAbgBsAC0ATgBMACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIARAB1AHQAYwBoACAAKABOAGUAdABoAGUAcgBsAGEAbgBkAHMAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBOAG8AcgBzAGsAIABiAG8AawBtAOUAbAAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAG4AYgAtAE4ATwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAE4AbwByAHcAZQBnAGkAYQBuACAAQgBvAGsAbQDlAGwAIAAoAE4AbwByAHcAYQB5ACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAUABvAGwAcwBrAGkAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBwAGwALQBQAEwAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBQAG8AbABpAHMAaAAgACgAUABvAGwAYQBuAGQAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBQAG8AcgB0AHUAZwB1AOoAcwAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAHAAdAAtAEIAUgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIAQgByAGEAcwBpAGwAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBQAG8AcgB0AHUAZwB1AGUAcwBlACAAKABCAHIAYQB6AGkAbAApACIACgAgACAAIAAgACAAIAAgACAAfQAsAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAHAAdAAtAFAAVAAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABlAHMAYwByAGkAcAB0AGkAbwBuACIAOgAgACIAUABvAHIAdAB1AGcAYQBsACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAUABvAHIAdAB1AGcAdQBlAHMAZQAgACgAUABvAHIAdAB1AGcAYQBsACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAUgBvAG0A4gBuAAMBIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgByAG8ALQBSAE8AIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBSAG8AbQBhAG4AaQBhAG4AIAAoAFIAbwBtAGEAbgBpAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBTAGwAbwB2AGUAbgBhAQ0BaQBuAGEAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBzAGwALQBTAEkAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAGwAbwB2AGUAbgBpAGEAbgAgACgAUwBsAG8AdgBlAG4AaQBhACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAUwBsAG8AdgBlAG4ADQFpAG4AYQAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAHMAawAtAFMASwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAbABvAHYAYQBrACAAKABTAGwAbwB2AGEAawBpAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBTAHUAbwBtAGkAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBmAGkALQBGAEkAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBGAGkAbgBuAGkAcwBoACAAKABGAGkAbgBsAGEAbgBkACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAUwB2AGUAbgBzAGsAYQAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAHMAdgAtAFMARQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAdwBlAGQAaQBzAGgAIAAoAFMAdwBlAGQAZQBuACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAVABpAL8ebgBnACAAVgBpAMcedAAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAHYAaQAtAFYATgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFYAaQBlAHQAbgBhAG0AZQBzAGUAIAAoAFYAaQBlAHQAbgBhAG0AKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBUAPwAcgBrAOcAZQAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAHQAcgAtAFQAUgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFQAdQByAGsAaQBzAGgAIAAoAFQAdQByAGsAZQB5ACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAlQO7A7sDtwO9A7kDugOsAyIALAAKACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEcAcgBlAGUAawAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGUAbAAtAEcAUgAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEcAcgBlAGUAawAgACgARwByAGUAZQBjAGUAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgAxBEoEOwQzBDAEQARBBDoEOAQiACwACgAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBCAHUAbABnAGEAcgBpAGEAbgAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGIAZwAtAEIARwAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEIAdQBsAGcAYQByAGkAYQBuACAAKABCAHUAbABnAGEAcgBpAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBQAEMEQQRBBDoEOAQ5BCIALAAKACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFIAdQBzAHMAaQBhAG4AIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgByAHUALQBSAFUAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBSAHUAcwBzAGkAYQBuACAAKABSAHUAcwBzAGkAYQApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiACEEQAQ/BEEEOgQ4BCIALAAKACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFMAZQByAGIAaQBhAG4AIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBzAHIALQBSAFMAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBTAGUAcgBiAGkAYQBuACAAKABTAGUAcgBiAGkAYQApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiACMEOgRABDAEVwQ9BEEETAQ6BDAEIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIAVQBrAHIAYQBpAG4AaQBhAG4AIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgB1AGsALQBVAEEAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBVAGsAcgBhAGkAbgBpAGEAbgAgACgAVQBrAHIAYQBpAG4AZQApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAFzVba20xSIALAAKACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEsAbwByAGUAYQBuACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAawBvAC0ASwBSACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIASwBvAHIAZQBhAG4AIAAoAFMAbwB1AHQAaAAgAEsAbwByAGUAYQApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAC1Oh2UiACwACgAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBDAGgAaQBuAGUAcwBlACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAYwBtAG4ALQBIAGEAbgBzAC0AQwBOACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGUAcwBjAHIAaQBwAHQAaQBvAG4AIgA6ACAAIgBuZhqQ3YsgACgALU79VidZRpYpACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIATQBhAG4AZABhAHIAaQBuACAAKABTAGkAbQBwAGwAaQBmAGkAZQBkACwAIABDAGgAaQBuAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBjAG0AbgAtAEgAYQBuAHMALQBIAEsAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAG5mGpDdiyAAKACZmS9uKQAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAE0AYQBuAGQAYQByAGkAbgAgACgAUwBpAG0AcABsAGkAZgBpAGUAZAAsACAASABvAG4AZwAgAEsAbwBuAGcAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgBjAG0AbgAtAEgAYQBuAHQALQBUAFcAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiAC1Oh2UgACgA8FNjcCkAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBNAGEAbgBkAGEAcgBpAG4AIAAoAFQAcgBhAGQAaQB0AGkAbwBuAGEAbAAsACAAVABhAGkAdwBhAG4AKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ALAAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgB5AHUAZQAtAEgAYQBuAHQALQBIAEsAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAZQBzAGMAcgBpAHAAdABpAG8AbgAiADoAIAAiALV8noogACgAmZkvbikAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBDAGEAbgB0AG8AbgBlAHMAZQAgACgAVAByAGEAZABpAHQAaQBvAG4AYQBsACwAIABIAG8AbgBnACAASwBvAG4AZwApACIACgAgACAAIAAgACAAIAAgACAAfQAKACAAIAAgACAAIAAgAF0ACgAgACAAIAAgAH0ALAAKACAAIAAgACAAewAKACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAOVlLGeeiiIALAAKACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEoAYQBwAGEAbgBlAHMAZQAiACwACgAgACAAIAAgACAAIAAiAGQAaQBhAGwAZQBjAHQAcwAiADoAIABbAAoAIAAgACAAIAAgACAAIAAgAHsACgAgACAAIAAgACAAIAAgACAAIAAgACIAbgBhAG0AZQAiADoAIAAiAGoAYQAtAEoAUAAiACwACgAgACAAIAAgACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAEoAYQBwAGEAbgBlAHMAZQAgACgASgBhAHAAYQBuACkAIgAKACAAIAAgACAAIAAgACAAIAB9AAoAIAAgACAAIAAgACAAXQAKACAAIAAgACAAfQAsAAoAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAOQk/CSgJTQkmCUAJIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIASABpAG4AZABpACIALAAKACAAIAAgACAAIAAgACIAZABpAGEAbABlAGMAdABzACIAOgAgAFsACgAgACAAIAAgACAAIAAgACAAewAKACAAIAAgACAAIAAgACAAIAAgACAAIgBuAGEAbQBlACIAOgAgACIAaABpAC0ASQBOACIALAAKACAAIAAgACAAIAAgACAAIAAgACAAIgBkAGkAcwBwAGwAYQB5ACIAOgAgACIASABpAG4AZABpACAAKABJAG4AZABpAGEAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9ACwACgAgACAAIAAgAHsACgAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgAgDjIOKQ4yDkQOFw4iDiIALAAKACAAIAAgACAAIAAgACIAZABpAHMAcABsAGEAeQAiADoAIAAiAFQAaABhAGkAIgAsAAoAIAAgACAAIAAgACAAIgBkAGkAYQBsAGUAYwB0AHMAIgA6ACAAWwAKACAAIAAgACAAIAAgACAAIAB7AAoAIAAgACAAIAAgACAAIAAgACAAIAAiAG4AYQBtAGUAIgA6ACAAIgB0AGgALQBUAEgAIgAsAAoAIAAgACAAIAAgACAAIAAgACAAIAAiAGQAaQBzAHAAbABhAHkAIgA6ACAAIgBUAGgAYQBpACAAKABUAGgAYQBpAGwAYQBuAGQAKQAiAAoAIAAgACAAIAAgACAAIAAgAH0ACgAgACAAIAAgACAAIABdAAoAIAAgACAAIAB9AAoAIAAgAF0ACgB9AA==`)));

    var returnStr = JSON.stringify(document.mWebGLSpeechDetectionLanguages);
    //console.log('WebGLSpeechDetectionPluginGetLanguages', 'returns', returnStr);

    var bufferSize = lengthBytesUTF8(returnStr) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(returnStr, buffer, bufferSize);
    return buffer;
  },

  WebGLSpeechDetectionPluginSetLanguage: function (dialect) {
    //console.log("SetLanguage: "+UTF8ToString(dialect));

    if (document.mWebGLSpeechDetectionPluginRecognition == undefined) {
      return;
    }

    document.mWebGLSpeechDetectionPluginRecognition.lang = UTF8ToString(dialect);
  }
});
