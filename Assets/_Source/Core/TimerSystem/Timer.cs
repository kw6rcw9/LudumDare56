using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Core.TimerSystem
{
    public class Timer : MonoBehaviour
    {
        [SerializeField] private float timeLeft;
        [SerializeField] private float actionsAfterSeconds;
        private bool isRunnning = true;
        private bool _runActionsCoroutine;

        public void SetTimer()
        {
            isRunnning = true;
        }
        
        void Start()
        {
            UpdateTimerText();
            StartCoroutine(StartTimer());
        }

        void Update()
        {
            // if (isRunnning)
            // {
            //     if (timeLeft > 0)
            //     {
            //         timeLeft -= Time.deltaTime;
            //         if (!_runActionsCoroutine)
            //         {
            //             _runActionsCoroutine = false;
            //         }
            //         //UpdateTimerText();
            //         
            //     }
            //     else
            //     {
            //         timeLeft = 0;
            //         TimerEnded();
            //     }
            //     
            // }
        }

        void UpdateTimerText()
        {
            //timerText.text = Mathf.Round(timeLeft).ToString();
        }

        void TimerEnded()
        {
            isRunnning = false;
            Debug.Log("Таймер закончился!");
            // Здесь можно добавить дополнительные действия по окончании таймера
        }

        public void Action()
        {
            
        }

        public IEnumerator StartTimer()
        {
            while (timeLeft > 0)
            {
                timeLeft -= 1;
                yield return new WaitForSeconds(1);
                
            }
            
                TimerEnded();
            
            
        }

    }
}
