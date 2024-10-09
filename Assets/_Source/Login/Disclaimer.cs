using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Disclaimer : MonoBehaviour
{
    IEnumerator Start()
    {
        yield return new WaitForSeconds(10);
        SceneManager.LoadScene("Login Screen");
    }
}
