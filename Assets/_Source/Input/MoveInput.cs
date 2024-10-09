using System;
using System.Collections;
using System.Collections.Generic;
using Core.PlayerController;
using TMPro;
using UnityEngine;
using UnityEngine.InputSystem;

public class MoveInput : MonoBehaviour
{
    private NewControls _input;
    private Movement _movement;
   
  

    public void Construct(Movement movement)
    {
        _movement = movement;
        _input = new();
        _input.Enable();
        _input.Player.Move.performed += Move;
   
    }
    

    private void OnDisable()
    {
        _input.Player.Move.performed -= Move;
        _input.Disable();
    }

    void Move(InputAction.CallbackContext context)
    {
        Debug.Log("wasd");
        var vector = context.ReadValue<Vector2>();
        if(vector.x > 0 )
            _movement.MoveRight();
        if(vector.x < 0)
            _movement.MoveLeft();
        if (vector.y > 0)
        {
            _movement.MoveUp();
        }
    }
 
    
    
    
    
    
}
