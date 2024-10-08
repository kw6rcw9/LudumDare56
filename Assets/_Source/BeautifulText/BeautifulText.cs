using System.Collections;
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

        private string currentText;

        public void NewMessageWithVL(VoiceLine voiceLine)
        {
            string text;
            AudioClip clip;
            float typingSpeed;
            if (PlayerPrefs.GetInt("Lang") == 0)
            {
                text = voiceLine.textLineEn;
                clip = voiceLine.voiceLineEn;
                typingSpeed = voiceLine.speedLineEn;
            } else
            {
                text = voiceLine.textLineRu;
                clip = voiceLine.voiceLineRu;
                typingSpeed = voiceLine.speedLineRu;
            }
            
            NewMessage(text, clip, voiceLine.emotions, typingSpeed);
        }
        
        private void OnEnable()
        {
            // BeautifulTextTrigger.beautifulSpeacAction += NewMessage;
        }

        private void NewMessage(string text, AudioClip clip, string emotions, float typingSpeed)
        {
            audioSource.clip = clip;
            audioSource.Play();
            StartCoroutine(ShowText(text, emotions, typingSpeed));
        }

        private IEnumerator ShowText(string text, string emotions, float typingSpeed)
        {
            wrapper.SetActive(true);
            text += "                         ";
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
                wrapper.SetActive(false);
            }
        }
    }
}