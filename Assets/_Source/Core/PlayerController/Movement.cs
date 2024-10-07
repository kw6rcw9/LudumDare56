using _Source.Voice;
using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

namespace Core.PlayerController
{
    public class Movement
    {
        private Player _player;

        [SerializeField] private AudioSource AudioSource;
        [SerializeField] private AudioClip MoveSound;

        public Movement(Player player)
        {
            _player = player;
            Direction.movementAction += Move;
        }

        void Move(int dir)
        {
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
            //_player.transform.Translate(new Vector3(-_player.DestinationToMoveHor,0,0));
            _player.transform.DOMove(new Vector3(-_player.DestinationToMoveHor+_player.transform.position.x,_player.transform.position.y,_player.transform.position.z), _player.Speed);
        }

        public void MoveRight()
        {
            //_player.transform.Translate(new Vector3(_player.DestinationToMoveHor,0,0));
            _player.transform.DOMove(new Vector3(_player.DestinationToMoveHor+_player.transform.position.x, _player.transform.position.y, _player.transform.position.z), _player.Speed);

        }

        public void MoveUp()
        {
            //_player.transform.Translate(new Vector3(0,0,_player.DestinationToMoveVer));
            _player.transform.DOMove(new Vector3(_player.transform.position.x, _player.transform.position.y, _player.DestinationToMoveVer+_player.transform.position.z), _player.Speed);

        }

        public void Dispose()
        {
            Direction.movementAction -= Move;
        }
        
    }
}
