let modalitaGioco = "online";

let combinazioniCPU = [];

let partitaCPU = {
    giocatore: [],
    cpu: [],
    mazzo: [],
    scarti: [],
    turno: "giocatore",
    fase: "pesca",

    carteDaPescare: 2,
haPresoScarti: false,
cartaObbligatoria: null,
cartaObbligatoriaUsata: false
};

let mazzo = [];
let mano = [];
let carteSelezionate = [];
let cartaTrascinata = null;
let indiceCartaTrascinata = null;
let scarti = [];
let combinazioni = [];

let hoPescato = false;

let partita = {

    turno: 0,

    fase: "pesca",

    giocatori: [],

    tavolo: [],

    scarti: []

};
let combinazioneSelezionata = null;
let giocatori = [];
let giocatoreAttivo = 0;
let modalita = "singolo";
let squadra = false;


const semi = ["♠", "♣", "♥", "♦"];

const valori = [
    "A","2","3","4","5","6","7",
    "8","9","10","J","Q","K"
];

function nomeImmagineCarta(carta){

    let semiNomi = {
        "♠":"picche",
        "♣":"fiori",
        "♥":"cuori",
        "♦":"quadri"
    };


    let valoriNomi = {
        "A":"asso",
        "J":"j",
        "Q":"q",
        "K":"k"
    };


if(carta.valore === "Jolly"){

    if(carta.colore === "blu"){
        return "jolly_blu.png";
    }

    return "jolly_rosso.png";

}


    let valore =
    valoriNomi[carta.valore] || carta.valore;


    let seme =
    semiNomi[carta.seme];


    return valore + "_" + seme + ".png";

}


function pesca(){

    let mioNumero =
    mioGiocatore === "giocatore1" ? 1 : 2;
    
    if(hoPescato){
    alert("Hai già pescato in questo turno.");
    return;
}


if(partita.turno === 0){

    partita.turno = 1;

}


    if(mazzo.length === 0){

        alert("Mazzo finito!");

        return;

    }


    for(let i = 0; i < 2; i++){

        if(mazzo.length > 0){

            mano.push(mazzo.pop());

        }

    }
    hoPescato = true;


    mostraMano();


    let percorso =
    "partite/" + codicePartitaAttuale +
    "/giocatori/" + mioGiocatore +
    "/mano";


    set(
        ref(database, percorso),
        mano
    );


    set(
        ref(database, "partite/" + codicePartitaAttuale + "/mazzo"),
        mazzo
    );
    document.getElementById("contatoreMazzo").innerHTML = mazzo.length;

}

function pescaMazzo(){

    // =========================
    // PARTITA CPU
    // =========================

    if(modalitaGioco === "cpu"){

        if(partitaCPU.turno !== "giocatore"){
            alert("Aspetta, sta giocando la CPU");
            return;
        }

        if(partitaCPU.fase !== "pesca"){
            alert("Hai già pescato in questo turno.");
            return;
        }

        let numeroCarte = partitaCPU.carteDaPescare || 2;

        if(partitaCPU.mazzo.length < numeroCarte){
            alert("Mazzo finito!");
            return;
        }

        for(let i = 0; i < numeroCarte; i++){
            partitaCPU.giocatore.push(
                partitaCPU.mazzo.pop()
            );
        }

        mano = partitaCPU.giocatore;

        partitaCPU.fase = "scarto";
        partitaCPU.carteDaPescare = 2;

        carteSelezionate = [];

        mostraMano();
        mostraScarti();
        aggiornaContatoreMazzo();

        return;
    }


    // =========================
    // PARTITA ONLINE
    // =========================

    let mioNumero =
        mioGiocatore === "giocatore1" ? 1 : 2;

    if(Number(partita.turno) !== mioNumero){
        alert("Non è il tuo turno.");
        return;
    }

    if(partita.fase !== "pesca"){
        alert("Hai già pescato.");
        return;
    }

    if(mazzo.length < 2){
        alert("Mazzo finito.");
        return;
    }

    mano.push(mazzo.pop());
    mano.push(mazzo.pop());

    partita.fase = "gioco";
    hoPescato = true;

    set(
        ref(database,
        "partite/" + codicePartitaAttuale +
        "/giocatori/" + mioGiocatore + "/mano"),
        mano
    );

    set(
        ref(database,
        "partite/" + codicePartitaAttuale + "/mazzo"),
        mazzo
    );

    update(
        ref(database,
        "partite/" + codicePartitaAttuale),
        {
            fase:"gioco",
            pescaCompletata:true
        }
    );

    mostraMano();
}


function scarta(){

    console.log("🔴 SCARTA PREMUTO", {
        modalita: modalitaGioco,
        turno: partitaCPU.turno,
        fase: partitaCPU.fase,
        selezionate: carteSelezionate
    });

    // =========================
    // PARTITA CPU
    // =========================

    if(modalitaGioco === "cpu"){

        scartaCPU();

        return;
    }


    // =========================
    // PARTITA ONLINE
    // =========================

    let numeroGiocatore =
        mioGiocatore === "giocatore1" ? 1 : 2;


    if(Number(partita.turno) !== numeroGiocatore){
        alert("Non è il tuo turno.");
        return;
    }


    if(partita.fase !== "gioco"){
        alert("Prima devi pescare.");
        return;
    }


if(carteSelezionate.length !== 1){
    alert("Devi selezionare una sola carta da scartare.");
    return;
}


    let carta = carteSelezionate[0];

    let indice = mano.indexOf(carta);


    if(indice === -1){
        alert("Carta non trovata.");
        return;
    }


    mano.splice(indice, 1);

    scarti.push(carta);
    
    console.log("🃏 SCARTI PRIMA DI FIREBASE:", scarti);
    
    console.log("🃏 SCARTI PRIMA DI FIREBASE:", scarti);

    carteSelezionate = [];


    mostraMano();
    mostraScarti();


    set(
        ref(database,
        "partite/" + codicePartitaAttuale +
        "/giocatori/" + mioGiocatore + "/mano"),
        mano
    );


let nuovoTurno =
    Number(partita.turno) === 1 ? 2 : 1;

hoPescato = false;

update(
    ref(database,
    "partite/" + codicePartitaAttuale),
    {
        scarti: scarti,
        turno: nuovoTurno,
        fase: "pesca",
        pescaCompletata: false
    }
);
}

function scartaCPU(){

    if(partitaCPU.turno !== "giocatore"){

        alert("Non è il tuo turno");

        return;

    }


    if(partitaCPU.fase !== "scarto"){

        alert("Prima devi pescare");

        return;

    }
    
    /*
    Se il giocatore ha preso dagli scarti,
    deve prima utilizzare la carta obbligatoria.
*/

if(
    partitaCPU.haPresoScarti &&
    !partitaCPU.cartaObbligatoriaUsata
){

    alert(
        "Devi prima utilizzare la carta obbligatoria " +
        "presa dal monte scarti."
    );

    return;

}


    if(carteSelezionate.length === 0){

        alert("Seleziona una carta da scartare");

        return;

    }


    /*
        Per ora permettiamo di scartare
        una sola carta.
    */

    if(carteSelezionate.length > 1){

        alert("Puoi scartare una sola carta");

        return;

    }


    let carta = carteSelezionate[0];


    let indice =
        partitaCPU.giocatore.indexOf(carta);


    if(indice === -1){

        return;

    }


    /*
        Rimuove la carta dalla mano
    */

    partitaCPU.giocatore.splice(indice, 1);


    /*
        La carta va in cima al monte scarti
    */

partitaCPU.scarti.push(carta);


/*
    Deseleziona
*/

carteSelezionate = [];


mano = partitaCPU.giocatore;

/*
    ORDINE INIZIALE DELLA MANO

    Jolly e Pinelle a sinistra.
    Poi i semi raggruppati.
*/
mano.sort((a, b) => {

    // 1️⃣ Jolly sempre a sinistra
    if(a.valore === "Jolly" && b.valore !== "Jolly"){
        return -1;
    }

    if(a.valore !== "Jolly" && b.valore === "Jolly"){
        return 1;
    }

    // 2️⃣ Pinelle subito dopo i Jolly
    if(a.pinella === true && b.pinella !== true){
        return -1;
    }

    if(a.pinella !== true && b.pinella === true){
        return 1;
    }

    // 3️⃣ Raggruppamento per seme
    const semiOrdine = {
        "♠": 0,
        "♣": 1,
        "♥": 2,
        "♦": 3
    };

    let semeA = semiOrdine[a.seme] ?? 99;
    let semeB = semiOrdine[b.seme] ?? 99;

    if(semeA !== semeB){
        return semeA - semeB;
    }

    return 0;

});

partitaCPU.giocatore = mano;

mostraMano();

mostraScarti();


/*
    RESET DELLE REGOLE
    DEL TURNO PRECEDENTE
*/

partitaCPU.haPresoScarti = false;
partitaCPU.cartaObbligatoria = null;
partitaCPU.cartaObbligatoriaUsata = false;
partitaCPU.carteDaPescare = 2;


/*
    PASSA IL TURNO ALLA CPU
*/

partitaCPU.turno = "cpu";

partitaCPU.fase = "pesca";


    aggiornaTurnoCPU();


    console.log(
        "Giocatore ha scartato:",
        carta
    );


    /*
        La CPU gioca dopo una breve pausa
    */

    setTimeout(turnoCPU, 1000);

}

function aggiornaContatoreMazzo(){

    let contatore =
        document.getElementById("contatoreMazzo");

    if(contatore){

        contatore.innerHTML =
            partitaCPU.mazzo.length;

    }

}

function aggiornaNumeroCarteCPU(){

    let contatore =
        document.getElementById("numeroCarteAvversario");

    if(contatore){

        contatore.innerHTML =
            partitaCPU.cpu.length;

    }

}

