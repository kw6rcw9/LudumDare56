using System.Collections;
using System.Collections.Generic;
using System;
using Core;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace _Source.Login
{
    public class Login : MonoBehaviour
    {
        public TMP_Text inputContent;
        public TMP_Text placeholder;
        public Image backgroundLogin;
        public Sprite backgroundLoginEn;
        public Sprite backgroundLoginRu;
        [SerializeField] private AudioSource audioSourceSFX;

        private void Awake()
        {
            if (PlayerPrefs.HasKey("UserName") && PlayerPrefs.HasKey("UserID"))
            {
                Debug.Log("User name: " + PlayerPrefs.GetString("UserName"));
                SceneManager.LoadScene("Main Menu");
            }
            LanguageManager.SetLanguageEnAction += setLanguageEn;
            LanguageManager.SetLanguageRuAction += setLanguageRu;
            Bootstrapper.DisposeAction += Dispose;
        }

        public void Dispose()
        {
            LanguageManager.SetLanguageEnAction -= setLanguageEn;
            LanguageManager.SetLanguageRuAction -= setLanguageRu;
            Bootstrapper.DisposeAction -= Dispose;
        }
        
        public void setLanguageEn()
        {
            placeholder.text = "Enter identifier...";
            backgroundLogin.sprite = backgroundLoginEn;
        }
        
        public void setLanguageRu()
        {
            placeholder.text = "Введите идентификатор...";
            backgroundLogin.sprite = backgroundLoginRu;
        }
        
        public void Register() {
            audioSourceSFX.Play();
            PlayerPrefs.SetString("UserName", inputContent.text);
            PlayerPrefs.SetString("UserID", Guid.NewGuid().ToString());
            PlayerPrefs.Save();
            Debug.Log("Saved user name: " + PlayerPrefs.GetString("UserName"));
            SceneManager.LoadScene("Main Menu");
        }
    }
}
