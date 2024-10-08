using System;
using _Source.Settings;
using Core.PlayerController;
using Core.TimerSystem;
using UnityEngine;

namespace Core
{
    public class Bootstrapper : MonoBehaviour
    {
        [SerializeField] private Player player;
        [SerializeField] private PauseManager pauseManager;
        [SerializeField] private LanguageManager languageManager;
        [SerializeField] private LevelManager levelManager;
        [SerializeField] private Timer timer;
        [SerializeField] private AudioSource audioSourceSFX;
        [SerializeField] private MoveInput moveInput;
        private Movement _movement;
        private void Start()
        {
            if (player != null)
            {
                _movement = new Movement(player, timer, audioSourceSFX);
                moveInput.Construct(_movement);
            }
        }

        private void OnDisable()
        {
            Debug.Log("Botstrapper: Dispose all.");
            _movement?.Dispose();
            pauseManager?.Dispose();
            languageManager?.Dispose();
            levelManager?.Dispose();
        }
    }
}