function scegliScartoCPU(){

    const manoCPU = partitaCPU.cpu;

    if(manoCPU.length === 0){
        return null;
    }

    const ordine = [
        "A","3","4","5","6","7",
        "8","9","10","J","Q","K"
    ];

    /*
        ==========================================
        VALUTA QUANTO È IMPORTANTE UNA CARTA
        ==========================================
    */

    function valoreCarta(carta){

        let punteggio = 0;

        /*
            =========================
            JOLLY
            =========================
        */

        if(carta.valore === "Jolly"){
            return 1000;
        }

        /*
            =========================
            PINELLA
            =========================
        */

        if(carta.pinella === true){
            punteggio += 500;
        }


        /*
            =========================
            CARTA CHE PUÒ ENTRARE
            IN UNA SCALA
            =========================
        */

        let posizione =
            ordine.indexOf(carta.valore);


        if(posizione !== -1){

            for(let altra of manoCPU){

                if(altra === carta){
                    continue;
                }

                if(
                    altra.valore === "Jolly" ||
                    altra.pinella === true
                ){
                    continue;
                }

                if(altra.seme !== carta.seme){
                    continue;
                }

                let altraPosizione =
                    ordine.indexOf(altra.valore);

                let distanza =
                    Math.abs(
                        posizione - altraPosizione
                    );


                /*
                    Carte consecutive
                */

                if(distanza === 1){
                    punteggio += 100;
                }

                /*
                    Un buco di una carta
                */

                if(distanza === 2){
                    punteggio += 55;
                }

            }

        }


        /*
            ==========================================
            CONTROLLA SE LA CARTA PUÒ AIUTARE
            A LIBERARE UN JOLLY/PINELLA
            ==========================================
        */

        for(let combinazione of combinazioniCPU){

            if(!combinazione.carte){
                continue;
            }

            let speciali =
                combinazione.carte.filter(c =>
                    c.valore === "Jolly" ||
                    c.pinella === true
                );

            if(speciali.length === 0){
                continue;
            }


            /*
                Proviamo ad aggiungere la carta
                alla combinazione.
            */

            let prova = [
                ...combinazione.carte,
                carta
            ];

            if(combinazioneValida(prova)){

                punteggio += 180;

            }

        }


        /*
            ==========================================
            CARTA UTILE PER LA DOPPIA
            ==========================================
        */

        /*
            Se abbiamo molte carte consecutive
            dello stesso seme, diventano importanti.
        */

        if(posizione !== -1){

            let consecutive = 0;

            for(let altra of manoCPU){

                if(altra === carta){
                    continue;
                }

                if(
                    altra.seme === carta.seme &&
                    altra.valore !== "Jolly" &&
                    altra.pinella !== true
                ){

                    let altraPosizione =
                        ordine.indexOf(altra.valore);

                    if(
                        Math.abs(
                            posizione - altraPosizione
                        ) <= 2
                    ){

                        consecutive++;

                    }

                }

            }

            if(consecutive >= 2){
                punteggio += 120;
            }

        }


        /*
            ==========================================
            NON REGALARE UNA CARTA POTENZIALMENTE
            UTILE AL GIOCATORE
            ==========================================
        */

        if(
            typeof combinazioni !== "undefined" &&
            combinazioni.length > 0
        ){

            for(let combinazione of combinazioni){

                if(!combinazione.carte){
                    continue;
                }

                /*
                    Se la carta può essere aggiunta
                    a una tua scala, è pericolosa.
                */

                if(
                    puoAggiungereCarta(
                        carta,
                        combinazione
                    )
                ){

                    punteggio += 250;

                }

            }

        }


        /*
            ==========================================
            CARTA CHE COMPLETA POTENZIALMENTE
            UNA SCALA DEL GIOCATORE
            ==========================================
        */

        if(
            typeof mano !== "undefined" &&
            Array.isArray(mano)
        ){

            for(let altra of mano){

                if(altra === carta){
                    continue;
                }

                if(
                    altra.valore === "Jolly" ||
                    altra.pinella === true
                ){
                    continue;
                }

                if(
                    carta.seme !== altra.seme
                ){
                    continue;
                }

                let posizioneAltra =
                    ordine.indexOf(altra.valore);

                if(posizione === -1 || posizioneAltra === -1){
                    continue;
                }

                let distanza =
                    Math.abs(
                        posizione - posizioneAltra
                    );

                /*
                    Coppia consecutiva:
                    questa carta potrebbe essere
                    esattamente quella che manca.
                */

                if(distanza === 1){

                    punteggio += 80;

                }

                /*
                    Buco di una carta.
                */

                if(distanza === 2){

                    punteggio += 35;

                }

            }

        }


        /*
            ==========================================
            PICCOLO BONUS ALLE CARTE ALTE
            ==========================================
        */

        /*
            In assenza di utilità strategica,
            liberarsi di una carta alta può essere
            leggermente più conveniente.
        */

        if(
            carta.valore === "K" ||
            carta.valore === "Q" ||
            carta.valore === "J"
        ){

            punteggio -= 5;

        }


        return punteggio;

    }


    /*
        ==========================================
        VALUTIAMO TUTTE LE CARTE
        ==========================================
    */

    let candidati = manoCPU.map(carta => {

        return {

            carta: carta,

            punteggio:
                valoreCarta(carta)

        };

    });


    /*
        ==========================================
        ORDINE DAL PEGGIORE AL MIGLIORE
        ==========================================
    */

    candidati.sort(
        (a,b) =>
        a.punteggio - b.punteggio
    );


    console.log(
        "🤖 VALUTAZIONE STRATEGICA SCARTI:",
        candidati
    );


    /*
        ==========================================
        EVITIAMO CHE LA CPU SIA TROPPO PREVEDIBILE
        ==========================================
    */

    /*
        Prendiamo una delle carte peggiori,
        non sempre necessariamente la prima.

        Questo rende il comportamento
        meno meccanico.
    */

    let numeroScelte =
        Math.min(3, candidati.length);


    let scelta =
        candidati[
            Math.floor(
                Math.random() * numeroScelte
            )
        ];


    console.log(
        "🤖 CPU ha scelto di scartare:",
        scelta.carta,
        "punteggio:",
        scelta.punteggio
    );


    return scelta.carta;

}

