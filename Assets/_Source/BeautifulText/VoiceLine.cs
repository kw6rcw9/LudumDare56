using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace _Source.BeautifulText
{
    public class VoiceLine : MonoBehaviour
    {
        public AudioClip voiceLineRu;
        public AudioClip voiceLineEn;
        public string textLineRu;
        public string textLineEn;
        public float speedLineRu = 0.05f;
        public float speedLineEn = 0.05f;
        public string emotions;
    }
}