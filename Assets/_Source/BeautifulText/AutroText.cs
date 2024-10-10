using System;
using System.Collections;
using System.Collections.Generic;
using DG.Tweening;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class AutroText : MonoBehaviour
{
    [SerializeField] [TextArea] private string rusText;
    [SerializeField] private TMP_Text text;
    [SerializeField][TextArea] private string newTextR;
    [SerializeField][TextArea] private string newTextE;
    [SerializeField] private Image black;

    private void Awake()
    {
        black.DOFade(0, 2);
        
        if (PlayerPrefs.GetInt("Lang") == 1)
        {
            text.text = rusText;
            
        }

        StartCoroutine(Dur());
    }

    IEnumerator Dur()
    {
        yield return new WaitForSeconds(10);
        if (PlayerPrefs.GetInt("Lang") == 1)
        {
            text.text = newTextR;
            
        } 
        else
            text.text = newTextE;
        yield return new WaitForSeconds(2);
        black.DOFade(1, 4);
        SceneManager.LoadScene("Main Menu");
    }
}
