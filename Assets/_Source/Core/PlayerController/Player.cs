using Core.MapSystem.Data;
using UnityEngine;

namespace Core.PlayerController
{
   public class Player : MonoBehaviour
   {
      [field: SerializeField] public float Speed { get; set; }
      [field: SerializeField] public float DestinationToMoveHor { get; set; }
      [field: SerializeField] public float DestinationToMoveVer { get; set; }
      [field: SerializeField] public TieInfo CurrentTile { get; set; }
      [field: SerializeField] public Animator Animator { get; set; }
      [field: SerializeField] public Sprite LeftSprite { get; set; }
      [field: SerializeField] public Sprite UpSprite { get; set; }
      
    
      
      
   }
}
