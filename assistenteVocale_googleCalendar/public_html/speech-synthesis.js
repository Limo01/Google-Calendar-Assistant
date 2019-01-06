/*-----------------------------
      Speech Synthesis
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
    
    /*
     * @brief funzione che viene chiamata quando window.speechSynthesis.speak smette di parlare
     */
    speech.onend = function(event) {
        window.avatar.smettiDiParlare();
    }
}