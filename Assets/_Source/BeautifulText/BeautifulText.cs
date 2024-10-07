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
            
            yield return new WaitForSeconds(2);
            wrapper.SetActive(false);
        }
    }
}