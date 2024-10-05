﻿using System;

namespace UnityWebGLSpeechSynthesis
{
    [Serializable]
    public class Voice
    {
        public bool _default = false; //underscore because default is reserved word
        public string lang = string.Empty;
        public string localService = string.Empty;
        public string name = string.Empty;
        public string voiceURI = string.Empty;
        public string display = string.Empty;
    }
}
