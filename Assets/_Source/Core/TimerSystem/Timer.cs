using System;
using System.Collections;
using System.Collections.Generic;
using Core.MapSystem;
using Core.MapSystem.Data;
using Core.PlayerController;
using Unity.VisualScripting;
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
        public static bool IsRunnning;
        private bool _isRunningForUpdate;
        private bool _runActionsCoroutine;
        private bool electricIsRunning = false;

        
        public void SetTimer()
        {
            
            StartCoroutine(StartTimer());
        }

        public void StopTimer()
        {
            audioSource.Stop();
            StopAllCoroutines();
        }
        
       

        void StartRoundAction()
        {
            _isRunningForUpdate = true;
        }

        private void OnEnable()
        {
            _isRunningForUpdate = false;
            PathGenerator.StartTimerAction += StartRoundAction;
            TieInfo.LoseAction += StopTimer;
        }

        private void OnDisable()
        {
            TieInfo.LoseAction -= StopTimer;
            PathGenerator.StartTimerAction -= StartRoundAction;
        
        }

        void Update()
        {
            if (_isRunningForUpdate)
            {
               StartCoroutine(StartTimer());
               _isRunningForUpdate = false;
            }
           
           
        }

        void UpdateTimerText()
        {
            //timerText.text = Mathf.Round(timeLeft).ToString();
        }

        IEnumerator TimerEnded()
        {
            
            _isRunningForUpdate = false;
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
            //if(!Movement.LastMoveUpDir)
                animator.Play("Idle Breath");
        }

        public IEnumerator StartTimer()
        {
            timeLeft = startTime;
            //IsRunnning = true;
                var actionDelay = 0;
            while (timeLeft > 0)
            {
              
                timeLeft -= 1;
                actionDelay++;
                if (actionDelay >= 6)
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
