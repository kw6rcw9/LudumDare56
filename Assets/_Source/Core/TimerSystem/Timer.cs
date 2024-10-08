using System;
using System.Collections;
using System.Collections.Generic;
using Core.MapSystem;
using Core.PlayerController;
using UnityEngine;

namespace Core.TimerSystem
{
    public class Timer : MonoBehaviour
    {
        [SerializeField] private float delayBetweenLose;
        [SerializeField] private Animator animator;
        [SerializeField]
        private int startTime;
        [SerializeField] private int timeLeft;
        [SerializeField] private int actionsAfterSeconds;
        [SerializeField] private AudioSource audioSource;
        [SerializeField] private AudioClip electricUpSFX;
        [SerializeField] private AudioClip electricShockSFX;
        public static Action LoseAction;
        private bool isRunnning;
        private bool _runActionsCoroutine;
        private bool electricIsRunning = false;

        
        public void SetTimer()
        {
            StartCoroutine(StartTimer());
        }

        public void StopTimer()
        {
            StopAllCoroutines();
        }

       

        void StartRoundAction()
        {
            isRunnning = true;
        }

        private void OnEnable()
        {
            isRunnning = false;
            PathGenerator.StartTimerAction += StartRoundAction;
        }

        void Update()
        {
            if (isRunnning)
            {
               StartCoroutine(StartTimer());
               isRunnning = false;
            }
           
           
        }

        void UpdateTimerText()
        {
            //timerText.text = Mathf.Round(timeLeft).ToString();
        }

        IEnumerator TimerEnded()
        {
            
            isRunnning = false;
            Movement.EnableMovement = false;
            Debug.Log("Таймер закончился!");
            audioSource.Stop();
            audioSource.clip = electricShockSFX;
            audioSource.Play();
            animator.Play("Electic Shock");
            yield return new WaitForSeconds(delayBetweenLose);
            LoseAction?.Invoke();

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
                if(!electricIsRunning && timeLeft >= 10){
                    electricIsRunning = true;
                    audioSource.clip = electricUpSFX;
                    audioSource.Play();
                }

                yield return new WaitForSeconds(1);
                
            }
            
            
                StartCoroutine(TimerEnded());
            
            
        }

    }
}
