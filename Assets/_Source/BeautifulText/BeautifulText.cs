using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace _Source.BeautifulText
{
    public class BeautifulText : MonoBehaviour
    {
        public float typingSpeed = 0.05f;
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
            BeautifulTextTrigger.beautifulSpeacAction += NewMessage;
        }

        private void NewMessage(string text, AudioClip clip, string emotions)
        {
            audioSource.clip = clip;
            audioSource.Play();
            StartCoroutine(ShowText(text, emotions));
        }

        private IEnumerator ShowText(string text, string emotions)
        {
            wrapper.SetActive(true);
            text += "                         ";
            string[] splittedText = text.Split("&");
            for (int j = 0; j < splittedText.Length; j++)
            {
                profile.sprite = emotionList[emotions[j] - '0'];
                text = splittedText[j];
                currentText = "";
                for (int i = 1; i <= text.Length; i++)
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
        }
    }
}