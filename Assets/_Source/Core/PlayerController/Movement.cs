using _Source.Voice;
using UnityEngine;
using UnityEngine.UI;

namespace Core.PlayerController
{
    public class Movement
    {
        private Player _player;
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
            _player.transform.Translate(new Vector3(0,0,-_player.DestinationToMoveHor) * Time.deltaTime * _player.Speed);
        }

        public void MoveRight()
        {
            _player.transform.Translate(new Vector3(0,0,_player.DestinationToMoveHor) * Time.deltaTime * _player.Speed);

        }

        public void MoveUp()
        {
            _player.transform.Translate(new Vector3(0,0,_player.DestinationToMoveVer) * Time.deltaTime * _player.Speed);

        }

        public void Dispose()
        {
            Direction.movementAction -= Move;
        }
        
    }
}
