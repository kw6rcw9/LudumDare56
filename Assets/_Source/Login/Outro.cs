using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Outro : MonoBehaviour
{
    public TMP_Text textOutro;
    IEnumerator Start()
    {
        if (PlayerPrefs.GetInt("Lang") == 1)
        {
            textOutro.text =
                "Эксперимент завершён. Несмотря на успешное следование командам, мыши постепенно изолировались, и популяция перестала расти. Подавление инстинктов привело к вымиранию, несмотря на изобилие ресурсов. Система оказалась замкнутой: за каждым успешным маршрутом скрывался новый — бесконечный цикл. Вопрос остаётся: сможем ли Мы когда-нибудь противостоять своим инстинктам?";
        }

        yield return new WaitForSeconds(25);
        SceneManager.LoadScene("Main Menu");
    }
}