function decidiPresaScartiCPU(){

    /*
        ==========================================
        DECISIONE CPU: MONTE SCARTI
        ==========================================

        La CPU valuta ogni possibile punto
        di presa.

        Esempio:

        5♠ → 6♠ → 9♥ → Q♦

        Prendere indice 0 significa prendere tutto.
        Prendere indice 1 significa prendere:

        6♠ → 9♥ → Q♦

        Prendere indice 2 significa prendere:

        9♥ → Q♦
    */


    let scartiCPU = partitaCPU.scarti;
    let manoCPU = partitaCPU.cpu;


    if(!scartiCPU || scartiCPU.length === 0){

        return null;

    }


    let migliori = [];


    /*
        ==========================================
        VALUTA OGNI POSSIBILE PRESA
        ==========================================
    */

    for(let indice = 0; indice < scartiCPU.length; indice++){

        let cartaObbligatoria =
            scartiCPU[indice];


        /*
            La carta obbligatoria deve poter essere
            utilizzata.

            Controlliamo se può:

            1. entrare in una scala già presente
            2. creare una nuova scala
        */

        let puoUsarla = false;


        /*
            --------------------------------------
            1. SCALA GIÀ SUL TAVOLO
            --------------------------------------
        */

        for(let combinazione of combinazioniCPU){

            if(combinazione.tipo !== "scala"){
                continue;
            }


            /*
                Creiamo temporaneamente la combinazione
                con la carta obbligatoria.

                La CPU può aggiungerla soltanto se
                la carta è realmente compatibile.
            */

            if(
                cartaObbligatoria.valore !== "Jolly" &&
                cartaObbligatoria.pinella !== true
            ){

                let ordine = [
                    "A","3","4","5","6","7",
                    "8","9","10","J","Q","K"
                ];


                let posizione =
                    ordine.indexOf(
                        cartaObbligatoria.valore
                    );


                if(posizione !== -1){

                    let normali =
                        combinazione.carte.filter(c =>
                            c.valore !== "Jolly" &&
                            c.pinella !== true
                        );


                    if(normali.length > 0){

                        let stessoSeme =
                            normali[0].seme ===
                            cartaObbligatoria.seme;


                        if(stessoSeme){

                            for(let carta of normali){

                                let posizioneCarta =
                                    ordine.indexOf(
                                        carta.valore
                                    );


                                let prima =
                                    (posizioneCarta - 1 + 12) % 12;

                                let dopo =
                                    (posizioneCarta + 1) % 12;


                                if(
                                    posizione === prima ||
                                    posizione === dopo
                                ){

                                    puoUsarla = true;

                                    break;

                                }

                            }

                        }

                    }

                }

            }

            if(puoUsarla){
                break;
            }

        }


        /*
            --------------------------------------
            2. NUOVA SCALA
            --------------------------------------
        */

        if(!puoUsarla){

            let manoTemporanea = [
                ...manoCPU,
                cartaObbligatoria
            ];


            /*
                Cerchiamo almeno una scala valida
                che contenga obbligatoriamente
                la carta presa.
            */

            let speciali =
                manoTemporanea.filter(c =>
                    c.valore === "Jolly" ||
                    c.pinella === true
                );


            let normali =
                manoTemporanea.filter(c =>
                    c.valore !== "Jolly" &&
                    c.pinella !== true
                );


            let ordine = [
                "A","3","4","5","6","7",
                "8","9","10","J","Q","K"
            ];


            /*
                Proviamo tutte le combinazioni
                possibili di almeno 3 carte.

                Per non appesantire troppo la CPU,
                controlliamo soprattutto le carte
                dello stesso seme della carta obbligatoria.
            */

            if(
                cartaObbligatoria.valore !== "Jolly" &&
                cartaObbligatoria.pinella !== true
            ){

                let stessoSeme =
                    normali.filter(c =>
                        c.seme === cartaObbligatoria.seme
                    );


                /*
                    Proviamo combinazioni fino a 8 carte.
                */

                for(
                    let lunghezza = 3;
                    lunghezza <= Math.min(8, stessoSeme.length + speciali.length);
                    lunghezza++
                ){

                    /*
                        Ricerca ricorsiva.
                    */

                    function cercaScala(
                        indiceCarta,
                        scelte
                    ){

                        if(scelte.length === lunghezza){

                            /*
                                La carta obbligatoria
                                deve essere presente.
                            */

                            let contiene =
                                scelte.some(c =>
                                    stessaCarta(
                                        c,
                                        cartaObbligatoria
                                    )
                                );


                            if(
                                contiene &&
                                combinazioneValida(scelte)
                            ){

                                return true;

                            }

                            return false;

                        }


                        for(
                            let i = indiceCarta;
                            i < stessoSeme.length;
                            i++
                        ){

                            /*
                                Evitiamo duplicati
                            */

                            if(
                                scelte.includes(
                                    stessoSeme[i]
                                )
                            ){
                                continue;
                            }


                            scelte.push(
                                stessoSeme[i]
                            );


                            if(
                                cercaScala(
                                    i + 1,
                                    scelte
                                )
                            ){

                                return true;

                            }


                            scelte.pop();

                        }


                        /*
                            Proviamo anche gli speciali.
                        */

                        if(
                            scelte.length < lunghezza
                        ){

                            for(let speciale of speciali){

                                if(
                                    scelte.includes(
                                        speciale
                                    )
                                ){
                                    continue;
                                }


                                scelte.push(
                                    speciale
                                );


                                if(
                                    cercaScala(
                                        indiceCarta,
                                        scelte
                                    )
                                ){

                                    return true;

                                }


                                scelte.pop();

                            }

                        }


                        return false;

                    }


                    if(
                        cercaScala(
                            0,
                            []
                        )
                    ){

                        puoUsarla = true;

                        break;

                    }

                }

            }

        }


        /*
            Se la carta obbligatoria non può essere
            utilizzata, questa presa è vietata.
        */

        if(!puoUsarla){

            continue;

        }


        /*
            ==========================================
            CALCOLO DEL PUNTEGGIO
            ==========================================
        */

        let cartePrese =
            scartiCPU.slice(indice);


        let punteggio = 0;


        /*
            Carta obbligatoria utile
        */

        punteggio += 50;


        /*
            Più carte utili nella presa,
            maggiore è il punteggio.
        */

        for(let carta of cartePrese){

            /*
                JOLLY
            */

            if(carta.valore === "Jolly"){

                punteggio += 80;

            }


            /*
                PINELLA
            */

            else if(carta.pinella === true){

                punteggio += 50;

            }


            /*
                Carta normale:
                controlliamo se ha vicini
                nella mano.
            */

            else{

                let ordine = [
                    "A","3","4","5","6","7",
                    "8","9","10","J","Q","K"
                ];


                let posizione =
                    ordine.indexOf(
                        carta.valore
                    );


                let vicine = manoCPU.filter(altra => {

                    if(
                        altra.valore === "Jolly" ||
                        altra.pinella === true
                    ){
                        return false;
                    }


                    if(altra.seme !== carta.seme){
                        return false;
                    }


                    let posizioneAltra =
                        ordine.indexOf(
                            altra.valore
                        );


                    let distanza =
                        Math.abs(
                            posizione -
                            posizioneAltra
                        );


                    return distanza === 1 ||
                           distanza === 2;

                });


                punteggio +=
                    vicine.length * 20;

            }

        }


        /*
            ==========================================
            PENALITÀ PER CARTE INUTILI
            ==========================================
        */

        /*
            Prendere moltissime carte può essere
            controproducente.
        */

        if(cartePrese.length >= 5){

            punteggio -=
                (cartePrese.length - 4) * 8;

        }


        /*
            ==========================================
            BONUS PER DOPPIA
            ==========================================
        */

        let manoConPresa = [
            ...manoCPU,
            ...cartePrese
        ];


        /*
            Se la presa aumenta il potenziale
            di una Doppia, bonus.
        */

        if(
            manoConPresa.some(c =>
                c.valore !== "Jolly" &&
                c.pinella !== true
            )
        ){

            /*
                Controlliamo semplicemente se
                esistono almeno 6 carte consecutive
                dello stesso seme.
            */

            for(let seme of semi){

                let carteSeme =
                    manoConPresa
                    .filter(c =>
                        c.seme === seme &&
                        c.valore !== "Jolly" &&
                        c.pinella !== true
                    );


                if(
                    carteSeme.length >= 6 &&
                    eDoppia(carteSeme)
                ){

                    punteggio += 100;

                    break;

                }

            }

        }


        /*
            Salviamo la valutazione.
        */

        migliori.push({

            indice: indice,

            cartaObbligatoria:
                cartaObbligatoria,

            carte: cartePrese,

            punteggio: punteggio

        });

    }


    /*
        ==========================================
        NESSUNA PRESA VALIDA
        ==========================================
    */

    if(migliori.length === 0){

        console.log(
            "🤖 CPU: nessuna presa utile dagli scarti."
        );

        return null;

    }


    /*
        Ordina dalla migliore alla peggiore.
    */

    migliori.sort(
        (a,b) =>
        b.punteggio -
        a.punteggio
    );


    console.log(
        "🤖 Valutazione monte scarti:",
        migliori
    );


    /*
        ==========================================
        SOGLIA MINIMA
        ==========================================

        La CPU non prende automaticamente
        solo perché può.

        Deve esserci una convenienza reale.
    */

    let migliore =
        migliori[0];


    if(migliore.punteggio < 55){

        console.log(
            "🤖 CPU decide di NON prendere gli scarti."
        );

        return null;

    }


    console.log(
        "🤖 CPU decide di prendere dagli scarti:",
        migliore
    );


    return migliore;

}

function turnoCPU(){

    console.log("🤖 Turno CPU");

    /*
        1. LA CPU DECIDE COME PESCARE
    */

    let decisioneScarti =
        decidiPresaScartiCPU();


    /*
        SE PRENDE DAGLI SCARTI
    */

    if(decisioneScarti !== null){

        let indice =
            decisioneScarti.indice;

        let cartaObbligatoria =
            partitaCPU.scarti[indice];

        let cartePrese =
            partitaCPU.scarti.splice(indice);

        partitaCPU.cpu.push(
            ...cartePrese
        );

        partitaCPU.haPresoScarti = true;

        partitaCPU.cartaObbligatoria =
            cartaObbligatoria;

        partitaCPU.cartaObbligatoriaUsata =
            false;

        console.log(
            "🤖 CPU prende dagli scarti:",
            cartePrese
        );

        console.log(
            "🔴 Carta obbligatoria:",
            cartaObbligatoria
        );

    }


    /*
        POI PESCA DAL MAZZO
    */

    let numeroCarteDaPescare =
        decisioneScarti !== null ? 1 : 2;


    for(
        let i = 0;
        i < numeroCarteDaPescare;
        i++
    ){

        if(partitaCPU.mazzo.length > 0){

            partitaCPU.cpu.push(
                partitaCPU.mazzo.pop()
            );

        }

    }


    aggiornaContatoreMazzo();
    aggiornaNumeroCarteCPU();


    /*
        2. LA CPU CERCA UN TRIS
    */

    controllaCPU();


    /*
        3. LA CPU SCARTA
    */

    if(partitaCPU.cpu.length > 0){

let carta = scegliScartoCPU();

let indice = partitaCPU.cpu.indexOf(carta);

if(indice !== -1){

    partitaCPU.cpu.splice(indice, 1);

}


        partitaCPU.scarti.push(carta);


        console.log(
            "🤖 CPU scarta:",
            carta
        );

    }


    aggiornaNumeroCarteCPU();
    mostraScarti();


    /*
        4. PASSA IL TURNO AL GIOCATORE
    */

    partitaCPU.turno = "giocatore";
    partitaCPU.fase = "pesca";

    aggiornaTurnoCPU();


    console.log(
        "🤖 CPU ha finito il turno"
    );

}

function mostraCombinazioniCPU(){

    let area =
        document.getElementById(
            "combinazioniAvversario"
        );

    if(!area){
        return;
    }

    area.innerHTML = "";


    combinazioniCPU.forEach(gruppo => {

        let div =
            document.createElement("div");

        div.className =
            "combinazione";


        gruppo.carte.forEach(carta => {

            let c =
                document.createElement("div");

            c.className =
                "carta-mano carta-calata";


            /*
                COLORE DEL SEME
            */

            let colore =
                carta.seme === "♥" ||
                carta.seme === "♦"
                ? "rosso"
                : "nero";


            /*
                JOLLY
            */

            if(carta.valore === "Jolly"){

                c.innerHTML = `
                    <div class="cartaValore jolly">
                        JOLLY
                    </div>

                    <div class="cartaSeme jolly">
                        🃏
                    </div>
                `;

            }


            /*
                CARTA NORMALE
            */

            else{

                c.innerHTML = `
                    <div class="cartaAngolo cartaAlto ${colore}">
                        <div>${carta.valore}</div>
                        <div>${carta.seme}</div>
                    </div>

                    <div class="cartaSemeCentro ${colore}">
                        ${carta.seme}
                    </div>

                    <div class="cartaAngolo cartaBasso ${colore}">
                        <div>${carta.valore}</div>
                        <div>${carta.seme}</div>
                    </div>
                `;

            }


            div.appendChild(c);

        });


        area.appendChild(div);

    });

}


