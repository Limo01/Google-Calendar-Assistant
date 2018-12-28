/*-----------------------------
 Voice Recognition 
 ------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = false;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function (event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
        interpret(noteContent);
    }
};


recognition.onspeechend = function () {
    if (!instructions.valueOf() == 'Voice recognition turned off.')
        instructions.text('You were quiet for a while so voice recognition turned itself off.');
};

recognition.onerror = function (event) {
    if (event.error == 'no-speech')
        instructions.text('No speech was detected. Try again.');
};

/*
 @param String line
 */
function interpret(line) {
    if (line.toLowerCase()=== "prossimi eventi")
    {
        listUpcomingEvents();
    } 
    else if (line.toLowerCase().indexOf("aggiungi") === 0 || line.toLowerCase().indexOf("inserisci") === 0)
    {
        var dati = parseEvent(line);

        if (dati !== undefined && calendari[document.getElementById("selectCalendar").value].accessRole!=="reader")
        {
            addEventToCalendar(dati.data, dati.ora, dati.summary);
        }
        else if(calendari[document.getElementById("selectCalendar").value].accessRole==="reader")
        {
            window.avatar.say("Non hai i permessi di scrittura sul calendario selezionato!");
        }
        else
        {
            window.avatar.say("Ci sono errori di sintassi nel comando!");
        }
    }
    else if (line.toLowerCase()==="opzioni" || line.toLowerCase()==="comandi")
    {
        var footer= document.getElementById("footer");
        if(footer.attributes.class.nodeValue==="show")
        {
            window.avatar.say("Te li sto già mostrando");
            document.getElementById("infoButton").onclick();
            setTimeout(document.getElementById("infoButton").onclick, 200);
        }
        else
        {
            document.getElementById("infoButton").onclick();
            window.avatar.say("Eccoli!");
        }  
    }
    else if(line.toLowerCase()==="che giorno è oggi")
    {
        noteTextarea.val('"Che giorno è oggi?');
        var data= new Date();
        var giorni= ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
        window.avatar.say("Oggi è "+giorni[data.getDay()-1]+" "+data.getDate()+" "+mesi[data.getMonth()]);
    }
    else
    {
        window.avatar.say("Il comando non esiste!"); 
    }
}

function parseEvent(s)
{
    var sElement = s.split(" ");
    var indiceOre = sElement.indexOf("ore");
    
    if(indiceOre !== -1)
    {
        var summary = undefined;
        if (indiceOre > 1 && indiceOre !== sElement.length - 1)
        {
            summary = sElement[1];
            for (var i = 2; i < indiceOre; i++)
            {
                summary += " " + sElement[i];
            }
        }

        var ora = sElement[indiceOre + 1];

        var data = undefined;

        if (indiceOre + 4 === sElement.length - 1)
        {
            var dataAttuale = new Date();
            var mese = mesi.indexOf(sElement[indiceOre + 4]);
            var giorno = sElement[indiceOre + 3];
            var anno = (mese >= dataAttuale.getMonth() && giorno >= dataAttuale.getDate()) ? dataAttuale.getFullYear() : dataAttuale.getFullYear() + 1;
            data = anno + "-" + (mese+1) + "-" + giorno;
        }

        if (summary !== undefined && ora !== undefined && data !== undefined)
        {
            return {"summary": summary, "data": data, "ora": ora};
        } 
    }
    else
    {
        var indiceIL= sElement.indexOf("il");

        if(indiceIL!== -1)
        {
            var summary = sElement[1];
            for (var i = 2; i < indiceIL; i++)
            {
                summary += " " + sElement[i];
            }
            var dataAttuale = new Date();
            var giorno= sElement[indiceIL+1];
            var mese = mesi.indexOf(sElement[indiceIL + 2]);
            var anno = (mese >= dataAttuale.getMonth() && giorno >= dataAttuale.getDate()) ? dataAttuale.getFullYear() : dataAttuale.getFullYear() + 1;
            data = anno + "-" + (mese+1) + "-" + giorno;
            
            if(summary !== undefined && data !== undefined)
            {
                return {"summary": summary, "data": data};
            }
        }
    }
    return undefined;
};