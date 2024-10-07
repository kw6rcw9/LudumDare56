using System;
using Core.PlayerController;
using UnityEngine;

namespace Core
{
    public class Bootstrapper : MonoBehaviour
    {
        [SerializeField] private Player player;
        private Movement _movement;
        private void Start()
        {
            _movement = new Movement(player);
            
        }

        private void OnDisable()
        {
            _movement.Dispose();
        }
    }
}
