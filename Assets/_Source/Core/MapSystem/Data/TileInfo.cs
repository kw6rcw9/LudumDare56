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
            transform.GetComponent<SpriteRenderer>().sprite = loseColor;
            Debug.Log("Lose");
            LoseAction?.Invoke();
        }

        void Win()
        {
            Debug.Log("Win");
            WinAction?.Invoke();
        }
    }
}
