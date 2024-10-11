using System;
using System.Collections;
using Core;
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
        private float lastAction;


        private ISpeechDetectionPlugin _mSpeechDetectionPlugin = null;

        private void Awake()
        {
            LanguageManager.SetLanguageEnAction += setLangEn;
            LanguageManager.SetLanguageRuAction += setLangRu;
            Bootstrapper.DisposeAction += Dispose;
        }

        private void Dispose()
        {
            LanguageManager.SetLanguageEnAction -= setLangEn;
            LanguageManager.SetLanguageRuAction -= setLangRu;
            Bootstrapper.DisposeAction -= Dispose;
        }

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

            lastAction = Time.time;
            _mSpeechDetectionPlugin.AddListenerOnDetectionResult(HandleDetectionResult);
        }

        private void setLangEn()
        {
            _mSpeechDetectionPlugin?.SetLanguage("en-AU");
        }

        private void setLangRu()
        {
            _mSpeechDetectionPlugin?.SetLanguage("ru-RU");
        }

        private bool HandleDetectionResult(DetectionResult detectionResult)
        {

            if (null == detectionResult)
            {
                return false;
            }
            SpeechRecognitionResult[] results = detectionResult.results;
            if (null == results)
            {
                return false;
            }
            int direction = 0;
            int scoundrel = 0;

            foreach (SpeechRecognitionResult result in results)
            {
                SpeechRecognitionAlternative[] alternatives = result.alternatives;
                if (null == alternatives)
                {
                    continue;
                }

                foreach (SpeechRecognitionAlternative alternative in alternatives)
                {
                    if (string.IsNullOrEmpty(alternative.transcript))
                    {
                        continue;
                    }
                    string lower = alternative.transcript.ToLower();

                    Debug.Log("Услышал: " + lower);
                    if (lower.Contains("прав") || lower.Contains("right"))
                    {
                        direction = 1;
                    }
                    else if (lower.Contains("низ") || lower.Contains("down"))
                    {
                        direction = 2;
                    }
                    else if (lower.Contains("лево") || lower.Contains("left") || lower.Contains("лего"))
                    {
                        direction = 3;
                    }
                    else if (lower.Contains("верх") || lower.Contains("up") || lower.Contains("перёд") || lower.Contains("прямо") || lower.Contains("app"))
                    {
                        direction = 4;
                    }
                }
                if (direction != 0 || scoundrel != 0)
                {
                    break;
                }
            }

            if ((lastAction + 1.1f > Time.time) && (direction != 0 || scoundrel != 0))
            {
                _mSpeechDetectionPlugin.Abort();
                return true;
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

            if (direction != 0 || scoundrel != 0)
            {
                lastAction = Time.time;
                _mSpeechDetectionPlugin.Abort();
                return true;
            }

            return false;
        }
    }
}
