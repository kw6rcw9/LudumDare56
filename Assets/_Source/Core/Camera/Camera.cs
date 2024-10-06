using UnityEngine;

namespace Core.Camera
{
    public class Camera : MonoBehaviour
    {
        [SerializeField] Transform player;  // Ссылка на игрока
        [SerializeField] Vector3 offset;
        [SerializeField] private float delay;// Смещение камеры от игрока

        void Update()
        {
            // Устанавливаем позицию камеры с учётом смещения
            transform.position = new Vector3(transform.position.x, transform.position.y, Mathf.Clamp(player.position.z, -1.8f, delay)) + offset;
        }

    }
}
