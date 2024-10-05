﻿using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityWebGLSpeechDetection;
using UnityWebGLSpeechSynthesis;

namespace VoiceTracking
{
    public class Example01DictationSynthesis : MonoBehaviour
    {
        /// <summary>
        /// Reference to the detection plugin
        /// </summary>
        private ISpeechDetectionPlugin _mSpeechDetectionPlugin = null;

        /// <summary>
        /// Reference to the synthesis plugin
        /// </summary>
        private ISpeechSynthesisPlugin _mSpeechSynthesisPlugin = null;

        // Use this for initialization
        IEnumerator Start()
        {
            _mSpeechDetectionPlugin = SpeechDetectionUtils.GetInstance();

            if (null == _mSpeechDetectionPlugin)
            {
                Debug.LogError("Speech Detection Plugin is not set!");
                yield break;
            }

            // wait for plugin to become available
            while (!_mSpeechDetectionPlugin.IsAvailable())
            {
                yield return null;
            }

            // get singleton instance
            _mSpeechSynthesisPlugin = SpeechSynthesisUtils.GetInstance();
            if (null == _mSpeechSynthesisPlugin)
            {
                Debug.LogError("Speech Synthesis Plugin is not set!");
                yield break;
            }

            // wait for proxy to become available
            while (!_mSpeechSynthesisPlugin.IsAvailable())
            {
                yield return null;
            }

            _mSpeechDetectionPlugin.AddListenerOnDetectionResult(HandleDetectionResult);
        }
        
        bool HandleDetectionResult(DetectionResult detectionResult)
        {
            if (null == detectionResult)
            {
                return false;
            }

            if (null == detectionResult.results)
            {
                return false;
            }
            
            if (detectionResult.results[^1].isFinal)
            {
                
                Debug.Log("Got final words: " + detectionResult.results[^1].alternatives[0].transcript);
            }

            return false;
        }
    }
}
