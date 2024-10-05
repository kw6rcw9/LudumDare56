using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Voice : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void YourMethod(string transcript) {
        Debug.Log("Recognized text: " + transcript);
        // Process the recognized text as needed
    }
    public void OnStartButtonClick() {
    Application.ExternalCall("startRecognition");
}
}
