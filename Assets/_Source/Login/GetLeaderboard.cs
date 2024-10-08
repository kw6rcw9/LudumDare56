using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;

public class GetLeaderboard : MonoBehaviour
{
    public GameObject leaderboardUser;
    private string url = "https://donchap.ru:15055/leaderboard";
    
    void Start()
    {
        StartCoroutine(GetUsers());
    }
    
    [System.Serializable]
    public class UserList
    {
        public List<User> users;
    }
    
    [System.Serializable]
    public class User
    {
        public string username;
        public string time;
        public string stage;
    }
    
    
    IEnumerator GetUsers()
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(url))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Error: {webRequest.error}");
            }
            else
            {
                string jsonResult = webRequest.downloadHandler.text;
                UserList userList = JsonUtility.FromJson<UserList>(jsonResult);
                ProcessData(userList);
            }
        }
    }
    
    void ProcessData(UserList userList)
    {
        Vector3 position = new Vector3(51, 236, 0);
        foreach (User user in userList.users)
        {
            GameObject leaderboardUserClone = Instantiate(leaderboardUser);
            leaderboardUserClone.transform.GetChild(0).GetComponent<TMP_Text>().text = user.username;
            leaderboardUserClone.transform.GetChild(1).GetComponent<TMP_Text>().text = user.stage;
            leaderboardUserClone.transform.GetChild(2).GetComponent<TMP_Text>().text = user.time;
            leaderboardUserClone.transform.SetParent(this.transform);
            leaderboardUserClone.transform.localPosition = position;
            position += new Vector3(0, -128, 0);
        }
    }
}
