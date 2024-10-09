using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Core.MapSystem.Data;
using Core.PlayerController;
using UnityEditor;
using Random = System.Random;

namespace Core.MapSystem
{
    public class PathGeneratorArcade : MonoBehaviour

    {
        [SerializeField] private float firstRoundDelay;
        [SerializeField] private float roundDelay;
        [SerializeField] private float pathLightingDelay;
        [SerializeField] private float pathEndDelay;
        [SerializeField] private Vector2 boardSize;
        [SerializeField] private List<Transform> tiles;
        [SerializeField] private Sprite pathFinder;
        [SerializeField] private Sprite defaultCol;
        [SerializeField] private GameObject row;
        [SerializeField] private GameObject tile;
        [SerializeField] private GameObject player;
        public static Action StartTimerAction;
        private Movement _movement;
        private Queue<Transform> _tilesQueue;
        private Queue<Transform> _lightedPath;
        private List<Transform> _fullPath;
        public static Queue<Transform> CorrectPath;
        public static int YBoardSize;

        private void InitializeTiles()
        {
            tiles = new List<Transform> {};
            // tiles = Convert.ToInt32(boardSize.x * boardSize.y);
            
            Debug.Log(tiles.Capacity);
            
            row.transform.localPosition += new Vector3(Convert.ToInt32(boardSize.x) / 2 * - 1.5f,0,0);
            
            for (int i = 1; i < boardSize.x; i++)
            {
                GameObject newTile = Instantiate(tile);
                newTile.transform.SetParent(row.transform);
                if (i == boardSize.x / 2)
                {
                    Destroy(newTile.GetComponent<Rigidbody>());
                    newTile.GetComponent<TieInfo>().IsNeeded = true;
                    newTile.GetComponent<TieInfo>().NumInRow = 0;
                }
                newTile.transform.localPosition = tile.transform.localPosition + new Vector3(1.5f*i,0,0);
                newTile.transform.localRotation = tile.transform.localRotation;
                
            }
            
            for (int i = 1; i < boardSize.y; i++)
            {
                GameObject newRow = Instantiate(row);
                newRow.transform.SetParent(row.transform.parent);
                newRow.transform.localPosition = row.transform.localPosition + new Vector3(0,1.5f*i,0);
                newRow.transform.localRotation = row.transform.localRotation;
            }
            
            for (int i = 0; i < boardSize.x; i++)
            {
                for (int j = 0; j < boardSize.y; j++)
                {
                    tiles.Add(row.transform.parent.GetChild(j+1).GetChild(i));
                }
            }
        }

        private IEnumerator Start()
        {
            YBoardSize = (int)boardSize.y;
            CorrectPath = new Queue<Transform>();
            _tilesQueue = new Queue<Transform>();
            _lightedPath = new Queue<Transform>();
            _fullPath = new List<Transform>();
            InitializeTiles();
            int i = -1;
            foreach (var tile in tiles)
            {
                i++;
                if (i == boardSize.y)
                    i = 0;
                tile.GetComponent<TieInfo>().NumInRow = i;
                _tilesQueue.Enqueue(tile);
            }

            if (!PlayerPrefs.HasKey("StartMessage"))
            {
                roundDelay = firstRoundDelay;
            }


            yield return new WaitForSeconds(roundDelay);
            RandomGeneration();
            StartCoroutine(LightTheWay());
            StartCoroutine(ShowOffTheWay());
            Debug.Log("Correct tiles: " + CorrectPath.Count);
            Debug.Log(CorrectPath.Peek());
        }

        public void Construct(Movement movement)
        {
            _movement = movement;
        }

        public IEnumerator LightTheWay()
        {
            //Debug.Log(_lightedPath.Count + "TILES");
            var amount = _lightedPath.Count;
            for (int i = 0; i < amount; i++)
            {
                yield return new WaitForSeconds(pathLightingDelay);
                var tile = _lightedPath.Dequeue();
                tile.GetComponent<SpriteRenderer>().sprite = pathFinder;
                _fullPath.Add(tile);
            }
        }

        public IEnumerator ShowOffTheWay()
        {
            yield return new WaitForSeconds(pathEndDelay);
            foreach (var tile in _fullPath)
            {
                tile.GetComponent<SpriteRenderer>().sprite = defaultCol;
            }

            Movement.EnableMovement = true;
            StartTimerAction?.Invoke();
        }

        private Transform[,] GenerateEmptyMatrix()
        {
            Transform[,] matrix = new Transform[(int)boardSize.x, (int)boardSize.y];
            for (int i = 0; i < matrix.GetLength(0); i++)
            {
                for (int j = 0; j < matrix.GetLength(1); j++)
                {
                    matrix[i, j] = _tilesQueue.Dequeue();
                    //Debug.Log(matrix[i,j]);
                }
            }

            return matrix;
        }