function trovaScalaCPU(){

    const manoCPU = partitaCPU.cpu;

    const ordine = [
        "A","3","4","5","6","7",
        "8","9","10","J","Q","K"
    ];

    const speciali = manoCPU.filter(c =>
        c.valore === "Jolly" ||
        c.pinella === true
    );

    const candidati = [];

    /*
        Proviamo ogni seme
    */

    for(let seme of semi){

        const normali = manoCPU.filter(c =>
            c.seme === seme &&
            c.valore !== "Jolly" &&
            c.pinella !== true
        );

        /*
            Proviamo ogni punto di partenza
            e ogni possibile lunghezza.

            3 = minimo
            12 = massimo teorico dei valori
        */

        for(let partenza = 0; partenza < ordine.length; partenza++){

            for(
                let lunghezza = 3;
                lunghezza <= Math.min(12, normali.length + speciali.length);
                lunghezza++
            ){

                let posizioni = [];

                let carteNormali = [];

                let mancanti = [];

                let utilizzate = new Set();

                /*
                    Costruiamo la sequenza teorica
                */

                for(let i = 0; i < lunghezza; i++){

                    const posizione =
                        (partenza + i) % ordine.length;

                    const valore = ordine[posizione];

                    posizioni.push(valore);

                    /*
                        Cerchiamo la carta normale
                        corrispondente.
                    */

                    const carta = normali.find(c =>
                        c.valore === valore &&
                        !utilizzate.has(c)
                    );

                    if(carta){

                        carteNormali.push(carta);
                        utilizzate.add(carta);

                    }else{

                        mancanti.push(i);

                    }

                }

                /*
                    Non possiamo coprire i buchi
                    se non abbiamo abbastanza speciali.
                */

                if(mancanti.length > speciali.length){
                    continue;
                }

                /*
                    Funzione ricorsiva:
                    prova tutte le possibili disposizioni
                    degli speciali nei buchi.
                */

                function inserisciSpeciali(
                    indice,
                    risultato,
                    specialiDisponibili
                ){

                    /*
                        Abbiamo riempito tutti i buchi.
                    */

                    if(indice >= mancanti.length){

                        const candidato = [];

                        let indiceNormale = 0;
                        let indiceSpeciale = 0;

                        for(let i = 0; i < lunghezza; i++){

                            if(mancanti.includes(i)){

                                candidato.push(
                                    risultato[indiceSpeciale]
                                );

                                indiceSpeciale++;

                            }else{

                                candidato.push(
                                    carteNormali[indiceNormale]
                                );

                                indiceNormale++;

                            }

                        }

                        /*
                            IL GIUDICE È SEMPRE
                            combinazioneValida()
                        */

                        if(combinazioneValida(candidato)){

                            candidati.push(candidato);

                        }

                        return;
                    }

                    /*
                        Proviamo ogni speciale disponibile
                        in questa posizione.
                    */

                    for(
                        let i = 0;
                        i < specialiDisponibili.length;
                        i++
                    ){

                        const speciale =
                            specialiDisponibili[i];

                        const nuoviSpeciali =
                            specialiDisponibili.filter(
                                (_, index) => index !== i
                            );

                        inserisciSpeciali(
                            indice + 1,
                            [
                                ...risultato,
                                speciale
                            ],
                            nuoviSpeciali
                        );

                    }

                }

                inserisciSpeciali(
                    0,
                    [],
                    speciali
                );

            }

        }

    }

    /*
        Nessuna scala valida trovata.
    */

    if(candidati.length === 0){
        return null;
    }

    /*
        Per ora la CPU può scegliere liberamente
        una qualsiasi delle scale legali.
    */

    const scelta =
        candidati[
            Math.floor(Math.random() * candidati.length)
        ];

    return {

        tipo: "scala",

        carte: scelta

    };

}

function controllaCPU(){

    console.log("🤖 CPU controlla la mano");

    let combinazioneTrovata = true;

    while(combinazioneTrovata){

        combinazioneTrovata = false;

        /*
            CERCA SOLO SCALE

            I TRIS NON ESISTONO PIÙ.
        */

        let scala = trovaScalaCPU();

        if(scala !== null){

            combinazioniCPU.push(scala);

            scala.carte.forEach(carta => {

                let indice =
                    partitaCPU.cpu.indexOf(carta);

                if(indice !== -1){

                    partitaCPU.cpu.splice(indice,1);

                }

            });

            aggiornaNumeroCarteCPU();
            mostraCombinazioniCPU();

            console.log(
                "🤖 CPU ha calato una scala:",
                scala.carte
            );

            combinazioneTrovata = true;

        }

    }

    console.log(
        "🤖 CPU ha finito di cercare scale"
    );

}

function aggiornaTurnoCPU(){

    let mio = document.getElementById("turnoMio");
    let cpu = document.getElementById("turnoCPU");


    if(partitaCPU.turno === "giocatore"){

        mio.style.display = "flex";
        cpu.style.display = "none";

    }else{

        mio.style.display = "none";
        cpu.style.display = "flex";

    }

}



function mostraScarti(){

    let area = document.getElementById("scarti");

    area.innerHTML = "";


    let listaScarti = modalitaGioco === "cpu"
        ? partitaCPU.scarti
        : scarti;


    listaScarti.forEach((carta, indice) => {

        let div = document.createElement("div");

        div.className = "carta-mano carta-scarto";


        /*
            =========================
            COLORE
            =========================
        */

        let colore =
            (carta.seme === "♥" || carta.seme === "♦")
            ? "rosso"
            : "nero";


        /*
            =========================
            CONTENUTO CARTA
            UGUALE ALLA MANO
            =========================
        */

        if(carta.valore === "Jolly"){

            div.innerHTML = `
                <div class="cartaValore jolly">
                    JOLLY
                </div>

                <div class="cartaSeme jolly">
                    🃏
                </div>
            `;

        }else{

            div.innerHTML = `
                <div class="cartaAngolo cartaAlto ${colore}">
                    <div>${carta.valore}</div>
                    <div>${carta.seme}</div>
                </div>

                <div class="cartaSemeCentro ${colore}">
                    ${carta.seme}
                </div>

                <div class="cartaAngolo cartaBasso ${colore}">
                    <div>${carta.valore}</div>
                    <div>${carta.seme}</div>
                </div>
            `;

        }


        /*
            =========================
            CLIC SUL MONTE SCARTI
            =========================
        */

        div.onclick = function(event){

            event.stopPropagation();


            if(modalitaGioco !== "cpu"){
                return;
            }


            prendiDalMazzoScarti(indice);

        };


        area.appendChild(div);

    });


/*
    =========================
    MONTE SCARTI
    SOVRAPPOSIZIONE FISSA
    =========================
*/

let carteScarto =
    document.querySelectorAll("#scarti .carta-scarto");

carteScarto.forEach((carta, indice) => {

    carta.style.flexShrink = "0";
    carta.style.marginLeft = "0px";
    carta.style.position = "relative";
    carta.style.zIndex = indice + 1;

});

}

function stessaCarta(a, b){

    if(!a || !b){
        return false;
    }

    return (
        a.valore === b.valore &&
        a.seme === b.seme &&
        a.colore === b.colore &&
        a.pinella === b.pinella
    );

}


function puoUtilizzareCartaObbligatoria(carta){

    if(!carta){
        return false;
    }


    // =====================================
    // 1. PUÒ ESSERE AGGIUNTA A UNA SCALA?
    // =====================================

    for(let combinazione of combinazioni){

        if(combinazione.tipo !== "scala"){
            continue;
        }

        if(puoAggiungereCarta(carta, combinazione)){
            return true;
        }

    }


    // =====================================
    // 2. PUÒ FORMARE UNA NUOVA SCALA
    //    CON LE CARTE IN MANO?
    // =====================================

    let altreCarte = partitaCPU.giocatore.filter(c =>
        c !== carta
    );


    /*
        Generiamo tutte le possibili combinazioni
        contenenti la carta obbligatoria.

        Una scala deve avere almeno 3 carte.
    */

    function cerca(indice, scelte){

        if(scelte.length >= 2){

            let combinazione = [
                carta,
                ...scelte
            ];

            if(combinazioneValida(combinazione)){
                return true;
            }

        }


        if(scelte.length >= 12){
            return false;
        }


        for(let i = indice; i < altreCarte.length; i++){

            scelte.push(altreCarte[i]);

            if(cerca(i + 1, scelte)){
                return true;
            }

            scelte.pop();

        }

        return false;

    }


    return cerca(0, []);

}

function prendiDalMazzoScarti(indice){

    if(modalitaGioco !== "cpu"){
        return;
    }


    if(partitaCPU.turno !== "giocatore"){

        alert("Non è il tuo turno");

        return;

    }


    if(partitaCPU.fase !== "pesca"){

        alert("Hai già pescato");

        return;

    }


    if(partitaCPU.scarti.length === 0){

        alert("Non ci sono scarti");

        return;

    }


    /*
        La carta scelta è la carta più vecchia
        tra quelle che verranno raccolte.

        Esempio:

        3♠ → 4♥ → Q♦

        indice 0 = prende tutte
        indice 1 = prende 4♥ + Q♦
        indice 2 = prende solo Q♦
    */

    let cartaObbligatoria =
        partitaCPU.scarti[indice];


    /*
        ==========================================
        CONTROLLO PREVENTIVO
        ==========================================

        Prima di prendere gli scarti controlliamo
        se la carta obbligatoria può essere
        effettivamente utilizzata.

        Se non può essere utilizzata:
        NON PRENDIAMO NESSUNA CARTA.
    */

    if(!puoUtilizzareCartaObbligatoria(cartaObbligatoria)){

        alert(
            "Non puoi prendere questi scarti: " +
            "la prima carta che prenderesti " +
            "non può essere utilizzata in nessuna scala valida."
        );

        return;

    }


    /*
        ==========================================
        PRENDIAMO GLI SCARTI
        ==========================================
    */

    let cartePrese =
        partitaCPU.scarti.splice(indice);


    /*
        Aggiunge le carte alla mano
    */

    partitaCPU.giocatore.push(...cartePrese);


    /*
        ==========================================
        MEMORIZZA LA CARTA OBBLIGATORIA
        ==========================================
    */

    partitaCPU.haPresoScarti = true;

    partitaCPU.cartaObbligatoria =
        cartaObbligatoria;

    partitaCPU.cartaObbligatoriaUsata = false;


    /*
        Dopo aver preso dagli scarti
        deve ancora pescare UNA carta
        dal mazzo.
    */

    partitaCPU.carteDaPescare = 1;


    /*
        IMPORTANTISSIMO:

        Rimaniamo nella fase "pesca".

        Quindi:

        SCARTI → CALA

        viene automaticamente bloccato.

        Prima deve fare:

        SCARTI → PESCA DAL MAZZO
    */

    partitaCPU.fase = "pesca";


    mano = partitaCPU.giocatore;


    mostraMano();

    mostraScarti();


    console.log(
        "🗑️ Carte prese dagli scarti:",
        cartePrese
    );

    console.log(
        "🔴 Carta obbligatoria:",
        cartaObbligatoria
    );

}

