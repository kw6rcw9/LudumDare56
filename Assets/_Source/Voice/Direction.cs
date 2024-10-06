using System;
using System.Collections;
using Unity.VisualScripting;
using UnityEngine;
using UnityWebGLSpeechDetection;
using UnityWebGLSpeechSynthesis;

namespace _Source.Voice
{
    public class Direction : MonoBehaviour
    {
        public static Action<int> movementAction;
        public static Action<int> scoundrelAction;
        
        /// <summary>
        /// Reference to the detection plugin
        /// </summary>
        private ISpeechDetectionPlugin _mSpeechDetectionPlugin = null;

        /// <summary>
        /// Reference to the synthesis plugin
        /// </summary>
        private ISpeechSynthesisPlugin _mSpeechSynthesisPlugin = null;

        // Use this for initialization
        private IEnumerator Start()
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
        
        private static bool HandleDetectionResult(DetectionResult detectionResult)
        {
            if (null == detectionResult?.results)
            {
                return false;
            }
            
            if (detectionResult.results[^1].isFinal)
            {
                string transcript = detectionResult.results[^1].alternatives[0].transcript;
                string[] splitedTranscript = transcript.Split();
                for (int i = 0; i < splitedTranscript.Length; i++)
                {
                    int direction = 0;
                    int scoundrel = 0;
                    switch (splitedTranscript[i].ToLower())
                    {
                        case "вправо" or "right" or "право" or "права":
                            direction = 1;
                            break;
                        case "вниз" or "down" or "низ":
                            direction = 2;
                            break;
                        case "влево" or "left" or "лево":
                            direction = 3;
                            break;
                        case "вверх" or "up" or "верх":
                            direction = 4;
                            break;
                        
                        case "мама" or "mother":
                            scoundrel = 1;
                            break;
                        case "гол":
                            scoundrel = 2;
                            break;
                    }

                    if (direction != 0)
                    {
                        movementAction?.Invoke(direction);
                        Debug.Log("Invoked movementAction: " + direction);
                    }

                    if (scoundrel != 0)
                    {
                        scoundrelAction?.Invoke(scoundrel);
                        Debug.Log("Invoked scoundrelAction: " + scoundrel);
                    }
                }
            }

            return false;
        }
    }
}
