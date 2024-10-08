using System;
using System.Collections;
using System.Collections.Generic;
using _Source.BeautifulText;
using Unity.VisualScripting;
using UnityEngine;

public class BeautifulTextTrigger : MonoBehaviour
{
    public float retryDelay = 10;

    public BeautifulText beautifulText;
    public VoiceLine voiceLine;

    void Start()
    {
        StartCoroutine(beautifulSpeacActionInvokerTest());
    }

    private IEnumerator beautifulSpeacActionInvokerTest()
    {
        while (true)
        {
            beautifulText.NewMessageWithVL(voiceLine);
            Debug.Log("Invoking beautifulSpeacAction");
            yield return new WaitForSeconds(retryDelay);
        }
    }

}