function generaCodice(){

    let lettere = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let codice = "";

    for(let i = 0; i < 6; i++){

        codice += lettere[
            Math.floor(Math.random()*lettere.length)
        ];

    }

    return codice;

}

function cambiaTurno(){

    giocatoreAttivo++;

    if(giocatoreAttivo >= giocatori.length){

        giocatoreAttivo = 0;

    }

    console.log(
        "Turno di:",
        giocatori[giocatoreAttivo].nome
    );

}

function creaMazzo(){

    mazzo = [];


    for(let partita = 0; partita < 2; partita++){
      let coloreJolly = partita === 0 ? "rosso" : "blu";


        for(let seme of semi){


for(let valore of valori){

    // niente 2 di cuori e 2 di quadri
    if(valore === "2" && (seme === "♥" || seme === "♦")){
        continue;
    }


    mazzo.push({

        valore: valore,

        seme: seme,

        pinella:
        valore === "2" && (seme === "♠" || seme === "♣")

    });

}

        }


// Jolly

mazzo.push({

    valore:"Jolly",

    seme:"⭐",

colore: coloreJolly

});


mazzo.push({

    valore:"Jolly",

    seme:"⭐",

colore: coloreJolly

});


    }





console.log("Totale carte:", mazzo.length);

console.log(
    "Jolly creati:",
    mazzo.filter(c => c.valore === "Jolly")
);
    mescola();

}

function mescola(){

    mazzo.sort(()=>Math.random()-0.5);

}



function distribuisci(){

    mano = [];

    for(let i=0;i<15;i++){

        mano.push(mazzo.pop());

    }

    mostraMano();

}


function distribuisciGiocatori(){

    for(let giocatore of giocatori){

        giocatore.mano = [];

        for(let i = 0; i < 15; i++){

            giocatore.mano.push(mazzo.pop());

        }

    }

}

function ordinaManoIniziale(){

    const ordineSemi = {
        "♠": 0,
        "♣": 1,
        "♥": 2,
        "♦": 3
    };

    const ordineValori = {
        "A": 0,
        "3": 1,
        "4": 2,
        "5": 3,
        "6": 4,
        "7": 5,
        "8": 6,
        "9": 7,
        "10": 8,
        "J": 9,
        "Q": 10,
        "K": 11
    };

    mano.sort((a, b) => {

        // Jolly per primi
        if(a.valore === "Jolly" && b.valore !== "Jolly"){
            return -1;
        }

        if(a.valore !== "Jolly" && b.valore === "Jolly"){
            return 1;
        }

        // Jolly con Jolly
        if(a.valore === "Jolly" && b.valore === "Jolly"){
            return 0;
        }

        // Pinelle dopo i Jolly
        if(a.pinella === true && b.pinella !== true){
            return -1;
        }

        if(a.pinella !== true && b.pinella === true){
            return 1;
        }

        // Pinella con Pinella
        if(a.pinella === true && b.pinella === true){
            return 0;
        }

        // Prima il seme
        let semeA = ordineSemi[a.seme];
        let semeB = ordineSemi[b.seme];

        if(semeA !== semeB){
            return semeA - semeB;
        }

        // Poi il valore
        return ordineValori[a.valore] - ordineValori[b.valore];

    });

}



function mostraMano(){

    let area = document.getElementById("mano");

    area.innerHTML = "";

    area.style.position = "relative";

    /*
        =========================
        INDICATORE
        =========================
    */

    let indicatore = document.createElement("div");

    indicatore.id = "indicatoreInserimento";

    indicatore.style.position = "absolute";
    indicatore.style.width = "4px";
    indicatore.style.height = "115px";
    indicatore.style.background = "#00ff88";
    indicatore.style.borderRadius = "5px";
    indicatore.style.boxShadow =
        "0 0 8px #00ff88, 0 0 18px #00ff88";

    indicatore.style.display = "none";
    indicatore.style.zIndex = "10000";
    indicatore.style.pointerEvents = "none";

    area.appendChild(indicatore);


    /*
        =========================
        CREA LE CARTE
        =========================
    */

    mano.forEach((carta, indice) => {

        let div = document.createElement("div");

        div.className = "carta-mano";

        /*
            COLORE
        */

        let colore =
            carta.seme === "♥" ||
            carta.seme === "♦"
            ? "rosso"
            : "nero";


        /*
            CONTENUTO
        */

        if(carta.valore === "Jolly"){

            div.innerHTML = `
                <div class="cartaValore jolly">
                    JOLLY
                </div>

                <div class="cartaSeme jolly">
                    🃏
                </div>
            `;

        }else{

            div.innerHTML = `
                <div class="cartaAngolo cartaAlto ${colore}">
                    <div>${carta.valore}</div>
                    <div>${carta.seme}</div>
                </div>

                <div class="cartaSemeCentro ${colore}">
                    ${carta.seme}
                </div>

                <div class="cartaAngolo cartaBasso ${colore}">
                    <div>${carta.valore}</div>
                    <div>${carta.seme}</div>
                </div>
            `;

        }


        /*
            =========================
            SELEZIONE
            =========================
        */

        div.onclick = function(){

            if(div.dataset.trascinata === "true"){

                div.dataset.trascinata = "false";

                return;

            }

            let posizione =
                carteSelezionate.indexOf(carta);


            if(posizione === -1){

                carteSelezionate.push(carta);

                div.classList.add("selezionata");

                div.style.zIndex = "9999";

                div.style.transform =
                    "translateY(-85px)";

            }else{

                carteSelezionate.splice(
                    posizione,
                    1
                );

                div.classList.remove(
                    "selezionata"
                );

                div.style.transform =
                    "translateY(0px)";

                document
                    .querySelectorAll(
                        "#mano .carta-mano"
                    )
                    .forEach((c, i) => {

                        c.style.zIndex = i + 1;

                    });

            }

        };


        /*
            =========================
            TRASCINAMENTO
            =========================
        */

        div.style.touchAction = "none";

        div.dataset.trascinata = "false";


        let trascinamento = false;

        let posizioneInizialeX = 0;

        let posizioneCorrente = indice;


        /*
            =========================
            POINTER DOWN
            =========================
        */

        div.addEventListener(
            "pointerdown",
            function(event){

                cartaTrascinata = carta;

                indiceCartaTrascinata = indice;

                posizioneCorrente = indice;

                posizioneInizialeX =
                    event.clientX;

                trascinamento = false;

                div.setPointerCapture(
                    event.pointerId
                );

            }
        );


        /*
            =========================
            POINTER MOVE
            =========================
        */

        div.addEventListener(
            "pointermove",
            function(event){

                if(cartaTrascinata !== carta){
                    return;
                }


                let distanza =
                    Math.abs(
                        event.clientX -
                        posizioneInizialeX
                    );


                if(distanza < 10){
                    return;
                }


                trascinamento = true;

                div.dataset.trascinata = "true";


                /*
                    SOLLEVA LA CARTA
                */

                div.style.zIndex = "9999";

                div.style.transform =
                    "translateY(-30px) scale(1.05)";


                /*
                    =========================
                    TROVIAMO LE CARTE
                    =========================
                */

                let carteDOM =
                    Array.from(
                        document.querySelectorAll(
                            "#mano .carta-mano"
                        )
                    );


                /*
                    Rimuoviamo la carta
                    trascinata
                */

                let altreCarte =
                    carteDOM.filter(
                        c => c !== div
                    );


                /*
                    Nessun'altra carta
                */

                if(altreCarte.length === 0){

                    posizioneCorrente = 0;

                    indicatore.style.display =
                        "none";

                    return;

                }


                /*
                    =========================
                    CENTRI DELLE CARTE
                    =========================
                */

                let centri = altreCarte.map(c => {

                    let rect =
                        c.getBoundingClientRect();

                    return {
                        x: rect.left + rect.width / 2,
                        left: rect.left,
                        right: rect.right
                    };

                });


                /*
                    =========================
                    CERCA LA CARTA PIÙ VICINA
                    =========================
                */

                let slot = altreCarte.length;

                let posizioneIndicatore = null;


                /*
                    PRIMA DELLA PRIMA
                */

                if(event.clientX < centri[0].x){

                    slot = 0;

                    posizioneIndicatore =
                        centri[0].left;

                }else{

                    /*
                        CONTROLLIAMO OGNI CENTRO
                    */

                    for(let i = 0; i < centri.length; i++){

                        if(
                            event.clientX <
                            centri[i].x
                        ){

                            slot = i;

                            posizioneIndicatore =
                                centri[i].left;

                            break;

                        }

                    }


                    /*
                        DOPO L'ULTIMA
                    */

                    if(posizioneIndicatore === null){

                        slot = altreCarte.length;

                        posizioneIndicatore =
                            centri[
                                centri.length - 1
                            ].right;

                    }

                }


                /*
                    =========================
                    INDICATORE
                    =========================
                */

                let areaRect =
                    area.getBoundingClientRect();


                indicatore.style.left =
                    (
                        posizioneIndicatore -
                        areaRect.left -
                        2
                    ) + "px";


                indicatore.style.top =
                    "0px";


                indicatore.style.display =
                    "block";


                /*
                    =========================
                    POSIZIONE ARRAY
                    =========================
                */

                posizioneCorrente = slot;

            }
        );


        /*
            =========================
            RILASCIO
            =========================
        */

        div.addEventListener(
            "pointerup",
            function(event){

                if(!trascinamento){

                    cartaTrascinata = null;

                    indiceCartaTrascinata = null;

                    return;

                }


                /*
                    NASCONDE INDICATORE
                */

                indicatore.style.display =
                    "none";


                /*
                    =========================
                    RIMUOVE LA CARTA
                    =========================
                */

                let cartaSpostata =
                    mano.splice(
                        indiceCartaTrascinata,
                        1
                    )[0];


                /*
                    CORREGGIAMO L'INDICE
                    SE LA CARTA ERA PRIMA
                    DELLO SLOT
                */

let nuovoIndice =
    posizioneCorrente;


                /*
                    LIMITI
                */

                nuovoIndice =
                    Math.max(
                        0,
                        Math.min(
                            nuovoIndice,
                            mano.length
                        )
                    );


                /*
                    INSERISCE
                */

                mano.splice(
                    nuovoIndice,
                    0,
                    cartaSpostata
                );


                /*
                    =========================
                    RESET
                    =========================
                */

                cartaTrascinata = null;

                indiceCartaTrascinata = null;

                trascinamento = false;

                posizioneCorrente = nuovoIndice;


                /*
                    =========================
                    RIDISEGNA
                    =========================
                */

                mostraMano();

            }
        );


        /*
            =========================
            AGGIUNGE CARTA
            =========================
        */

        area.appendChild(div);

    });


    /*
        =========================
        SOVRAPPOSIZIONE
        =========================
    */

let margine = -45;

mano.forEach((carta, i) => {

    let c =
        document.querySelectorAll(
            "#mano .carta-mano"
        )[i];

    if(!c){
        return;
    }

    if(i === 0){

        c.style.marginLeft = "0px";

    }else{

        c.style.marginLeft =
            margine + "px";

    }

    c.style.flexShrink = "0";
    c.style.position = "relative";
    c.style.zIndex = i + 1;

});


    /*
        =========================
        CONTATORE MAZZO
        =========================
    */

    let contatore =
        document.getElementById(
            "contatoreMazzo"
        );


if(contatore){

    if(modalitaGioco === "cpu"){

        contatore.innerHTML =
            partitaCPU.mazzo.length;

    }else{

        contatore.innerHTML =
            mazzo.length;

    }

}

}

