using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;

namespace _Source.Login
{
    public class Login : MonoBehaviour
    {
        public TMP_Text inputContent;
        [SerializeField] private AudioSource audioSourceSFX;

        private void Awake()
        {
            if (PlayerPrefs.HasKey("UserName"))
            {
                Debug.Log("User name: " + PlayerPrefs.GetString("UserName"));
                SceneManager.LoadScene("Main Menu");
            }
        }
        
        public void Register() {
            audioSourceSFX.Play();
            PlayerPrefs.SetString("UserName", inputContent.text);
            PlayerPrefs.Save();
            Debug.Log("Saved user name: " + PlayerPrefs.GetString("UserName"));
            SceneManager.LoadScene("Main Menu");
        }
    }
}
