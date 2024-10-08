using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class MainMenuManager : MonoBehaviour
{
    public Button Normal;
    public Sprite NormalEN;
    public Sprite NormalRU;
    public Button Settings;
    public Sprite SettingsEN;
    public Sprite SettingsRU;
    public Button Arcade;
    public Sprite ArcadeEN;
    public Sprite ArcadeRU;
    public GameObject Leaderboard;
    public Button LeaderboardButton;
    public Button LeaderboardCloseButton;
    public GameObject ArcadeLock;
    public TMP_Text ArcadeLockLabel;

    [SerializeField] private AudioSource audioSourceSFX;
    
    public void SetLanguageRu()
    {
        ArcadeLockLabel.text = "Скоро...";
        Settings.gameObject.GetComponent<Image>().sprite = SettingsRU;
        Arcade.gameObject.GetComponent<Image>().sprite = ArcadeRU;
        Normal.gameObject.GetComponent<Image>().sprite = NormalRU;
    }

    public void SetLanguageEn()
    {
        ArcadeLockLabel.text = "Coming soon...";
        Settings.gameObject.GetComponent<Image>().sprite = SettingsEN;
        Arcade.gameObject.GetComponent<Image>().sprite = ArcadeEN;
        Normal.gameObject.GetComponent<Image>().sprite = NormalEN;
    }

    private void StopHandling()
    {
        LanguageManager.SetLanguageEnAction -= SetLanguageEn;
        LanguageManager.SetLanguageRuAction -= SetLanguageRu;
    }

    private void normalVoid()
    {
        audioSourceSFX.Play();
        StopHandling();
        SceneManager.LoadScene("Level 1");
        Debug.Log("normalVoid");
    }


    private void arcadeVoid()
    {
        Debug.Log("arcadeVoid");
        if (!PlayerPrefs.HasKey("ArcadeAvailable"))
        {
            return;
        }
        audioSourceSFX.Play();
        StopHandling();
    }


    private void settingsVoid()
    {
        audioSourceSFX.Play();
        Debug.Log("settingsVoid");
    }

    private void openLeaderboard()
    {
        audioSourceSFX.Play();
        Leaderboard.SetActive(true);
    }
    private void closeLeaderboard()
    {
        audioSourceSFX.Play();
        Leaderboard.SetActive(false);
    }
    
    private void Awake()
    {
        Normal.onClick.AddListener(normalVoid);
        Arcade.onClick.AddListener(arcadeVoid);
        Settings.onClick.AddListener(settingsVoid);
        LeaderboardButton.onClick.AddListener(openLeaderboard);
        LeaderboardCloseButton.onClick.AddListener(closeLeaderboard);
        LanguageManager.SetLanguageEnAction += SetLanguageEn;
        LanguageManager.SetLanguageRuAction += SetLanguageRu;
        if (PlayerPrefs.HasKey("ArcadeAvailable"))
        {
            ArcadeLock.SetActive(false);
        }
    }
}