function mostraCarteAvversarioOnline(){

    let area =
        document.getElementById("carteAvversario");

    if(!area){
        return;
    }

    area.innerHTML = "";

    if(modalitaGioco === "cpu"){
        return;
    }

    if(!window.datiPartitaOnline){
        return;
    }

    let dati = window.datiPartitaOnline;

    if(!dati.giocatori){
        return;
    }

    let altroGiocatore =
        mioGiocatore === "giocatore1"
        ? "giocatore2"
        : "giocatore1";

    if(!dati.giocatori[altroGiocatore]){
        return;
    }

    let manoAvversario =
        dati.giocatori[altroGiocatore].mano || [];


manoAvversario.forEach((carta, indice) => {

    let img =
        document.createElement("img");

img.src =
    indice % 2 === 0
    ? "images/carte/retro_rosso.jpg"
    : "images/carte/retro_blu.jpg";

    img.className = "cartaRetro";

    area.appendChild(img);

});

}



function calaCarte(){

    console.log("🟢 CALA PREMUTO", {
        modalita: modalitaGioco,
        mioGiocatore: mioGiocatore,
        selezionate: carteSelezionate
    });


    // =========================
    // PARTITA CPU
    // =========================

    if(modalitaGioco === "cpu"){

        if(partitaCPU.turno !== "giocatore"){

            alert("Non è il tuo turno.");

            return;

        }

        if(partitaCPU.fase !== "scarto"){

            alert("Prima devi pescare dal mazzo.");

            return;

        }

    }


    // =========================
    // CARTE SELEZIONATE
    // =========================

    if(carteSelezionate.length < 3){

        alert("Seleziona almeno 3 carte.");

        return;

    }


    // =========================
    // CONTROLLA SCALA
    // =========================

    if(!combinazioneValida(carteSelezionate)){

        alert("Combinazione non valida.");

        return;

    }


    // =========================
    // CARTA OBBLIGATORIA
    // =========================

    if(
        modalitaGioco === "cpu" &&
        partitaCPU.haPresoScarti &&
        !partitaCPU.cartaObbligatoriaUsata
    ){

        let contieneObbligatoria =
            carteSelezionate.some(carta =>
                stessaCarta(
                    carta,
                    partitaCPU.cartaObbligatoria
                )
            );

        if(!contieneObbligatoria){

            alert(
                "Devi prima utilizzare la carta obbligatoria " +
                "presa dal monte scarti."
            );

            return;

        }

        partitaCPU.cartaObbligatoriaUsata = true;

    }


    // =========================
    // CREA COPIA DELLA SCALA
    // =========================

    let nuovaCombinazione = {

        tipo: "scala",

        carte: [...carteSelezionate]

    };


    // =========================
    // TOGLIE LE CARTE DALLA MANO
    // =========================

    carteSelezionate.forEach(carta => {

        let indice = mano.indexOf(carta);

        if(indice !== -1){

            mano.splice(indice, 1);

        }

    });


    // =========================
    // AGGIUNGE LA COMBINAZIONE
    // =========================

    combinazioni.push(nuovaCombinazione);


    console.log(
        "🟢 NUOVA COMBINAZIONE:",
        nuovaCombinazione
    );


    // =========================
    // PARTITA ONLINE
    // =========================

if(modalitaGioco === "online"){

    let percorsoBase =
        "partite/" +
        codicePartitaAttuale +
        "/giocatori/" +
        mioGiocatore;

    update(
        ref(database, percorsoBase),
        {
            mano: mano,
            combinazioni: combinazioni
        }
    );

}


    // =========================
    // PARTITA CPU
    // =========================

    if(modalitaGioco === "cpu"){

        partitaCPU.giocatore = mano;

    }


    // =========================
    // DESELEZIONA
    // =========================

    carteSelezionate = [];


    // =========================
    // AGGIORNA SCHERMO
    // =========================
    

    mostraMano();
    mostraCombinazioni();


    console.log(
        "🟢 CALATA COMPLETATA",
        {
            giocatore: mioGiocatore,
            combinazioni: combinazioni
        }
    );

}

function mostraCombinazioni(){

    let area = document.getElementById("mieCombinazioni");

    if(!area){
        console.log("❌ ERRORE: mieCombinazioni non trovato");
        return;
    }

    area.innerHTML = "";

    combinazioni.forEach(gruppo => {

        let div = document.createElement("div");

        div.className = "combinazione";

        div.onclick = function(){

            combinazioneSelezionata = gruppo;

            console.log("Combinazione selezionata:", gruppo);

        };


        gruppo.carte.forEach(carta => {

            let c = document.createElement("div");

            c.className = "carta-mano carta-calata";


let immagine = nomeImmagineCarta(carta);

let colore =
    (carta.seme === "♥" || carta.seme === "♦")
    ? "rosso"
    : "nero";

if(carta.valore === "Jolly"){

    c.innerHTML = `
        <div class="cartaValore jolly">
            JOLLY
        </div>

        <div class="cartaSeme jolly">
            🃏
        </div>
    `;

}else{

    c.innerHTML = `
        <div class="cartaAngolo cartaAlto ${colore}">
            <div>${carta.valore}</div>
            <div>${carta.seme}</div>
        </div>

        <div class="cartaSemeCentro ${colore}">
            ${carta.seme}
        </div>

        <div class="cartaAngolo cartaBasso ${colore}">
            <div>${carta.valore}</div>
            <div>${carta.seme}</div>
        </div>
    `;

}


            div.appendChild(c);

        });


        area.appendChild(div);

    });

}





function combinazioneValida(carte){

    // Una scala deve avere almeno 3 carte
    if(carte.length < 3){
        return false;
    }

    // Separiamo carte normali e speciali
    let normali = carte.filter(c =>
        c.valore !== "Jolly" &&
        c.pinella !== true
    );

    let speciali = carte.filter(c =>
        c.valore === "Jolly" ||
        c.pinella === true
    );

    // Servono almeno 2 carte normali
    if(normali.length < 2){
        return false;
    }

    // Tutte le carte normali devono avere lo stesso seme
    let seme = normali[0].seme;

    if(!normali.every(c => c.seme === seme)){
        return false;
    }

    // Ordine del Pinacolo
    let ordine = [
        "A","3","4","5","6","7",
        "8","9","10","J","Q","K"
    ];

    let posizioni = normali.map(c =>
        ordine.indexOf(c.valore)
    );

    // Nessuna carta normale sconosciuta
    if(posizioni.includes(-1)){
        return false;
    }

    // Non possiamo avere due volte la stessa carta normale
    if(new Set(posizioni).size !== posizioni.length){
        return false;
    }

    /*
        Cerchiamo una sequenza valida della stessa
        lunghezza della combinazione.

        La sequenza può attraversare:

        ... Q K A 3 4 ...

        quindi l'ordine è circolare.
    */

    for(let partenza = 0; partenza < ordine.length; partenza++){

        let sequenza = [];

        for(let i = 0; i < carte.length; i++){

            sequenza.push(
                (partenza + i) % ordine.length
            );

        }

        /*
            Ogni carta normale deve occupare
            una posizione realmente presente
            nella sequenza.
        */

        let tutteValide = posizioni.every(pos =>
            sequenza.includes(pos)
        );

        if(!tutteValide){
            continue;
        }

        /*
            Le carte speciali devono occupare
            esattamente i buchi della scala.
        */

        let posizioniPresenti = new Set(posizioni);

        let buchi = sequenza.filter(pos =>
            !posizioniPresenti.has(pos)
        );

        if(buchi.length !== speciali.length){
            continue;
        }

        /*
            REGOLA DEI SPECIALI:

            Tra due speciali devono esserci almeno
            due carte normali.

            Esempio valido:

            5 6 Jolly 8 9 Pinella J Q

            Esempio non valido:

            5 Jolly Pinella 8
        */

        let posizioniSpeciali = [];

        for(let i = 0; i < sequenza.length; i++){

            if(!posizioniPresenti.has(sequenza[i])){
                posizioniSpeciali.push(i);
            }

        }

let specialiSeparati = true;

/*
    CONTROLLIAMO CHE TRA DUE SPECIALI
    CI SIANO ALMENO 2 CARTE NORMALI.

    Quindi:

    NORMALE - NORMALE - SPECIALE - NORMALE - NORMALE - SPECIALE

    è valido.

    SPECIALE - NORMALE - SPECIALE

    NON è valido.

    Controlliamo anche il collegamento
    circolare tra ultimo e primo speciale.
*/

for(let i = 1; i < posizioniSpeciali.length; i++){

    let distanza =
        posizioniSpeciali[i] -
        posizioniSpeciali[i - 1];

    if(distanza < 3){

        specialiSeparati = false;
        break;

    }

}


/*
    CONTROLLO CIRCOLARE

    Se ci sono almeno 2 speciali,
    controlliamo anche la distanza
    tra l'ultimo e il primo passando
    attraverso la fine e l'inizio
    della scala.
*/

if(
    specialiSeparati &&
    posizioniSpeciali.length >= 2
){

    let ultimo =
        posizioniSpeciali[
            posizioniSpeciali.length - 1
        ];

    let primo =
        posizioniSpeciali[0];

    let distanzaCircolare =
        (sequenza.length - ultimo) + primo;

    if(distanzaCircolare < 3){

        specialiSeparati = false;

    }

}


if(!specialiSeparati){
    continue;
}

        return true;

    }

    return false;

}






