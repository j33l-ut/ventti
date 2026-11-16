/* Ventti-javascript-tiedosto */
/* Maiden ja pakan / käsien määrittely täällä, jotta kaikki funktiot näkevät ne */

const maat = ["hertta", "ruutu", "risti", "pata"];
let pakka, pelaajanKasi, jakajanKasi;

/* aloittaa uuden pelin */
function uusiPeli() {
    console.log("Aloita peli!");
    /* alusta pakka ja kädet tyhjiksi taulukoiksi */
    pakka = [];
    pelaajanKasi = [];
    jakajanKasi = [];

    /* nollaa näytetyt kortit */
    document.querySelectorAll(".kortti").forEach(function(kortti){
        kortti.innerHTML = "";
        kortti.classList.remove("musta");
        kortti.classList.remove("punainen");
    });

    /* poista ohjeteksti (älä poista koko div-elementtiä) */
    document.getElementById("tulos").innerHTML = "";

    /* lisää tapahtumakäsittelijät Ota kortti- sekä Jää-nappeihin */
    document.getElementById("ota_kortti").addEventListener("click", otaPelaajanKortti);
    document.getElementById("jaa").addEventListener("click", jakajanVuoro );

    /* luo ja sekoita pakka */
    for(let maa of maat) {
        for(let arvo = 1; arvo<=13; arvo++) {
         pakka.push([maa, arvo]);
        }
    }
    pakka.sort(function(a,b){return 0.5 - Math.random()});
    
    /* jaa kaksi ensimmäistä korttia */
    otaPelaajanKortti();
    otaPelaajanKortti();

}

/* tulostuksen apufunktio (palauttaa maan symbolin) */
function haeMaaSymboli(maa) {
    switch(maa) {
    case "hertta":
        return "&hearts;";
    case "ruutu":
        return "&diams;";
    case "risti":
        return "&clubs;";
    case "pata":
        return "&spades;";
    default:
        return"";

    }
}

/* tulostuksen apufunktio (palauttaa A, J, Q, K tai numero) */
function haeArvoSymboli(arvo) {
    switch(arvo) {
        case 1:
            return "A";
        case 11:
            return "J";
        case 12:
            return "Q";
        case 13:
            return "K";
        default:
            return arvo;
    }
}

/* palauttaa parametrina annetun käden (taulukon) korttien yhteisarvon */
function kadenSumma(kasi) {
    let summa = 0;
    for (let kortti of kasi) {
        summa += kortti[1];
    }
    return summa;
}

/* tätä funktiota kutsutaan, kun pelaaja painaa Jää-nappia */
function jakajanVuoro() {
    console.log("Jakajan vuoro.");
    /* pura tapahtumakäsittelijät, jotta pelaaja ei voi enää ottaa korttia tai jäädä */
    document.getElementById("ota_kortti").removeEventListener("click", otaPelaajanKortti)
    document.getElementById("jaa").removeEventListener("click", jakajanVuoro)

    /* ota uusi kortti niin kauan kunnes jakaja voittaa tai häviää */
    while(tarkistaJakajanPisteet()) {
        otaJakajanKortti();
        let jakajaPisteet = kadenSumma(jakajanKasi);
        document.getElementById("dealerScore").innerText = jakajaPisteet;

    }
}

/* ota pelaajalle uusi kortti, näytä se ja tarkista pisteet, jos kortteja on vähintään kaksi */
/* muista lisätä näytettäviin kortteihin oikean värin (musta tai punainen) luokka */
function otaPelaajanKortti() {
    let kortti = pakka.pop();
    pelaajanKasi.push(kortti);
    let korttiNumero = pelaajanKasi.length;
    let korttiPaikka = document.getElementById("pelaaja" + korttiNumero);
    let pelaajanMaaSymboli = haeMaaSymboli(kortti[0]);
    let pelaajanArvoSymboli = haeArvoSymboli(kortti[1]);

    if (kortti[0] == "hertta" || kortti[0] == "ruutu") {
        korttiPaikka.classList.remove("musta");
        korttiPaikka.classList.add("punainen");
    }
    else {
        korttiPaikka.classList.remove("punainen");
        korttiPaikka.classList.add("musta");

    }
    korttiPaikka.innerHTML = `<span class="ekanumero">${pelaajanArvoSymboli}</span>
                            <span class="symboli">${pelaajanMaaSymboli}</span>
                            <span class="tokanumero">${pelaajanArvoSymboli}</span>`;

    if(korttiNumero >= 2) {
        tarkistaPelaajanPisteet();
    }

    let pelaajaPisteet = kadenSumma(pelaajanKasi);
    document.getElementById("playerScore").innerText = pelaajaPisteet;

}

