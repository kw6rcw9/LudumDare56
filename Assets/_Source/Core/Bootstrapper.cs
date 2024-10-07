using System;
using _Source.Settings;
using Core.PlayerController;
using UnityEngine;

namespace Core
{
    public class Bootstrapper : MonoBehaviour
    {
        [SerializeField] private Player player;
        [SerializeField] private PauseManager pauseManager;
        [SerializeField] private LanguageManager languageManager;
        [SerializeField] private LevelManager levelManager;
        private Movement _movement;
        private void Awake()
        {
            if (player != null)
            {
                _movement = new Movement(player);
            }
        }

        private void OnDisable()
        {
            _movement?.Dispose();
            pauseManager?.Dispose();
            languageManager?.Dispose();
            levelManager?.Dispose();
        }
    }
}