function determinaTipo(carte){

    return "scala";

}

function eDoppia(carte){

    /*
        Una DOPPIA richiede almeno
        6 CARTE NORMALI CONSECUTIVE.

        Jolly e Pinelle NON contano
        come carte normali.
    */


    if(!Array.isArray(carte)){
        return false;
    }


    if(carte.length < 6){
        return false;
    }


    let ordine = [
        "A","3","4","5","6","7",
        "8","9","10","J","Q","K"
    ];


    /*
        Cerchiamo i blocchi consecutivi
        di carte normali.

        Una carta speciale interrompe
        il conteggio.
    */

    let massimo = 0;
    let corrente = 0;

    let precedenti = null;


    for(let carta of carte){

        /*
            Jolly o Pinella:
            interrompono la Doppia.
        */

        if(
            carta.valore === "Jolly" ||
            carta.pinella === true
        ){

            corrente = 0;
            precedenti = null;

            continue;

        }


        let posizione =
            ordine.indexOf(carta.valore);


        if(posizione === -1){

            corrente = 0;
            precedenti = null;

            continue;

        }


        /*
            Prima carta del blocco
        */

        if(precedenti === null){

            corrente = 1;

        }else{

            let differenza =
                (posizione - precedenti + 12) % 12;


            if(differenza === 1){

                corrente++;

            }else{

                corrente = 1;

            }

        }


        precedenti = posizione;


        if(corrente > massimo){
            massimo = corrente;
        }

    }


    return massimo >= 6;

}

function ePinaccolo(carte){

    /*
        PINACCOLO:

        - solo carte normali
        - nessun Jolly
        - nessuna Pinella
        - scala completa da una carta
          fino alla stessa carta dopo
          aver completato tutto il giro

        Esempio:

        6 7 8 9 10 J Q K A 3 4 5 6
    */


    if(!Array.isArray(carte)){
        return false;
    }


    /*
        Un Pinaccolo contiene 13 carte.
    */

    if(carte.length !== 13){
        return false;
    }


    /*
        Nessuno speciale.
    */

    if(carte.some(carta =>
        carta.valore === "Jolly" ||
        carta.pinella === true
    )){
        return false;
    }


    const ordine = [
        "A","3","4","5","6","7",
        "8","9","10","J","Q","K"
    ];


    /*
        Tutte dello stesso seme.
    */

    let seme = carte[0].seme;


    if(!carte.every(carta =>
        carta.seme === seme
    )){
        return false;
    }


    /*
        Le prime 12 carte devono essere
        tutte diverse e consecutive.
    */

    let posizioneIniziale =
        ordine.indexOf(carte[0].valore);


    if(posizioneIniziale === -1){
        return false;
    }


    for(let i = 0; i < 12; i++){

        let posizioneAttesa =
            (posizioneIniziale + i) % 12;

        let carta =
            carte[i];


        if(
            ordine.indexOf(carta.valore)
            !== posizioneAttesa
        ){

            return false;

        }

    }


    /*
        La tredicesima carta deve essere
        UGUALE alla prima.
    */

    if(carte[12].valore !== carte[0].valore){
        return false;
    }


    return true;

}






function aggiungiAlTavolo(){


    if(carteSelezionate.length !== 1){

        alert("Seleziona una sola carta.");

        return;

    }



    if(combinazioneSelezionata === null){

        alert("Prima seleziona una combinazione.");

        return;

    }



    let carta = carteSelezionate[0];



    if(!puoAggiungereCarta(carta, combinazioneSelezionata)){


        alert("Carta non aggiungibile.");

        return;

    }
    
    /*
    Se questa è la carta obbligatoria,
    aggiungerla alla scala la considera utilizzata.
*/

if(
    modalitaGioco === "cpu" &&
    partitaCPU.haPresoScarti &&
    !partitaCPU.cartaObbligatoriaUsata &&
    stessaCarta(
        carta,
        partitaCPU.cartaObbligatoria
    )
){

    partitaCPU.cartaObbligatoriaUsata = true;

    console.log(
        "✅ Carta obbligatoria aggiunta a una scala:",
        carta
    );

}




    combinazioneSelezionata.carte.push(carta);



    let indice = mano.indexOf(carta);


    if(indice !== -1){

        mano.splice(indice,1);

    }



    carteSelezionate=[];

    combinazioneSelezionata=null;


    mostraMano();

    mostraCombinazioni();


}







function puoAggiungereCarta(carta, combinazione){


    if(combinazione.tipo === "tris"){

        return carta.valore === combinazione.carte[0].valore;

    }



    if(combinazione.tipo === "scala"){


        if(carta.valore === "Jolly" || carta.pinella === true){

            return false;

        }


        let ordine = [
            "A","3","4","5","6","7",
            "8","9","10","J","Q","K"
        ];



        let valoriScala = combinazione.carte

        .filter(c =>
            c.valore !== "Jolly" &&
            c.pinella !== true
        )

        .map(c =>
            ordine.indexOf(c.valore)
        );



        let nuovaCarta =
        ordine.indexOf(carta.valore);



        // controlla tutti i punti possibili
        for(let valore of valoriScala){


            let dopo = (valore + 1) % 12;

            let prima = (valore - 1 + 12) % 12;


            if(nuovaCarta === dopo || nuovaCarta === prima){

                return true;

            }

        }


        return false;


    }


    return false;


}









let codicePartitaAttuale = "";
let giocatore = "";
let mioGiocatore = "";

const database = window.database;
const ref = window.ref;
const set = window.set;
const onValue = window.onValue;
const update = window.update;

function creaPartita(){

    document.getElementById("menuIniziale").style.display = "none";


    // =========================
    // CREA CODICE PARTITA
    // =========================

    codicePartitaAttuale =
        Math.random()
        .toString(36)
        .substring(2,8)
        .toUpperCase();


    document.getElementById("codicePartita").innerHTML =
        "Codice partita: " + codicePartitaAttuale;

    document.getElementById("codicePartita").style.display = "block";
    document.getElementById("codicePartita").style.color = "white";
    document.getElementById("codicePartita").style.fontSize = "22px";


    // =========================
    // GIOCATORE 1
    // =========================

    giocatore = "Giocatore 1";
    mioGiocatore = "giocatore1";


    document.getElementById("listaGiocatori").innerHTML =
        "Giocatori:<br>🟢 Giocatore 1<br>⚪ In attesa...";


    // =========================
    // CREA MAZZO
    // =========================

    creaMazzo();


    // =========================
    // CREA MONTE SCARTI
    // =========================

    scarti = [];

    if(mazzo.length > 0){

        let primaCarta = mazzo.pop();

        scarti.push(primaCarta);

    }


    // =========================
    // SALVA PARTITA SU FIREBASE
    // =========================


    set(
        ref(
            database,
            "partite/" + codicePartitaAttuale
        ),
        {

            creatore: "Giocatore 1",

            stato: "attesa",

            turno: 1,

            fase: "pesca",

            mazzo: mazzo,

            scarti: scarti,

            giocatori: {

                giocatore1: {

                    nome: "Giocatore 1",

                    mano: [],

                    combinazioni: []

                }

            }

        }

    )

    .then(() => {

        mostraScarti();

        ascoltaPartita();

    })

    .catch((errore) => {

        alert("ERRORE: " + errore);

    });

}

function entraPartita(){

    console.log("🟢 ENTRA PARTITA: funzione avviata");


    let codice =
        document.getElementById("codiceIngresso").value
        .toUpperCase()
        .trim();


    console.log(
        "🔑 Codice inserito:",
        codice
    );


    if(codice === ""){

        alert("❌ Codice vuoto");

        document.getElementById("messaggioPartita").innerHTML =
            "Inserisci un codice";

        return;

    }


    /*
        SALVIAMO IL CODICE
    */

    codicePartitaAttuale = codice;

    mioGiocatore = "giocatore2";


    console.log(
        "📡 Provo a collegarmi alla partita:",
        codicePartitaAttuale
    );


    /*
        PRIMA CONTROLLIAMO SE LA PARTITA ESISTE
    */


    onValue(
        ref(
            database,
            "partite/" + codicePartitaAttuale
        ),
        function(snapshot){


            let dati = snapshot.val();


            console.log(
                "📥 DATI PARTITA RICEVUTI:",
                dati
            );


            if(!dati){

                alert(
                    "❌ Partita non trovata su Firebase"
                );

                document.getElementById(
                    "messaggioPartita"
                ).innerHTML =
                    "Partita non trovata.";

                return;

            }


            console.log(
                "✅ Partita trovata!"
            );


            /*
                AGGIUNGIAMO IL GIOCATORE 2
            */

            update(
                ref(
                    database,
                    "partite/" +
                    codicePartitaAttuale +
                    "/giocatori"
                ),
                {
                    giocatore2:{
                        nome:"Giocatore 2"
                    }
                }
            )

            .then(()=>{

                alert(
                    "🟢 7 - GIOCATORE 2 SCRITTO SU FIREBASE!"
                );


                console.log(
                    "✅ GIOCATORE 2 SCRITTO SU FIREBASE"
                );


                document.getElementById(
                    "messaggioPartita"
                ).innerHTML =
                    "Sei entrato nella partita!";


                /*
                    AGGIORNA LA LISTA LOCALE
                */

                document.getElementById(
                    "listaGiocatori"
                ).innerHTML =
                    "Giocatori:<br>" +
                    "🟢 Giocatore 1<br>" +
                    "🟢 Giocatore 2";


                /*
                    INIZIAMO AD ASCOLTARE
                    LA PARTITA
                */

                console.log(
                    "👂 Avvio ascoltaPartita()"
                );


                ascoltaPartita();


            })

            .catch((errore)=>{

                console.error(
                    "❌ ERRORE FIREBASE:",
                    errore
                );


                alert(
                    "❌ 8 - ERRORE FIREBASE: " +
                    errore.message
                );


                document.getElementById(
                    "messaggioPartita"
                ).innerHTML =
                    "Errore: " +
                    errore.message;

            });

        },
        {
            onlyOnce: true
        }
    );

}

