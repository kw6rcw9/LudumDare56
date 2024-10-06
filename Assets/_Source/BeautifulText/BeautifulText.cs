using System.Collections;
using TMPro;
using UnityEngine;

namespace _Source.BeautifulText
{
    public class BeautifulText : MonoBehaviour
    {
        public float typingSpeed = 0.05f;
        public TMP_Text dialogueText;
        public AudioSource audioSource;

        private string currentText;

        
        private void OnEnable()
        {
            BeautifulTextTrigger.beautifulSpeacAction += NewMessage;
        }

        private void NewMessage(string text, AudioClip clip)
        {
            audioSource.clip = clip;
            audioSource.Play();
            StartCoroutine(ShowText(text));
        }

        private IEnumerator ShowText(string text)
        {
            currentText = "";
            for (var i = 1; i <= text.Length; i++)
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