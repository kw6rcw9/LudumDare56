using System;
using Unity.VisualScripting;
using UnityEngine;

namespace Core.MapSystem.Data
{
    public class TieInfo : MonoBehaviour
    {
        [field: SerializeField] public bool IsNeeded { get; set; }
        [SerializeField] private Sprite loseColor;
        [SerializeField] private Sprite rightColor;
        [SerializeField] private Sprite firstTile;
        [SerializeField] private AudioSource audioSource;
        [SerializeField] private AudioClip correctSFX;
        [SerializeField] private AudioClip incorrectSFX;
        [SerializeField] private AudioClip winSFX;
        
        private bool _errorMove;
        public static Action LoseAction;
        public static Action WinAction;

        private void Start()
        {
            if (!TryGetComponent(out Rigidbody rb))
            {
                Debug.Log("MAMAAAAAAA");
                transform.GetComponent<SpriteRenderer>().sprite = firstTile;
            }
        }

        private void OnTriggerEnter(Collider other)
        {
            if (_errorMove)
            {
                
            }
            else if (!IsNeeded )
            {
                Lose();
            }
            else if(IsNeeded && PathGenerator.CorrectPath.Peek() == transform)
            {
                audioSource.clip = correctSFX;
                audioSource.Play();
                PathGenerator.CorrectPath.Dequeue();
                transform.GetComponent<SpriteRenderer>().sprite = rightColor;
                if (!PathGenerator.CorrectPath.TryPeek(out Transform res))
                    Win();

            }
            else if(IsNeeded && PathGenerator.CorrectPath.Peek() != transform )
            {
                Lose();
            }
            
            
        }

        private void OnTriggerExit(Collider other)
        {
            _errorMove = true;
        }

        void Lose()
        {
            audioSource.clip = incorrectSFX;
            audioSource.Play();
            transform.GetComponent<SpriteRenderer>().sprite = loseColor;
            Debug.Log("Lose");
            LoseAction?.Invoke();
        }

        void Win()
        {
            audioSource.clip = winSFX;
            audioSource.Play();
            Debug.Log("Win");
            WinAction?.Invoke();
        }
    }
}
