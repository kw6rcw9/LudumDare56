using System;
using _Source.Settings;
using Core.MapSystem;
using Core.PlayerController;
using Core.TimerSystem;
using UnityEngine;

namespace Core
{
    public class Bootstrapper : MonoBehaviour
    {
        [SerializeField] private Player player;
        [SerializeField] private Timer timer;
        [SerializeField] private AudioSource audioSourceSFX;
        [SerializeField] private MoveInput moveInput;

        [SerializeField] private PathGenerator pathGenerator;
        private Movement _movement;
        public static Action DisposeAction;

        private void Awake()

        {
            if (player != null)
            {
                _movement = new Movement(player, timer, audioSourceSFX);
                 moveInput.Construct(_movement);
                pathGenerator.Construct(_movement);
            }
        }

        private void OnDisable()
        {
            DisposeAction?.Invoke();
            Debug.Log("Botstrapper: Dispose all.");
            _movement?.Dispose();
        }
    }
}
