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
// case deja visiter
var visited = [];

var temp_state = [];

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
function doRandomShuffle() {

    let randMove = 0;
    let randMoveMax = side * side * side;

    applyRandMove(randMove, randMoveMax);

}

function applyRandMove(randMove, randMoveMax) {

    let availableMove = findMove();
    let chosenMove = availableMove[Math.floor(Math.random() * availableMove.length)];

    applyMove(current_state, chosenMove, empty_cell);

    randMove++;

    if (randMove < randMoveMax) {
        setTimeout(function () {
            applyRandMove(randMove, randMoveMax)
        }, 100);
    }

}

function applyMove(state, move, cell) {

    var haut = {i: cell.i - 1, j: cell.j};
    var bas = {i: cell.i + 1, j: cell.j};
    var gauche = {i: cell.i, j: cell.j - 1};
    var droite = {i: cell.i, j: cell.j + 1};

    switch (move) {
        case "H":
            if (cell.i - 1 >= 0) {
                state[cell.i][cell.j] = state[cell.i - 1][cell.j];
                state[cell.i - 1][cell.j] = 0;
                cell.i = haut.i;
                cell.j = haut.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "B":
            if (cell.i + 1 <= side - 1) {
                [state[cell.i][cell.j], state[cell.i + 1][cell.j]] = [state[cell.i + 1][cell.j], state[cell.i][cell.j]];
                cell.i = bas.i;
                cell.j = bas.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "D":
            if (cell.j + 1 <= side - 1) {
                state[cell.i][cell.j] = state[cell.i][cell.j + 1];
                state[cell.i][cell.j + 1] = 0;
                cell.i = droite.i;
                cell.j = droite.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "G":
            if (cell.j - 1 >= 0) {
                state[cell.i][cell.j] = state[cell.i][cell.j - 1];
                state[cell.i][cell.j - 1] = 0;
                cell.i = gauche.i;
                cell.j = gauche.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        default:
    }
    displayState(state);
    console.log("Movement:", move);
    return state;
}

function displayState(state) {
    $(".grid").empty();
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            const elem = state[i][j];
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
    doRandomShuffle();
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

    if (cur_pos.i + 1 === empty_cell.i && cur_pos.j === empty_cell.j) {
        applyMove(current_state, HAUT, empty_cell);
        console.log("H");
    } else if (cur_pos.i - 1 === empty_cell.i && cur_pos.j === empty_cell.j) {
        applyMove(current_state, BAS, empty_cell);
        console.log("B");
    } else if (cur_pos.i === empty_cell.i && cur_pos.j + 1 === empty_cell.j) {
        applyMove(current_state, GAUCHE, empty_cell);
        console.log("G");
    } else if (cur_pos.i === empty_cell.i && cur_pos.j - 1 === empty_cell.j) {
        applyMove(current_state, DROITE, empty_cell);
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
        applyMove(current_state, HAUT, empty_cell);
    } else if (e.keyCode === 40) {
        // down arrow
        applyMove(current_state, BAS, empty_cell);
    } else if (e.keyCode === 37) {
        // left arrow
        applyMove(current_state, GAUCHE, empty_cell);
    } else if (e.keyCode === 39) {
        // right arrow
        applyMove(current_state, DROITE, empty_cell);
    }
    console.log(current_state);
    if (checkWin(current_state)) {
        displayWin();
    }
}

function checkWin(state) {
    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {
            if (state[i][j] !== win_state[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function getCurrentState(state) {
    let l = side;
    for (let i = 0; i < l; i++) {
        temp_state[i] = [];
        for (let j = 0; j < l; j++) {
            temp_state[i][j] = state[i][j];
        }
    }
    return temp_state;
}

function findMove() {

    let node = [];

    if (empty_cell.i - 1 >= 0) {
        node.push(HAUT);
    }
    if (empty_cell.i + 1 <= side - 1) {
        node.push(BAS);
    }
    if (empty_cell.j - 1 >= 0) {
        node.push(GAUCHE);
    }
    if (empty_cell.j + 1 <= side - 1) {
        node.push(DROITE);
    }
    return node;
}

function checkMove(move, state, stack) {

    const tmp_h = getCurrentState(state).slice();
    const tmp_g = getCurrentState(state).slice();
    const tmp_b = getCurrentState(state).slice();
    const tmp_d = getCurrentState(state).slice();

    let temp_h = applyMove(getCurrentState(tmp_h).slice(), HAUT, empty_cell);
    let temp_b = applyMove(getCurrentState(tmp_b).slice(), BAS, empty_cell);
    let temp_g = applyMove(getCurrentState(tmp_g).slice(), GAUCHE, empty_cell);
    let temp_d = applyMove(getCurrentState(tmp_d).slice(), DROITE, empty_cell);
    console.log("temp " + temp_b);

    if (move === "H" && !visited.includes(temp_h)) {
        //applyMove(move);
    } else if (move === "G" && !visited.includes(temp_g)) {
        //applyMove(move);
    } else if (move === "B" && !visited.includes(temp_b)) {
        //applyMove(move);
    } else if (move === "D" && !visited.includes(temp_d)) {
        //applyMove(move);

    }

}


/**
 * @return {boolean}
 */
function DFS(depth, max_depth) {
    let state = getCurrentState(current_state).slice();
    let temp = [];
    let nodes = findMove();
    let stack = temp.concat(nodes);
    console.log("current stack " + state + "\n");
    visited.push(state);

    if (state === win_state) {
        return true;
    }

    while (stack !== 0) {
        for (let i = 0; i < stack.length; i++) {
            checkMove(stack[i], state, stack);

            stack.shift();
            console.log("popped stack " + stack + "\n");
            DFS(depth + 1, max_depth)
        }
    }
}

function findSolution() {
    if (DFS(0, 20)) {
        console.log("win");
    }
}


function reset() {
    setInitState();
    displayState(current_state);
}

// Affichage initial : on fait un reset
reset();

