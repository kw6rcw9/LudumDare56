using System;

namespace UnityWebGLSpeechDetection
{
    [AttributeUsage(AttributeTargets.Method, Inherited = false)]
    public class SpeechDetectionAttribute : Attribute
    {
        private string _mSpokenPhrase = null;
        private string[] _mAliasPhrases = null;

        public SpeechDetectionAttribute(string spokenPhrase)
        {
            _mSpokenPhrase = spokenPhrase;
        }

        public SpeechDetectionAttribute(string spokenPhrase, string[] aliasPhrases)
        {
            _mSpokenPhrase = spokenPhrase;
            _mAliasPhrases = aliasPhrases;
        }

        public string GetSpokenPhrase()
        {
            return _mSpokenPhrase;
        }

        public string[] GetPhraseAliases()
        {
            return _mAliasPhrases;
        }
    }
}
