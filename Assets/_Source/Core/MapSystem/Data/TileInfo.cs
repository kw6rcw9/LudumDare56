using System;
using UnityEngine;

namespace Core.MapSystem.Data
{
    public class TieInfo : MonoBehaviour
    {
        [field: SerializeField] public bool IsNeeded { get; set; }

        private void OnTriggerEnter(Collider other)
        {
            if (!IsNeeded)
            {
                Lose();
            }
            
        }

        void Lose()
        {
            Debug.Log("Lose");
        }
    }
}
