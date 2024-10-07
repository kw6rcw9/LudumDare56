using System;
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Audio;

namespace _Source.Settings
{
    public class PauseManager : MonoBehaviour
    {
        public static Action SetLanguageRu;
        public static Action SetLanguageEn;
        
        public Button pauseButton;
        public Button continueButton;
        public GameObject menuObject;
        public Button langRuButton;
        public Button langEnButton;
        public Button soundButton;
        public Button musicButton;
        public Slider soundSlider;
        public Slider musicSlider;
        public AudioMixer audioMixer;
        public Sprite musicButtonSprite;
        public Sprite musicButtonOffSprite;
        public Sprite soundButtonSprite;
        public Sprite soundButtonOffSprite;
        public AudioSource musicSource;

        private void Start()
        {
            pauseButton.onClick.AddListener(SetPauseOn);
            continueButton.onClick.AddListener(SetPauseOff);
            langRuButton.onClick.AddListener(SetLangRu);
            langEnButton.onClick.AddListener(SetLangEn);
            AwakeMusicUI();
            AwakeSoundUI();
            musicSource.Play();
        }

        private void SetLangRu()
        {
            SetLanguageRu?.Invoke();
            PlayerPrefs.SetInt("Lang", 1);
            Debug.Log("SetLangRu worked out");
        }
        private void SetLangEn()
        {
            SetLanguageEn?.Invoke();
            PlayerPrefs.SetInt("Lang", 0);
            Debug.Log("SetLangEn worked out");
        }

        private void SetPauseOn()
        {
            pauseButton.gameObject.SetActive(false);
            menuObject.gameObject.SetActive(true);
            Debug.Log("SetPauseOn worked out");
        }
        private void SetPauseOff()
        {
            menuObject.gameObject.SetActive(false);
            pauseButton.gameObject.SetActive(true);
            Debug.Log("SetPauseOff worked out");
        }

        private void SoundOff()
        {
            audioMixer.SetFloat("Sound", -80f);
            PlayerPrefs.SetInt("IsSound", 1);
            PlayerPrefs.Save();
            soundButton.GetComponent<Image>().sprite = soundButtonOffSprite;
            soundButton.onClick.RemoveListener(SoundOff);
            soundButton.onClick.AddListener(SoundOn);
            Debug.Log("SoundOff worked out");
        }

        private void SoundOn()
        {
            audioMixer.SetFloat("Sound", soundSlider.value);
            PlayerPrefs.SetInt("IsSound", 0);
            PlayerPrefs.Save();
            soundButton.GetComponent<Image>().sprite = soundButtonSprite;
            soundButton.onClick.RemoveListener(SoundOn);
            soundButton.onClick.AddListener(SoundOff);
            Debug.Log("SoundOn worked out");
        }
        
        private void AwakeSoundUI() {
            if (PlayerPrefs.HasKey("Sound"))
            {
                soundSlider.value = PlayerPrefs.GetFloat("Sound");
                soundSlider.onValueChanged.AddListener(ChangeSound);
            }
            else
            {
                PlayerPrefs.SetFloat("Sound", soundSlider.value);
                PlayerPrefs.Save();
            }

            // SoundToggle button
            if (PlayerPrefs.HasKey("IsSound") && PlayerPrefs.GetInt("IsSound") == 1)
            {
                SoundOff();
            }
            else
            {
                SoundOn();
            }
        }

        
        private void ChangeSound(float value)
        {
            audioMixer.SetFloat("Sound", value);
            PlayerPrefs.SetFloat("Sound", value);
            if (PlayerPrefs.GetInt("IsSound") == 1) {
                SoundOn();
            }
            PlayerPrefs.Save();
            Debug.Log("ChangeSound worked out; Sound: " + PlayerPrefs.GetFloat("Sound"));
        }
        
        public void ChangeMusic(float value)
        {
            audioMixer.SetFloat("Music", value);
            PlayerPrefs.SetFloat("Music", value);
            if (PlayerPrefs.GetInt("IsMusic") == 1) {
                MusicOn();
            }
            PlayerPrefs.Save();
            Debug.Log("ChangeMusic worked out; Music: " + PlayerPrefs.GetFloat("Music"));
        }
        private void AwakeMusicUI() {
            if (PlayerPrefs.HasKey("Music"))
            {
                musicSlider.value = PlayerPrefs.GetFloat("Music");
                musicSlider.onValueChanged.AddListener(ChangeMusic);
            }
            else
            {
                PlayerPrefs.SetFloat("Music", musicSlider.value);
                PlayerPrefs.Save();
            }

            // MusicToggle button
            if (PlayerPrefs.HasKey("IsMusic") && PlayerPrefs.GetInt("IsMusic") == 1)
            {
                MusicOff();
            }
            else
            {
                MusicOn();
            }
        }
        
        private void MusicOff()
        {
            audioMixer.SetFloat("Music", -80f);
            PlayerPrefs.SetInt("IsMusic", 1);
            PlayerPrefs.Save();
            musicButton.GetComponent<Image>().sprite = musicButtonOffSprite;
            musicButton.onClick.RemoveListener(MusicOff);
            musicButton.onClick.AddListener(MusicOn);
            Debug.Log("MusicOff worked out");
        }
        private void MusicOn()
        {
            audioMixer.SetFloat("Music", musicSlider.value);
            PlayerPrefs.SetInt("IsMusic", 0);
            PlayerPrefs.Save();
            musicButton.GetComponent<Image>().sprite = musicButtonSprite;
            musicButton.onClick.RemoveListener(MusicOn);
            musicButton.onClick.AddListener(MusicOff);
            Debug.Log("MusicOn worked out");
        }
    }
}
