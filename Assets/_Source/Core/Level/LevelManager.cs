using System;
using System.Collections;
using System.Collections.Generic;
using _Source.BeautifulText;
using Core.MapSystem.Data;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class LevelManager : MonoBehaviour
{
    public TMP_Text timeTextTime;
    public Button nextButton;
    public string nextSceneName;
    public Sprite nextButtonEN;
    public Sprite nextButtonRU;
    public Button restartButton;
    public Sprite restartButtonEN;
    public Sprite restartButtonRU;
    public GameObject background;
    public Sprite backgroundEN;
    public Sprite backgroundRU;
    public Image failure;
    public Sprite failureEN;
    public Sprite failureRU;
    public Image success;
    public Sprite successEN;
    public Sprite successRU;
    public BeautifulText beautifulText;
    public VoiceLine voiceLineIntro;
    public VoiceLine[] voiceLinesWellDone;
    public VoiceLine[] voiceLinesRandom;

    private float startedAt;

    private void OnEnable()
    {
        TieInfo.LoseAction += Lose;
        TieInfo.WinAction += Win;
    }

    private void OnDisable()
    {
        TieInfo.WinAction -= Win;
        TieInfo.LoseAction -= Lose;
    }

    public void SetLanguageRu()
    {
        nextButton.gameObject.GetComponent<Image>().sprite = nextButtonRU;
        restartButton.gameObject.GetComponent<Image>().sprite = restartButtonRU;
        background.GetComponent<Image>().sprite = backgroundRU;
        failure.sprite = failureRU;
        success.sprite = successRU;
    }

    public void SetLanguageEn()
    {
        nextButton.gameObject.GetComponent<Image>().sprite = nextButtonEN;
        restartButton.gameObject.GetComponent<Image>().sprite = restartButtonEN;
        background.GetComponent<Image>().sprite = backgroundEN;
        failure.sprite = failureEN;
        success.sprite = successEN;
    }

    public void Win()
    {
        beautifulText.NewMessageWithVL(voiceLinesWellDone[new System.Random().Next(voiceLinesWellDone.Length)]);
        background.SetActive(true);
        nextButton.gameObject.SetActive(true);
        success.gameObject.SetActive(true);
        timeTextTime.text = getDurationText();
    }

    public void Lose()
    {
        background.SetActive(true);
        restartButton.gameObject.SetActive(true);
        failure.gameObject.SetActive(true);
        timeTextTime.text = getDurationText();
    }

    public void NextScene()
    {
        Debug.Log("NextScene");
        SceneManager.LoadScene(nextSceneName);
    }

    public void RestartScene()
    {
        Debug.Log("RestartScene");
        SceneManager.LoadScene("Main Menu");
    }

    private string getDurationText()
    {
        float duration = Convert.ToInt32(Time.time - startedAt);
        string durationText = $"{duration / 60:00}:{duration % 60:00}";
        return durationText;
    }

    private void Awake()
    {
        LanguageManager.SetLanguageEnAction += SetLanguageEn;
        LanguageManager.SetLanguageRuAction += SetLanguageRu;
    }

    public void Dispose()
    {
        LanguageManager.SetLanguageEnAction -= SetLanguageEn;
        LanguageManager.SetLanguageRuAction -= SetLanguageRu;
    }

    private void Start()
    {
        startedAt = Time.time;
        nextButton.onClick.AddListener(NextScene);
        restartButton.onClick.AddListener(RestartScene);
        if (!PlayerPrefs.HasKey("StartMessage"))
        {
            beautifulText.NewMessageWithVL(voiceLineIntro);
            PlayerPrefs.SetInt("StartMessage", 0);
        }
        // else
        // {
        //     beautifulText.NewMessageWithVL(voiceLinesRandom[new System.Random().Next(voiceLinesRandom.Length)]);
        // }
    }
}