/* ota jakajalle uusi kortti ja näytä se */
function otaJakajanKortti() {
    let kortti = pakka.pop();
    jakajanKasi.push(kortti);
    let korttiNumero = jakajanKasi.length;
    let korttiPaikka = document.getElementById("jakaja" + korttiNumero);
    let jakajanMaaSymboli = haeMaaSymboli(kortti[0]);
    let jakajanArvoSymboli = haeArvoSymboli(kortti[1]);

    if (kortti[0] == "hertta" || kortti[0] == "ruutu") {
        korttiPaikka.classList.remove("musta");
        korttiPaikka.classList.add("punainen");
    }
    else {
        korttiPaikka.classList.remove("punainen");
        korttiPaikka.classList.add("musta");

    }
    korttiPaikka.innerHTML = `<span class="ekanumero">${jakajanArvoSymboli}</span>
                            <span class="symboli">${jakajanMaaSymboli}</span>
                            <span class="tokanumero">${jakajanArvoSymboli}</span>`;
}

/* tarkista pelaajan käden summa ja näytä mahdollinen voittoviesti (pura myös tapahtumakäsittelijät pelin päättyessä) */
/* jos pisteitä yli 21, jakaja voitti; jos tasan 21 tai kädessä 5 korttia, pelaaja voitti */
function tarkistaPelaajanPisteet() {
    let pisteet = kadenSumma(pelaajanKasi);

    if(pisteet > 21) {
        document.getElementById("tulos").innerHTML = "Jakaja voitti!";
        document.getElementById("ota_kortti").removeEventListener("click", otaPelaajanKortti)
        document.getElementById("jaa").removeEventListener("click", jakajanVuoro)
    }
    else if (pisteet == 21 || pelaajanKasi.length == 5) {
        document.getElementById("tulos").innerHTML = "Pelaaja voitti!";
        document.getElementById("ota_kortti").removeEventListener("click", otaPelaajanKortti)
        document.getElementById("jaa").removeEventListener("click", jakajanVuoro)
    }
}

/* tarkista jakajan käden summa, näytä mahdollinen voittoviesti ja palauta true / false, jatkuuko jakajan vuoro */
/* jakajanVuoro-funktio voi paluuarvon perusteella päätellä, otetaanko vielä kortteja */
function tarkistaJakajanPisteet() {
    let pisteet = kadenSumma(jakajanKasi);

    if (pisteet > 21) {
        document.getElementById("tulos").innerHTML = "Pelaaja voitti!";
        return false;
    }
    else if (pisteet == 21 || jakajanKasi.length == 5) {
            document.getElementById("tulos").innerHTML = "Jakaja voitti!";
    }
    else if (pisteet >= kadenSumma(pelaajanKasi)) {
        document.getElementById("tulos").innerHTML = "Jakaja voitti!";
        return false;
    }
    else {
        return true;
    }
}

/* Lisää Uusi peli -napin tapahtumakäsittelijä */
document.getElementById("uusi_peli").addEventListener("click", uusiPeli);

/*Säännöt nappulla */
document.getElementById("saannot").addEventListener("click", function() {
    alert("VENTIN SÄÄNNÖT:\n" +
    "- Pelaaja saa aluksi kaksi korttia.\n" +
    "- Tavoite: saada mahdollisimman lähelle 21 ilman että menee yli.\n" +
    "- 21 = voitto heti.\n" +
    "- Yli 21 = häviö heti.\n" +
    "- Pelaaja voi nostaa lisää kortteja tai jäädä tilanteeseen.\n" +
    "- 5 korttia alle 21 = automaattivoitto.\n" +
    "- Kun pelaaja jää, jakaja nostaa kortteja:\n" +
    "   · Jakaja voittaa jos pisteet ≥ pelaajalla, tai tasan 21, tai 5 korttia alle 21.\n" +
    "   · Jakaja häviää jos pisteet yli 21.");
});


