using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;

public class AutroText : MonoBehaviour
{
    [SerializeField] [TextArea] private string rusText;
    [SerializeField] private TMP_Text text;

    private void Awake()
    {
        if (PlayerPrefs.GetInt("Lang") == 1)
        {
            text.text = rusText;
            
        } 
    }
}
