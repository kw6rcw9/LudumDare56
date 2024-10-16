using System;
using System.Collections.Generic;
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
        private bool isTweeing;
        public Queue<Action> Sequence;
        private Sequence seq;

        private AudioSource _audioSourceSFX;

        [SerializeField] private AudioSource AudioSource;
        [SerializeField] private AudioClip MoveSound;
        private bool _lookingLeft = true;
        
        

        private Timer _timer;
        public Movement(Player player, Timer timer, AudioSource audioSourceSFX)

        {
            
            Sequence = new Queue<Action>();
            EnableMovement = false;
            _audioSourceSFX = audioSourceSFX;
            _player = player;
            _timer = timer;
            Direction.movementAction += Move;
        }

        public void Move(int dir)
        {
            Debug.Log(Sequence.Count);
            
            if (!EnableMovement)
            {
                if(Sequence.Count > 0)
                    Sequence.Dequeue();
                return;
            }
            
            Debug.Log("Here");
            
           // _timer.StopTimer();
            switch (dir)
            {
                case 1:
                    //MoveRight();
                    Sequence.Enqueue(MoveRight);
                    break;
                case 3:
                    //MoveLeft();
                    Sequence.Enqueue(MoveLeft);
                    break;
                case 4:
                    //MoveUp();
                    Sequence.Enqueue(MoveUp);
                    break;
                    
            }

            if (Sequence.Count < 2 && Sequence.Count > 0)
            {
                Debug.Log("From move");
                var move = Sequence.Peek();
                move();
            }
            
        }
        public void MoveLeft()
        {
            if (!EnableMovement || !EnableLeftMovement)
            
            {
                if(Sequence.Count > 0)
                    Sequence.Dequeue();
                return;
            }

            if (seq == null)
            {
                seq = DOTween.Sequence();
            }
            _audioSourceSFX.Play();

            LastMoveUpDir = false;
            _timer.StopTimer();
            if(!_lookingLeft)
                _player.GetComponent<SpriteRenderer>().flipX = false;
            _lookingLeft = true;
            _player.Animator.Play("Walk Left");
            _player.GetComponent<SpriteRenderer>().sprite = _player.LeftSprite;
            Debug.Log("НАчался LEFT");
            //_player.transform.Translate(new Vector3(-_player.DestinationToMoveHor,0,0));
            
           _player.transform.DOLocalMove(new Vector3(-_player.DestinationToMoveHor+_player.transform.localPosition.x,_player.transform.localPosition.y,_player.transform.localPosition.z), _player.Speed)
                .OnComplete(SetTimer);
        }

        public void MoveRight()
        {
             
            if (!EnableMovement || !EnableRightMovement)
            {
                if(Sequence.Count > 0)
                    Sequence.Dequeue();
                return;
            }
            _audioSourceSFX.Play();
            LastMoveUpDir = false;
            _timer.StopTimer();
            if(_lookingLeft)
                _player.GetComponent<SpriteRenderer>().flipX = true;
            _lookingLeft = false;

            _player.Animator.Play("Walk Left");
            _player.GetComponent<SpriteRenderer>().sprite = _player.LeftSprite;
            Debug.Log("НАчался Right");
            //_player.transform.Translate(new Vector3(_player.DestinationToMoveHor,0,0));
            _player.transform.DOLocalMove(new Vector3(_player.DestinationToMoveHor+_player.transform.localPosition.x, _player.transform.localPosition.y, _player.transform.localPosition.z), _player.Speed)
                .OnComplete(SetTimer);

        }

        public void MoveUp()
        {
            
             
            if (!EnableMovement)
            {
                Sequence.Dequeue();
                return;
            }
            _audioSourceSFX.Play();
            LastMoveUpDir = true;
            _timer.StopTimer();
            _player.Animator.Play("Walk Up");
            _player.GetComponent<SpriteRenderer>().sprite = _player.UpSprite;
            Debug.Log("НАчался UP");
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

            Sequence.Dequeue();
            _timer.SetTimer();
            Debug.Log("SEQUENCE COUNT " + Sequence.Count);
            if (Sequence.Count > 0)
            {
                var move = Sequence.Peek();
                move();
            }
        }
        
    }
}
