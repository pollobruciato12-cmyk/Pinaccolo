let mazzo = [];
let mano = [];
let carteSelezionate = [];
let scarti = [];
let combinazioni = [];
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

    return "jolly_rosso.png";

}


    let valore =
    valoriNomi[carta.valore] || carta.valore;


    let seme =
    semiNomi[carta.seme];


    return valore + "_" + seme + ".png";

}


function pesca(){

    for(let i = 0; i < 2; i++){

        if(mazzo.length > 0){

            mano.push(mazzo.pop());

        }

    }


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

}



function scarta(){

    let numeroGiocatore = 
    mioGiocatore === "giocatore1" ? 1 : 2;


if(!partita.turno){

    alert("Attendi caricamento partita");

    return;

}


if(Number(partita.turno) !== numeroGiocatore){

    alert(
        "Non è il tuo turno\n" +
        "Turno attuale: " + partita.turno +
        "\nTu sei: " + numeroGiocatore
    );

    return;

}


    if(carteSelezionate.length === 0){

        alert("Seleziona una carta");

        return;

    }


    let carta = carteSelezionate[0];

    let indice = mano.indexOf(carta);


    if(indice !== -1){

        scarti.push(carta);

        mano.splice(indice,1);

    }


    carteSelezionate = [];


    mostraScarti();

    mostraMano();



    // salva lo scarto su Firebase

    set(
        ref(database, "partite/" + codicePartitaAttuale + "/giocatori/" + mioGiocatore + "/mano"),
        mano
    );


    set(
        ref(database, "partite/" + codicePartitaAttuale + "/scarti"),
        scarti
    );



    // passa il turno

    let nuovoTurno = partita.turno === 1 ? 2 : 1;


    set(
        ref(database, "partite/" + codicePartitaAttuale + "/turno"),
        nuovoTurno
    );


}



function mostraScarti(){

    let area = document.getElementById("scarti");

    area.innerHTML = "";


    if(scarti.length === 0){
        return;
    }


    let carta = scarti[scarti.length - 1];


    let div = document.createElement("div");

    div.className = "carta-mano";


    let colore =
    (carta.seme === "♥" || carta.seme === "♦")
    ? "rosso"
    : "nero";


    if(["J","Q","K"].includes(carta.valore)){


        div.innerHTML = `

        <div class="angoloCarta ${colore}">
            <div>${carta.valore}</div>
            <div>${carta.seme}</div>
        </div>


        <div class="figuraCarta ${colore}">
            ${carta.valore}
        </div>

        `;


    } else {


        div.innerHTML = `

        <div class="angoloCarta ${colore}">
            <div>${carta.valore}</div>
            <div>${carta.seme}</div>
        </div>


        <div class="semeCentro ${colore}">
            ${carta.seme}
        </div>

        `;

    }


    area.appendChild(div);

}


