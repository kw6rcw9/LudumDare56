using UnityEngine;

namespace Core.PlayerController
{
   public class Player : MonoBehaviour
   {
      [field: SerializeField] public float Speed { get; set; }
      [field: SerializeField] public float DestinationToMoveHor { get; set; }
      [field: SerializeField] public float DestinationToMoveVer { get; set; }
   }
}
