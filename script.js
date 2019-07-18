// mouvements possibles
const HAUT = "H";
const BAS = "B";
const DROITE = "D";
const GAUCHE = "G";

// nombre de cases par côté
var side = 3;

// changement de style css en fonction de "side"
document.documentElement.style.setProperty("--side", side);


// retient l'état courant du taquin
var current_state = [];
// retient l'état de victoire
var win_state = [];
// position de la case vide
const empty_cell = {i: 0, j: 0};

// Initialisation de l'état courant
function setInitState() {
    current_state = [];     // on vide le tableau
    for (let i = 0; i < side; i++) {
        current_state[i] = [];
        win_state[i] = [];
        for (var j = 0; j < side; j++) {
            if (i === side - 1 && j === side - 1) {
                val = 0;
            } else {
                val = i * side + j + 1;
            }
            current_state[i][j] = val;
            win_state[i][j] = val;
        }
    }
    empty_cell.i = side - 1;
    empty_cell.j = side - 1;
}

// Randomiser l'état courant
function doRandomShuffle(state, cell) {
    let temp_state = [];

    for ( let i = 0; i < side*side; i++) {
        temp_state.push(i);
    }

    console.log(temp_state);

    temp_state.sort(function (a, b) {
        return 0.5 - Math.random()
    });

    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            state[i][j] = temp_state[i * side + j];
            if (temp_state[i * side + j] === 0) {
                cell.i = i;
                cell.j = j;
            }
        }
    }
    console.log(empty_cell);
}


function applyMove(state, ec, move) {

    var haut = {i: ec.i - 1, j: ec.j};
    var bas = {i: ec.i + 1, j: ec.j};
    var gauche = {i: ec.i, j: ec.j - 1};
    var droite = {i: ec.i, j: ec.j + 1};

    switch (move) {
        case "H":
            if (ec.i - 1 >= 0) {
                state[ec.i][ec.j] = state[ec.i - 1][ec.j];
                state[ec.i - 1][ec.j] = 0;
                empty_cell.i = haut.i;
                empty_cell.j = haut.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "B":
            if (ec.i + 1 <= side - 1) {
                state[ec.i][ec.j] = state[ec.i + 1][ec.j];
                state[ec.i + 1][ec.j] = 0;
                empty_cell.i = bas.i;
                empty_cell.j = bas.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "D":
            if (ec.j + 1 <= side - 1) {
                state[ec.i][ec.j] = state[ec.i][ec.j + 1];
                state[ec.i][ec.j + 1] = 0;
                empty_cell.i = droite.i;
                empty_cell.j = droite.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "G":
            if (ec.j - 1 >= 0) {
                state[ec.i][ec.j] = state[ec.i][ec.j - 1];
                state[ec.i][ec.j - 1] = 0;
                empty_cell.i = gauche.i;
                empty_cell.j = gauche.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        default:
            console.log("toto");
    }
    console.log("Movement:", move)
}


function displayState(tab) {
    $(".grid").empty();
    for (let i = 0; i < tab.length; i++) {
        for (let j = 0; j < tab[i].length; j++) {
            const elem = tab[i][j];
            if (elem) {
                const item = $(
                    `<div data-i="${i}" data-j="${j}" class="item">${elem}</div>`
                );
                $(".grid").append(item);
            } else {
                $(".grid").append(`<div class="vide"></div>`);
            }
        }
    }
}


$(".check").click(function () {
    console.log("Is winning? ", checkWin(current_state));
    // TODO: penser à implémenter la fonction checkWin
});

$(".reset").click(reset);

$(".shuffle").click(function () {
    // pas le temps de faire le shuffle
    doRandomShuffle(current_state, empty_cell);
    displayState(current_state);
});

$(".solution").click(function () {
    console.log("Solution demandée par l'utilisateur·ice")
    findSolution(current_state, empty_cell);
});

// Pour augmenter / diminuer la taille d'un côté.
$(".plus").click(function () {
    document.documentElement.style.setProperty("--side", ++side);
    reset();
    console.log("Plus grand")
});

$(".minus").click(function () {
    document.documentElement.style.setProperty("--side", --side);
    reset();
    console.log("Plus petit")
});

// Ici on gere l'ajout dynamique de .item
$(".grid").on('click', '.item', function () {
    console.log("J'existe et resisterai à ma mort dans un reset/ shuffle ",
        "Valeur:", $(this).html(),
        "Position i:", $(this).attr("data-i"),
        "Position j:", $(this).attr("data-j"),
    );

    var cur_pos = {
        i: parseInt($(this).attr("data-i")),
        j: parseInt($(this).attr("data-j"))
    };

    if(cur_pos.i + 1 === empty_cell.i && cur_pos.j === empty_cell.j) {
        applyMove(current_state, empty_cell, HAUT);
        console.log("H");
    } else if (cur_pos.i - 1 === empty_cell.i && cur_pos.j === empty_cell.j) {
        applyMove(current_state, empty_cell, BAS);
        console.log("B");
    } else if (cur_pos.i === empty_cell.i && cur_pos.j + 1 === empty_cell.j) {
        applyMove(current_state, empty_cell, GAUCHE);
        console.log("G");
    } else if (cur_pos.i === empty_cell.i && cur_pos.j - 1 === empty_cell.j) {
        applyMove(current_state, empty_cell, DROITE);
        console.log("D");
    } else {
        console.log("no move possible!")
    }

    displayState(current_state);
    if (checkWin(current_state)) {
        displayWin();
    }
});

// Avec le code ci-dessous, j'ai des problèmes à chaque reset car les item sont 
// supprimés.
// Pas de gestion dynamique de .item 
// $(".item").click(function(){
//   console.log("Je n'existe que jusqu'à ma mort dans un reset/ shuffle")   
//


// Une jolie fenetre est prévue pour quand on gagne
var modal = document.getElementById("myModal");

// Pour fermer la fenetre avec un "X"
var span = document.getElementsByClassName("close")[0];

// Pour afficher la fenetre quand on a gagné, appeler cette fonction
function displayWin() {
    modal.style.display = "block";
}

// Quand on clique sur <span> (x), on ferme
span.onclick = function () {
    modal.style.display = "none";
}

// On ferme aussi si on clique n'importe où
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}


// Pour récupérer l'appui sur les flèches du clavier
document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode === 38) {
        // up arrow
        applyMove(current_state, empty_cell, HAUT);
    } else if (e.keyCode === 40) {
        // down arrow
        applyMove(current_state, empty_cell, BAS);
    } else if (e.keyCode === 37) {
        // left arrow
        applyMove(current_state, empty_cell, GAUCHE);
    } else if (e.keyCode === 39) {
        // right arrow
        applyMove(current_state, empty_cell, DROITE);
    }
    console.log(current_state);
    displayState(current_state);
    if (checkWin(current_state)) {
        displayWin();
    }
}

function checkWin(state) {
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            if(state[i][j] !== win_state[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function reset() {
    setInitState();
    displayState(current_state);
}

// Affichage initial : on fait un reset
reset();