function creaGiocatori(numero, coppie = false){

    giocatori = [];

    for(let i = 0; i < numero; i++){

        giocatori.push({

            id: i,

            nome: "Giocatore " + (i + 1),

            mano: [],

            combinazioni: [],

            squadra: coppie ? (i % 2) : i

        });

    }

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



function mostraMano(){

    let area = document.getElementById("mano");

    area.innerHTML = "";


    mano.forEach(carta=>{


        let div = document.createElement("div");

        div.className="carta-mano";
        
div.style.backgroundPosition = "center";


        div.onclick=function(){


            let indice =
            carteSelezionate.indexOf(carta);


            if(indice === -1){

                carteSelezionate.push(carta);

                div.classList.add("selezionata");


            }else{

                carteSelezionate.splice(indice,1);

                div.classList.remove("selezionata");

            }


        };



        let colore =
        (carta.seme==="♥" || carta.seme==="♦")
        ? "rosso"
        : "nero";


div.innerHTML = `

<img class="immagineCarta" src="images/carte/${nomeImmagineCarta(carta)}">

`;


area.appendChild(div);


    });
    

// Adatta spazio mano in base allo spazio disponibile

let spazio = document.getElementById("mano").clientWidth;

let larghezzaCarta = 62;

let margine = 0;


if(mano.length <= 12){

    margine = -15;

}
else if(mano.length <= 16){

    margine = -28;

}
else if(mano.length <= 20){

    margine = -38;

}
else {

    margine = -42;

}


document.querySelectorAll(".carta-mano").forEach((c,i)=>{

    if(i === 0){

        c.style.marginLeft = "0px";

    } else {

        c.style.marginLeft = margine + "px";

    }

});


// limite massimo di sovrapposizione
if(margine < -38){

    margine = -38;

}
document.querySelectorAll(".carta-mano").forEach((c, i)=>{

    if(i > 0){
        c.style.marginLeft = margine + "px";
    }

});


document.querySelectorAll(".carta-mano").forEach((c, i)=>{

    if(i === 0){

        c.style.marginLeft = "0px";

    }else{

        c.style.marginLeft = margine + "px";

    }

});

let contatore = document.getElementById("contatoreMazzo");

if(contatore){

    contatore.innerHTML =
    "Carte mazzo: " + mazzo.length;

}

}



function calaCarte(){

    if(carteSelezionate.length===0){

        alert("Seleziona almeno una carta.");

        return;

    }


    if(!combinazioneValida(carteSelezionate)){

        alert("Combinazione non valida");

        return;

    }


    let nuova=[];


    for(let carta of carteSelezionate){

        let indice=mano.indexOf(carta);


        if(indice!==-1){

            nuova.push(carta);

            mano.splice(indice,1);

        }

    }


    combinazioni.push({

        tipo: determinaTipo(nuova),

        carte: nuova

    });


    carteSelezionate=[];


    mostraMano();

    mostraCombinazioni();

}
// TOCCO AREA MIE COMBINAZIONI

document.getElementById("mieCombinazioni").onclick = function(){

    if(carteSelezionate.length === 0){

        alert("Seleziona prima le carte");

        return;

    }


    if(!combinazioneValida(carteSelezionate)){

        alert("Combinazione non valida");

        return;

    }


    let nuova = [];


    for(let carta of carteSelezionate){

        let indice = mano.indexOf(carta);

        if(indice !== -1){

            nuova.push(carta);

            mano.splice(indice,1);

        }

    }


    combinazioni.push({

        tipo: determinaTipo(nuova),

        carte: nuova

    });


    carteSelezionate = [];


    mostraMano();

    mostraCombinazioni();

};
function mostraCombinazioni(){

    let area = document.getElementById("mieCombinazioni");

    area.innerHTML = "";


    combinazioni.forEach(gruppo=>{


        let div = document.createElement("div");

        div.className="combinazione";


        div.onclick=function(){

            combinazioneSelezionata = gruppo;

            alert("Combinazione selezionata");

        };



        gruppo.carte.forEach(carta=>{


            let c = document.createElement("div");

            c.className="carta-mano carta-calata";


            c.innerHTML =
            carta.valore + "<br>" + carta.seme;


            if(carta.seme==="♥" || carta.seme==="♦"){

                c.style.color="red";

            }


            div.appendChild(c);


        });


        area.appendChild(div);


    });


}





function combinazioneValida(carte){

    if(carte.length < 3){

        return false;

    }


    // TRIS (per ora lasciato invariato)

    let stessoValore =
    carte.every(carta =>
        carta.valore === carte[0].valore
    );


    let semiUsati=[];


    let semiDiversi =
    carte.every(carta=>{

        if(semiUsati.includes(carta.seme)){

            return false;

        }

        semiUsati.push(carta.seme);

        return true;

    });



    if(stessoValore && semiDiversi){

        return true;

    }



    // SCALA CON JOLLY E PINELLE


    let stessoSeme =
    carte
    .filter(carta =>
        carta.valore !== "Jolly" &&
        carta.pinella !== true
    )
    .every(carta =>
        carta.seme === carte.find(c =>
            c.valore !== "Jolly" &&
            c.pinella !== true
        ).seme
    );


    if(!stessoSeme){

        return false;

    }



    let speciali = carte.filter(carta =>
        carta.valore === "Jolly" ||
        carta.pinella === true
    ).length;



    let normali = carte.filter(carta =>
        carta.valore !== "Jolly" &&
        carta.pinella !== true
    );



    let ordine = [
        "A","3","4","5","6","7",
        "8","9","10","J","Q","K"
    ];



    let posizioni = normali.map(carta =>
        ordine.indexOf(carta.valore)
    );



    // Proviamo tutte le possibili partenze

    for(let partenza = 0; partenza < 12; partenza++){


        let usate = 0;

        let mancanti = 0;



        for(let i = 0; i < carte.length; i++){


            let posizione =
            (partenza + i) % 12;


            if(posizioni.includes(posizione)){

                usate++;

            }else{

                mancanti++;

            }

        }



        if(mancanti <= speciali){

            return true;

        }


    }



    return false;


}






function determinaTipo(carte){


    let stessoValore =
    carte.every(carta =>
        carta.valore === carte[0].valore
    );


    if(stessoValore){

        return "tris";

    }



    let stessoSeme =
    carte.every(carta =>
        carta.seme === carte[0].seme
    );


    if(stessoSeme){

        return "scala";

    }



    return "sconosciuta";


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







creaMazzo();

distribuisci();

let codicePartitaAttuale = "";
let giocatore = "";
let mioGiocatore = "";

const database = window.database;
const ref = window.ref;
const set = window.set;
const onValue = window.onValue;

function creaPartita(){

    document.getElementById("menuIniziale").style.display = "none";
    document.getElementById("areaGioco").style.display = "flex";


    codicePartitaAttuale = Math.random()
    .toString(36)
    .substring(2,8)
    .toUpperCase();


    document.getElementById("codicePartita").innerHTML =
    "Codice partita: " + codicePartitaAttuale;


    giocatore = "Giocatore 1";
    mioGiocatore = "giocatore1";


    document.getElementById("listaGiocatori").innerHTML =
    "Giocatori:<br>🟢 Giocatore 1<br>⚪ In attesa...";


    alert("Sto inviando a Firebase");

    set(ref(database, "partite/" + codicePartitaAttuale), {
        creatore: "Giocatore 1",
        stato: "attesa",
        giocatori: {
            giocatore1: {
                nome: "Giocatore 1"
            }
        }
    })
    .then(() => {
        alert("Partita creata su Firebase!");
        ascoltaPartita();
    })
    .catch((errore) => {
        alert("ERRORE: " + errore);
    });

}

function entraPartita(){
  
      document.getElementById("menuIniziale").style.display = "none";
    document.getElementById("areaGioco").style.display = "flex";

    let codice = document.getElementById("codiceIngresso").value
    .toUpperCase();


    if(codice === ""){

        document.getElementById("messaggioPartita").innerHTML =
        "Inserisci un codice";

        return;

    }


    codicePartitaAttuale = codice;

    mioGiocatore = "giocatore2";


    set(
        ref(database, "partite/" + codice + "/giocatori/giocatore2"),
        {
            nome: "Giocatore 2",
        }
    )

    .then(()=>{

        document.getElementById("messaggioPartita").innerHTML =
        "Sei entrato nella partita!";


        document.getElementById("listaGiocatori").innerHTML =
        "Giocatori:<br>🟢 Giocatore 1<br>🟢 Giocatore 2";


        ascoltaPartita();


    })

    .catch((errore)=>{

        document.getElementById("messaggioPartita").innerHTML =
        "Errore: " + errore;

    });

}

function iniziaPartita(){

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

        mazzo: mazzo,

        scarti: [],

        tavolo: [],

        giocatori: {

            giocatore1: {
                nome: "Giocatore 1",
                mano: mano1
            },

            giocatore2: {
                nome: "Giocatore 2",
                mano: mano2
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
            console.log("DATI FIREBASE:", dati);


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




if (
    dati.stato === "attesa" &&
    dati.giocatori &&
    dati.giocatori.giocatore1 &&
    dati.giocatori.giocatore2 &&
    mioGiocatore === "giocatore1"
){

    iniziaPartita();

    return;

}



if(dati.turno !== undefined){

if(dati.turno){

    partita.turno = Number(dati.turno);

    aggiornaIndicatoreTurno();

}

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
                mazzo = dati.mazzo;

                mostraMano();


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

    let area = document.getElementById("indicatoreTurno");

    if(!area){
        return;
    }


if(!mioGiocatore){
    return;
}

let mioNumero =
mioGiocatore === "giocatore1" ? 1 : 2;


    if(partita.turno === mioNumero){

        area.innerHTML =
        "🟢 È il tuo turno";

    }else{

        area.innerHTML =
        "⏳ Turno di Giocatore " + partita.turno;

    }

}
window.creaPartita = creaPartita;
window.entraPartita = entraPartita;
window.iniziaPartita = iniziaPartita;
window.pesca = pesca;
window.scarta = scarta;
window.calaCarte = calaCarte;
window.aggiungiAlTavolo = aggiungiAlTavolo;