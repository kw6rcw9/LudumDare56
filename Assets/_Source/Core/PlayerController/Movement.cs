using _Source.Voice;
using Core.TimerSystem;
using DG.Tweening;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Core.PlayerController
{
    public class Movement
    {
        private Player _player;
        public static bool EnableMovement;
        public static bool EnableRightMovement = true;
        public static bool EnableLeftMovement = true;
        public static bool LastMoveUpDir = true;


        private AudioSource _audioSourceSFX;

        [SerializeField] private AudioSource AudioSource;
        [SerializeField] private AudioClip MoveSound;
        private bool _lookingLeft = true;
        
        

        private Timer _timer;
        public Movement(Player player, Timer timer, AudioSource audioSourceSFX)

        {
            EnableMovement = false;
            _audioSourceSFX = audioSourceSFX;
            _player = player;
            _timer = timer;
            Direction.movementAction += Move;
        }

        void Move(int dir)
        {
            
            if (!EnableMovement)
            {
                return;
            }
            
            _audioSourceSFX.Play();
            _timer.StopTimer();
            switch (dir)
            {
                case 1:
                    MoveRight();
                    break;
                case 3:
                    MoveLeft();
                    break;
                case 4:
                    MoveUp();
                    break;
                    
            }
            
        }
        public void MoveLeft()
        {
             
            if (!EnableMovement || !EnableLeftMovement)
            {
                return;
            }

            LastMoveUpDir = false;
            _timer.StopTimer();
            if(!_lookingLeft)
                _player.GetComponent<SpriteRenderer>().flipX = false;
            _lookingLeft = true;
            _player.Animator.Play("Walk Left");
            //_player.transform.Translate(new Vector3(-_player.DestinationToMoveHor,0,0));
            _player.transform.DOLocalMove(new Vector3(-_player.DestinationToMoveHor+_player.transform.localPosition.x,_player.transform.localPosition.y,_player.transform.localPosition.z), _player.Speed)
                .OnComplete(SetTimer);
        }

        public void MoveRight()
        {
             
            if (!EnableMovement || !EnableRightMovement)
            {
                return;
            }
            LastMoveUpDir = false;
            _timer.StopTimer();
            if(_lookingLeft)
                _player.GetComponent<SpriteRenderer>().flipX = true;
            _lookingLeft = false;

            _player.Animator.Play("Walk Left");
            //_player.transform.Translate(new Vector3(_player.DestinationToMoveHor,0,0));
            _player.transform.DOLocalMove(new Vector3(_player.DestinationToMoveHor+_player.transform.localPosition.x, _player.transform.localPosition.y, _player.transform.localPosition.z), _player.Speed)
                .OnComplete(SetTimer);

        }

        public void MoveUp()
        {
             
            if (!EnableMovement)
            {
                return;
            }
            LastMoveUpDir = true;
            _timer.StopTimer();
            _player.Animator.Play("Walk Up");
            //_player.transform.Translate(new Vector3(0,0,_player.DestinationToMoveVer));
            _player.transform.DOLocalMove(new Vector3(_player.transform.localPosition.x,  _player.DestinationToMoveVer+_player.transform.localPosition.y, _player.transform.localPosition.z), _player.Speed)
                .OnComplete(SetTimer);

        }

        public void Dispose()
        {
            Direction.movementAction -= Move;
        }

        public void SetTimer()
        {
            _timer.SetTimer();
        }
        
    }
}
