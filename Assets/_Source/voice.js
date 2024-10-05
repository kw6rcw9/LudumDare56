var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript;
    console.log('working')
    // Send the transcript to Unity
    SendMessage('YourGameObject', 'YourMethod', transcript);
};

function startRecognition() {
    recognition.start();
}