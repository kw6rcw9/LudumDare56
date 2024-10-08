using System;
using System.Collections;
using DG.Tweening;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace _Source.BeautifulText
{
    public class BeautifulText : MonoBehaviour
    {
        public TMP_Text dialogueText;
        public AudioSource audioSource;
        public Image profile;
        public Sprite[] emotionList;
        public GameObject wrapper;
        public float typingSpeed = 0.05f;
        public Image messageBG;

        private string currentText;

        public void NewMessageWithVL(VoiceLine voiceLine)
        {
            string text;
            AudioClip clip;
            if (PlayerPrefs.GetInt("Lang") == 0)
            {
                text = voiceLine.textLineEn;
                clip = voiceLine.voiceLineEn;
            } else
            {
                text = voiceLine.textLineRu;
                clip = voiceLine.voiceLineRu;
            }
            
            NewMessage(text, clip, voiceLine.emotions);
        }
        
        private void OnEnable()
        {
            // BeautifulTextTrigger.beautifulSpeacAction += NewMessage;
        }

        private void NewMessage(string text, AudioClip clip, string emotions)
        {
            audioSource.clip = clip;
            audioSource.Play();
            StartCoroutine(ShowText(text, emotions));
        }

        private void DOFadeWithChildreb(GameObject gameObject, float fade, float time)
        {
            gameObject.GetComponent<Image>()?.DOFade(fade, time);
            foreach (Image child in gameObject.GetComponentsInChildren<Image>())
            {
                if (child == messageBG && fade > 0.33f)
                {
                    child.DOFade(0.33f, time);
                }
                else
                {
                    child.DOFade(fade, time);
                }
            }
            foreach (TMP_Text child in gameObject.GetComponentsInChildren<TMP_Text>())
            {
                child.DOFade(fade, time);
            }
        }

        private void Start()
        {
            DOFadeWithChildreb(wrapper, 0, 0);
        }

        private IEnumerator ShowText(string text, string emotions)
        {
            DOFadeWithChildreb(wrapper, 1, 2);
            text += "                           ";
            string[] splittedText = text.Split("&");
            int j;
            int i = 1;
            for (j = 0; j < splittedText.Length; j++)
            {
                profile.sprite = emotionList[emotions[j] - '0'];
                text = splittedText[j];
                currentText = "";
                for (i = 1; i <= text.Length; i++)
                {
                    if (currentText != text[..(i - 1)])
                    {
                        break;
                    }

                    currentText = text[..i];
                    dialogueText.text = currentText;
                    yield return new WaitForSeconds(typingSpeed);
                } 
            }

            if (j == splittedText.Length && text.Length < i)
            {
                yield return new WaitForSeconds(audioSource.clip.length - audioSource.time);
                DOFadeWithChildreb(wrapper, 0f, 1);
            }
        }
    }
}