function giocaCPU(){

    modalitaGioco = "cpu";


    document.getElementById("menuIniziale").style.display = "none";

    document.getElementById("areaGioco").style.display = "block";


    /*
        CREAZIONE MAZZO
    */

    creaMazzo();


    partitaCPU.mazzo = [...mazzo];

    partitaCPU.giocatore = [];

    partitaCPU.cpu = [];

    partitaCPU.scarti = [];

    partitaCPU.turno = "giocatore";

    partitaCPU.fase = "pesca";

    partitaCPU.carteDaPescare = 2;

    partitaCPU.haPresoScarti = false;


    /*
        DISTRIBUZIONE
        15 carte al giocatore
        15 carte alla CPU
    */

    for(let i = 0; i < 15; i++){

        partitaCPU.giocatore.push(
            partitaCPU.mazzo.pop()
        );


        partitaCPU.cpu.push(
            partitaCPU.mazzo.pop()
        );

    }


    /*
        PRIMA CARTA DEL MONTE SCARTI
    */

    if(partitaCPU.mazzo.length > 0){

        partitaCPU.scarti.push(
            partitaCPU.mazzo.pop()
        );

    }


    /*
        MOSTRA LA PARTITA
    */

mano = partitaCPU.giocatore;

ordinaManoIniziale();

partitaCPU.giocatore = mano;

mostraMano();

    mostraScarti();

    aggiornaTurnoCPU();


    console.log("PARTITA CPU INIZIATA");

    console.log("Mano giocatore:", partitaCPU.giocatore);

    console.log("Mano CPU:", partitaCPU.cpu);

    console.log("Mazzo:", partitaCPU.mazzo.length);

    console.log("Scarti:", partitaCPU.scarti);

}

function iniziaPartita(){

    document.getElementById("menuOnline").style.display = "none";
    document.getElementById("areaGioco").style.display = "flex";

    creaMazzo();

    let mano1 = [];
    let mano2 = [];

    for(let i = 0; i < 15; i++){
        mano1.push(mazzo.pop());
    }

    for(let i = 0; i < 15; i++){
        mano2.push(mazzo.pop());
    }


let datiPartita = {

    stato: "iniziata",

    turno: 1,

    fase: "pesca",

    pescaCompletata: false,

    mazzo: mazzo,

    scarti: [mazzo.pop()],

        tavolo: [],

        giocatori: {

giocatore1: {
    nome: "Giocatore 1",
    mano: mano1,
    combinazioni: []
},

giocatore2: {
    nome: "Giocatore 2",
    mano: mano2,
    combinazioni: []
}

        }

    };


set(
    ref(database, "partite/" + codicePartitaAttuale),
    datiPartita
)

    .then(()=>{

        document.getElementById("messaggioPartita").innerHTML =
        "Partita iniziata!";

    })

    .catch((errore)=>{

        alert("Errore: " + errore);

    });

}
function ascoltaPartita(){

    onValue(
        ref(database, "partite/" + codicePartitaAttuale),
        (snapshot)=>{

            let dati = snapshot.val();
            window.datiPartitaOnline = dati;
            
            alert("Firebase ricevuto. Turno: " + dati.turno);
            
console.log("STATO COMPLETO FIREBASE:", dati);
            console.log("DATI FIREBASE:", dati);
            
            if(dati.fase){

    partita.fase = dati.fase;

    console.log(
        "Fase aggiornata:",
        partita.fase
    );

}


            if(!dati){

                return;

            }



            if(dati.giocatori){

                let testo = "Giocatori:<br>";

                for(let g in dati.giocatori){

                    testo += "🟢 " + dati.giocatori[g].nome + "<br>";

                }

                document.getElementById("listaGiocatori").innerHTML = testo;

            }




if(dati.stato === "iniziata"){

    document.getElementById("menuOnline").style.display = "none";
    document.getElementById("areaGioco").style.display = "flex";

}



if(dati.turno !== undefined){

    partita.turno = Number(dati.turno);

    console.log(
        "Firebase ha dato il turno:",
        partita.turno
    );

    aggiornaIndicatoreTurno();

}


            console.log(
                "Turno aggiornato:",
                partita.turno,
                "Io sono:",
                mioGiocatore
            );




            if(
                dati.stato === "iniziata" &&
                dati.giocatori &&
                dati.giocatori[mioGiocatore] &&
                dati.giocatori[mioGiocatore].mano
            ){

                mano = dati.giocatori[mioGiocatore].mano;
                if(dati.giocatori[mioGiocatore].combinazioni){

    combinazioni =
        dati.giocatori[mioGiocatore].combinazioni;

}else{

    combinazioni = [];

}
                ordinaManoIniziale();
                mazzo = dati.mazzo;

                mostraMano();
                mostraCarteAvversarioOnline();
                let altroGiocatore =
    mioGiocatore === "giocatore1"
    ? "giocatore2"
    : "giocatore1";
    let combinazioniAvversario = [];

if(
    dati.giocatori[altroGiocatore] &&
    dati.giocatori[altroGiocatore].combinazioni
){

    combinazioniAvversario =
        dati.giocatori[altroGiocatore].combinazioni;

}

window.combinazioniAvversarioOnline =
    combinazioniAvversario;

mostraCombinazioniAvversarioOnline();

let contatore =
    document.getElementById("numeroCarteAvversario");

console.log("CONTATORE TROVATO:", contatore);
console.log("ALTRO GIOCATORE:", altroGiocatore);
console.log("MANO AVVERSARIO:", dati.giocatori[altroGiocatore]?.mano);
console.log("NUMERO CARTE AVVERSARIO:", dati.giocatori[altroGiocatore]?.mano?.length);
console.log(
    "COMBINAZIONI AVVERSARIO:",
    dati.giocatori[altroGiocatore]?.combinazioni
);
if(contatore &&
   dati.giocatori[altroGiocatore] &&
   dati.giocatori[altroGiocatore].mano){

    contatore.innerHTML =
        dati.giocatori[altroGiocatore].mano.length;

}
                if(dati.scarti){
    scarti = dati.scarti;
}else{
    scarti = [];
}

mostraScarti();
                if(dati.mazzo){

    mazzo = dati.mazzo;

    console.log("Mazzo aggiornato:", mazzo.length);

}


                console.log(
                    "Mano caricata:",
                    mioGiocatore,
                    mano
                );

            }

        }
    );

}
function aggiornaIndicatoreTurno(){

    console.log("AGGIORNO INDICATORE", mioGiocatore, partita.turno);


    let mio = document.getElementById("turnoMio");
    let avversario = document.getElementById("turnoCPU");


    if(!mio || !avversario){

        console.log("Indicatori non trovati");

        return;

    }


    let mioNumero =
    mioGiocatore === "giocatore1" ? 1 : 2;


    // nascondo entrambi prima dell'aggiornamento

    mio.style.display = "none";
    avversario.style.display = "none";


    if(Number(partita.turno) === mioNumero){


        mio.style.display = "flex";


    }else{


        avversario.style.display = "flex";


    }


    console.log(
        "Mio numero:",
        mioNumero,
        "Turno:",
        partita.turno
    );

}

function mostraCombinazioniAvversarioOnline(){

    let area =
        document.getElementById("combinazioniAvversario");

    if(!area){
        console.log(
            "❌ ERRORE: combinazioniAvversario non trovato"
        );
        return;
    }

    area.innerHTML = "";

    let lista =
        window.combinazioniAvversarioOnline || [];

    lista.forEach(gruppo => {

        let div = document.createElement("div");

        div.className = "combinazione";

        gruppo.carte.forEach(carta => {

            let c = document.createElement("div");

            c.className =
                "carta-mano carta-calata";

            let colore =
                (carta.seme === "♥" ||
                 carta.seme === "♦")
                ? "rosso"
                : "nero";

            if(carta.valore === "Jolly"){

                c.innerHTML = `
                    <div class="cartaValore jolly">
                        JOLLY
                    </div>

                    <div class="cartaSeme jolly">
                        🃏
                    </div>
                `;

            }else{

                c.innerHTML = `
                    <div class="cartaAngolo cartaAlto ${colore}">
                        <div>${carta.valore}</div>
                        <div>${carta.seme}</div>
                    </div>

                    <div class="cartaSemeCentro ${colore}">
                        ${carta.seme}
                    </div>

                    <div class="cartaAngolo cartaBasso ${colore}">
                        <div>${carta.valore}</div>
                        <div>${carta.seme}</div>
                    </div>
                `;

            }

            div.appendChild(c);

        });

        area.appendChild(div);

    });

}
window.creaPartita = creaPartita;
window.entraPartita = entraPartita;
window.iniziaPartita = iniziaPartita;
window.pesca = pesca;
window.scarta = scarta;
window.calaCarte = calaCarte;
window.pescaMazzo = pescaMazzo;
window.aggiungiAlTavolo = aggiungiAlTavolo;

function mostraOnline(){

    document.getElementById("menuIniziale").style.display = "none";
    document.getElementById("menuOnline").style.display = "block";

}

window.giocaCPU = giocaCPU;
window.mostraOnline = mostraOnline;
window.creaPartita = creaPartita;
window.entraPartita = entraPartita;
window.iniziaPartita = iniziaPartita;
window.scartaCPU = scartaCPU;

document.getElementById("bottoneCala").onclick = function(){
    calaCarte();
};

document.getElementById("bottoneScarta").onclick = function(){
    scarta();
};