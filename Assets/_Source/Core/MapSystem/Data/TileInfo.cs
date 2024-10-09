using System;
using System.Collections;
using System.Collections.Generic;
using Core.PlayerController;
using Unity.VisualScripting;
using UnityEngine;
using Timer = Core.TimerSystem.Timer;

namespace Core.MapSystem.Data
{
    public class TieInfo : MonoBehaviour
    {
        [field: SerializeField] public bool IsNeeded { get; set; }
        [field: SerializeField] public int NumInRow { get; set; } = -1;
        [SerializeField] private Sprite loseColor;
        [SerializeField] private Sprite rightColor;
        [SerializeField] private Sprite firstTile;
        [SerializeField] private AudioSource audioSource;
        [SerializeField] private AudioClip correctSFX;
        [SerializeField] private AudioClip incorrectSFX;
        [SerializeField] private AudioClip winSFX;
        [SerializeField] private AudioClip electricShockSFX;
        [field: SerializeField] public Animator Animator { get; private set; }
        [field: SerializeField] public Animator CurrAnimator { get; private set; }
        private bool _errorMove;
        public static Action LoseAction;
        public static Action WinAction;

        private void Start()
        {
            if (!TryGetComponent(out Rigidbody rb))
            {
                Debug.Log("MAMAAAAAAA");
                CurrAnimator.Play("LightGreen1");
                //transform.GetComponent<SpriteRenderer>().sprite = firstTile;
            }
        }

        private void OnTriggerEnter(Collider other)
        {
            if (Animator == null)
            {
                Animator = other.GetComponent<Animator>();
            }
            if (_errorMove)
            {
                
            }
            else if (!IsNeeded )
            {
                
                Debug.Log("Here???");
                StartCoroutine( Lose());
            }
            else if(IsNeeded && PathGenerator.CorrectPath.Peek() == transform)
            {
                if (NumInRow == 0)
                {
                    Movement.EnableLeftMovement = false;
                }
                else if (NumInRow == PathGenerator.YBoardSize - 1)
                {
                    Movement.EnableRightMovement = false;
                }
               
                else
                {
                    Movement.EnableLeftMovement = true; 
                    Movement.EnableRightMovement = true;  
                }
                audioSource.clip = correctSFX;
                audioSource.Play();
                PathGenerator.CorrectPath.Dequeue();
                CurrAnimator.Play("LightGreen1");
                //transform.GetComponent<SpriteRenderer>().sprite = rightColor;
                if (!PathGenerator.CorrectPath.TryPeek(out Transform res))
                    StartCoroutine( Win());

            }
            else if(IsNeeded && PathGenerator.CorrectPath.Peek() != transform )
            { 
                Debug.Log(IsNeeded);
                Debug.Log(PathGenerator.CorrectPath.Peek());
                Debug.Log("Here?");
                StartCoroutine( Lose());
            }
            
            
        }

        private void OnTriggerExit(Collider other)
        {
            _errorMove = true;
        }

        IEnumerator Lose()
        {
            Debug.Log("Why lose");
            Timer.IsRunnning = false;
            Movement.EnableMovement = false;
            yield return new WaitForSeconds(1);
            audioSource.clip = incorrectSFX;
            audioSource.Play();
            CurrAnimator.Play("LightRed1");
            //transform.GetComponent<SpriteRenderer>().sprite = loseColor;
            Debug.Log("Lose");
            yield return new WaitForSeconds(1);
            audioSource.clip = electricShockSFX;
            audioSource.Play();
            Animator.Play("Electic Shock");
            yield return new WaitForSeconds(3);
            LoseAction?.Invoke();
        }

        IEnumerator Win()
        {
            Timer.IsRunnning = false;
            Movement.EnableMovement = false;
            yield return new WaitForSeconds(1);
            audioSource.clip = winSFX;
            audioSource.Play();
            Debug.Log("Win");
            //yield return new WaitForSeconds(3);
            WinAction?.Invoke();
        }
    }
}
