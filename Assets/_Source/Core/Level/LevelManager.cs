using System;
using System.Collections;
using System.Collections.Generic;
using _Source.BeautifulText;
using Core;
using Core.MapSystem.Data;
using Core.PlayerController;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

using Timer = Core.TimerSystem.Timer;

using DG.Tweening;


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
    public Image fadein;
    public VoiceLine voiceLineIntro;
    public VoiceLine[] voiceLinesWellDone;
    public VoiceLine[] voiceLinesRandom;
    public VoiceLine[] voiceLinesFailure;

    private float startedAt;

    private void Awake()
    {
        TieInfo.LoseAction += Lose;
        TieInfo.WinAction += Win;
        Timer.LoseAction += Lose;
        LanguageManager.SetLanguageEnAction += SetLanguageEn;
        LanguageManager.SetLanguageRuAction += SetLanguageRu;
        Bootstrapper.DisposeAction += Dispose;
    }

    private void Dispose()
    {
        TieInfo.LoseAction -= Lose;
        TieInfo.WinAction -= Win;
        Timer.LoseAction -= Lose;
        LanguageManager.SetLanguageEnAction -= SetLanguageEn;
        LanguageManager.SetLanguageRuAction -= SetLanguageRu;
        Bootstrapper.DisposeAction -= Dispose;
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
        //Time.timeScale = 0;
        if (background.activeSelf)
        {
            return;
        }
        Movement.EnableMovement = false;
        beautifulText.NewMessageWithVL(voiceLinesWellDone[new System.Random().Next(voiceLinesWellDone.Length)]);

        fadein.DOFade(0.5f, 3f);

        background.SetActive(true);
        nextButton.gameObject.SetActive(true);
        success.gameObject.SetActive(true);
        timeTextTime.text = getDurationText();
    }

    public void Lose()
    {
        if (background.activeSelf)
        {
            return;
        }
        Movement.EnableMovement = false;
        beautifulText.NewMessageWithVL(voiceLinesFailure[new System.Random().Next(voiceLinesFailure.Length)]);

        fadein.DOFade(0.5f, 3f);

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
        int duration = Convert.ToInt32(Time.time - startedAt);
        string durationText = $"{duration / 60:00}:{duration % 60:00}";
        return durationText;
    }

    private void Start()
    {
        startedAt = Time.time;
        nextButton.onClick.AddListener(NextScene);
        restartButton.onClick.AddListener(RestartScene);
        if (!PlayerPrefs.HasKey("StartMessage"))
        {
            StartCoroutine(NewMessageWithVLAfterDelay(voiceLineIntro, 1.5f));
            PlayerPrefs.SetInt("StartMessage", 0);
        }
        else
        {
            StartCoroutine(NewMessageWithVLAfterDelay(voiceLinesRandom[new System.Random().Next(voiceLinesRandom.Length)], 1.5f));
        }
    }
    
    private IEnumerator NewMessageWithVLAfterDelay(VoiceLine vl, float delay)
    {
        yield return new WaitForSeconds(delay);
        beautifulText.NewMessageWithVL(vl);
    }
}