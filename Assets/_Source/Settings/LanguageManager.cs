using System;
using System.Collections;
using System.Collections.Generic;
using _Source.Settings;
using UnityEngine;
using UnityEngine.Android;

public class LanguageManager : MonoBehaviour
{
    public static Action SetLanguageRuAction;
    public static Action SetLanguageEnAction;

    public void Dispose()
    {
        PauseManager.SetLanguageRu -= SetLanguageRU;
        PauseManager.SetLanguageEn -= SetLanguageEN;
    }
    
    private void Awake()
    {
        PauseManager.SetLanguageRu += SetLanguageRU;
        PauseManager.SetLanguageEn += SetLanguageEN;
    }

    private void Start()
    {
        if (!PlayerPrefs.HasKey("Lang"))
        {
            PlayerPrefs.SetInt("Lang", 0);
        }
        if (PlayerPrefs.GetInt("Lang") == 0)
        {
            SetLanguageEnAction?.Invoke();
        } else if (PlayerPrefs.GetInt("Lang") == 1)
        {
            SetLanguageRuAction?.Invoke();
        }
    }

    private void SetLanguageRU()
    {
        PlayerPrefs.SetInt("Lang", 1);
        PlayerPrefs.Save();
        SetLanguageRuAction?.Invoke();
    }

    private void SetLanguageEN()
    {
        PlayerPrefs.SetInt("Lang", 0);
        PlayerPrefs.Save();
        SetLanguageEnAction?.Invoke();
    }
}
