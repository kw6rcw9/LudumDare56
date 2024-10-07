using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Core.TimerSystem
{
    public class Timer : MonoBehaviour
    {
        [SerializeField] private Animator animator;
        [SerializeField]
        private int startTime;
        [SerializeField] private int timeLeft;
        [SerializeField] private int actionsAfterSeconds;
        private bool isRunnning = true;
        private bool _runActionsCoroutine;

        
        public void SetTimer()
        {
            StartCoroutine(StartTimer());
        }

        public void StopTimer()
        {
            StopAllCoroutines();
        }
        
        void Start()
        {
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
           animator.Play("Electic Shock");
        }

        public void Action()
        {
            animator.Play("Idle");
        }

        public IEnumerator StartTimer()
        {
                var actionDelay = 0;
            while (timeLeft > 0)
            {
                timeLeft -= 1;
                actionDelay++;
                if (actionDelay >= 3)
                {
                    actionDelay = 0;
                    Action();
                }
                yield return new WaitForSeconds(1);
                
            }
            
            
                TimerEnded();
            
            
        }

    }
}
