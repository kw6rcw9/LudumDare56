using _Source.Voice;
using Core.TimerSystem;
using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

namespace Core.PlayerController
{
    public class Movement
    {
        private Player _player;
        private Timer _timer;
        public Movement(Player player, Timer timer)
        {
            _player = player;
            _timer = timer;
            Direction.movementAction += Move;
        }

        void Move(int dir)
        {
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
            _player.Animator.Play("Walk Left");
            //_player.transform.Translate(new Vector3(-_player.DestinationToMoveHor,0,0));
            _player.transform.DOMove(new Vector3(-_player.DestinationToMoveHor+_player.transform.position.x,_player.transform.position.y,_player.transform.position.z), _player.Speed)
                .OnComplete(SetTimer);
        }

        public void MoveRight()
        {
            _player.GetComponent<SpriteRenderer>().flipX = true;
            _player.Animator.Play("Walk Left");
            //_player.transform.Translate(new Vector3(_player.DestinationToMoveHor,0,0));
            _player.transform.DOMove(new Vector3(_player.DestinationToMoveHor+_player.transform.position.x, _player.transform.position.y, _player.transform.position.z), _player.Speed)
                .OnComplete(SetTimer);

        }

        public void MoveUp()
        {
            _player.Animator.Play("Walk Up");
            //_player.transform.Translate(new Vector3(0,0,_player.DestinationToMoveVer));
            _player.transform.DOMove(new Vector3(_player.transform.position.x, _player.transform.position.y, _player.DestinationToMoveVer+_player.transform.position.z), _player.Speed)
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
