using System;
using System.Collections;
using System.Collections.Generic;
using _Source.BeautifulText;
using Unity.VisualScripting;
using UnityEngine;

public class BeautifulTextTrigger : MonoBehaviour
{
    public float retryDelay = 10;
    private AudioClip audioClip;
    private string text = "";
    public static Action<string, AudioClip, string> beautifulSpeacAction;

    public VoiceLine voiceLine;

    void Start()
    {
        StartCoroutine(beautifulSpeacActionInvokerTest());
    }

    private IEnumerator beautifulSpeacActionInvokerTest()
    {
        while (true)
        {
            Debug.Log("Invoking beautifulSpeacAction");
            if (PlayerPrefs.GetInt("Lang") == 0)
            {
                text = voiceLine.textLineEn;
                audioClip = voiceLine.voiceLineEn;
            } else
            {
                text = voiceLine.textLineRu;
                audioClip = voiceLine.voiceLineRu;
            }
            beautifulSpeacAction?.Invoke(text, audioClip, voiceLine.emotions);
            yield return new WaitForSeconds(retryDelay);
        }
    }

}