        private void DebugMatrix(Transform[,] matrix)
        {
            for (int i = 0; i < matrix.GetLength(0); i++)
            {
              string a = "";
              for (int j = 0; j < matrix.GetLength(1); j++)
              {
                a += matrix[i, j].ToString() + " ";
            
              }
              Debug.Log(a);
            }
        }
        
        public Transform[,] RandomGeneration()
        {
            int[] size = { (int)boardSize.x, (int)boardSize.y };
            Transform[,] matrix = GenerateEmptyMatrix();
            // DebugMatrix(matrix);

            matrix = GeneratePath(matrix, size);
            // DebugMatrix(matrix);
            return matrix;
        }

        public Transform[,] GeneratePath(Transform[,] matrix, int[] size)
        {
            int i = 0; // начальная строка
            int k = size[1] / 2; // начальная колонка (центральная)

            // Помечаем начальную позицию
            matrix[i, k].GetComponent<SpriteRenderer>().sprite = pathFinder;
            _fullPath.Add(matrix[i, k]);
            matrix[i, k].GetComponent<TieInfo>().IsNeeded = true;

            Random random = new Random();
            int previousDirection = -1; // Направление последнего движения (-1 - нет движения)
            bool canTurnRight = true;
            bool canTurnLeft = true; // Переменная для отслеживания, можем ли повернуть

            int repeat = 0;
            while (i < size[0] - 1) // пока не достигнем нижней стенки
            {
                // Проверяем возможности движения
                //bool moved = false;
                int rand = random.Next(3); // 0 - влево, 1 - вправо, 2 - вверх
                Debug.Log(rand);
                // Предотвращаем повторное движение в том же направлении

                var a = -1;
                if (repeat > 2)
                {
                    Debug.Log("fuuuuuuck");
                    do
                    {
                        a = random.Next(3);
                    } while (a == rand);

                    repeat = 0;

                    rand = a;
                }
                else if (previousDirection != -1 && (rand == previousDirection))
                {
                    //Debug.Log("Повтор");
                    // Если последнее движение было влево или вправо, не можем повторять
                    // do
                    // {
                    //   a = random.Next(3);
                    //
                    // } while (a == rand);
                    //
                    //
                    //
                    // rand = a; // Устанавливаем движение вверх
                    repeat++;
                }

                //Debug.Log("Н");
                // Если перемещение возможно
                Transform currentTile = null;
                switch (rand)
                {
                    // Влево
                    case 0:
                        if (k > 0 && !matrix[i, k - 1].GetComponent<TieInfo>().IsNeeded &&
                            canTurnLeft) // проверка на границы и барьеры
                        {
                            currentTile = matrix[i, k - 1];
                            currentTile.GetComponent<TieInfo>().IsNeeded = true;
                            _lightedPath.Enqueue(currentTile);
                            CorrectPath.Enqueue(currentTile);

                            //matrix[i, k - 1].GetComponent<SpriteRenderer>().color = pathFinder; // помечаем ячейку
                            k -= 1;
                            previousDirection = 0; // Запоминаем направление
                            //moved = true;
                            canTurnRight = false; // Запрещаем поворот
                        }

                        break;

                    // Вправо
                    case 1:
                        if (k < size[1] - 1 && !matrix[i, k + 1].GetComponent<TieInfo>().IsNeeded &&
                            canTurnRight) // проверка на границы и барьеры
                        {
                            currentTile = matrix[i, k + 1];
                            currentTile.GetComponent<TieInfo>().IsNeeded = true;
                            _lightedPath.Enqueue(currentTile);
                            CorrectPath.Enqueue(currentTile);

                            //matrix[i, k + 1].GetComponent<SpriteRenderer>().color = pathFinder; // помечаем ячейку
                            k += 1;
                            previousDirection = 1; // Запоминаем направление
                            //moved = true;
                            canTurnLeft = false; // Запрещаем поворот
                        }

                        break;

                    // Вверх
                    case 2:
                        if (i < size[0] - 1 &&
                            !matrix[i + 1, k].GetComponent<TieInfo>().IsNeeded) // проверка на границы и барьеры
                        {
                            currentTile = matrix[i + 1, k];
                            currentTile.GetComponent<TieInfo>().IsNeeded = true;
                            _lightedPath.Enqueue(currentTile);
                            CorrectPath.Enqueue(currentTile);

                            //matrix[i + 1, k].GetComponent<SpriteRenderer>().color = pathFinder; // помечаем ячейку
                            i += 1;
                            previousDirection = 2; // Запоминаем направление
                            //moved = true;
                            canTurnLeft = true;
                            canTurnRight = true; // Позволяем поворот после движения вверх
                            // Позволяем поворот после движения вверх
                        }

                        break;
                }
                // Если не перемещаемся, поднимаемся вверх
                // if (!moved && i < size[0] - 1)
                // {
                //   matrix[i + 1, k] = 2; // помечаем ячейку
                //   i += 1;
                //   canTurnLeftRight = true; // Позволяем поворот после движения вверх
                // }
            }

            return matrix;
        }
    }
}