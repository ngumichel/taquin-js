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
function doRandomShuffle() {

    let randMove = 0;
    let randMoveMax = side * side * side;

    applyRandMove(randMove, randMoveMax);

}

function applyRandMove(randMove, randMoveMax) {

    let availableMove = findMove();
    let chosenMove = availableMove[Math.floor(Math.random() * availableMove.length)];

    applyMove(chosenMove);

    randMove++;

    if (randMove < randMoveMax) {
        setTimeout(function () {
            applyRandMove(randMove, randMoveMax)
        }, 100);
    }

}

function applyMove(move) {

    var haut = {i: empty_cell.i - 1, j: empty_cell.j};
    var bas = {i: empty_cell.i + 1, j: empty_cell.j};
    var gauche = {i: empty_cell.i, j: empty_cell.j - 1};
    var droite = {i: empty_cell.i, j: empty_cell.j + 1};

    switch (move) {
        case "H":
            if (empty_cell.i - 1 >= 0) {
                current_state[empty_cell.i][empty_cell.j] = current_state[empty_cell.i - 1][empty_cell.j];
                current_state[empty_cell.i - 1][empty_cell.j] = 0;
                empty_cell.i = haut.i;
                empty_cell.j = haut.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "B":
            if (empty_cell.i + 1 <= side - 1) {
                current_state[empty_cell.i][empty_cell.j] = current_state[empty_cell.i + 1][empty_cell.j];
                current_state[empty_cell.i + 1][empty_cell.j] = 0;
                empty_cell.i = bas.i;
                empty_cell.j = bas.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "D":
            if (empty_cell.j + 1 <= side - 1) {
                current_state[empty_cell.i][empty_cell.j] = current_state[empty_cell.i][empty_cell.j + 1];
                current_state[empty_cell.i][empty_cell.j + 1] = 0;
                empty_cell.i = droite.i;
                empty_cell.j = droite.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        case "G":
            if (empty_cell.j - 1 >= 0) {
                current_state[empty_cell.i][empty_cell.j] = current_state[empty_cell.i][empty_cell.j - 1];
                current_state[empty_cell.i][empty_cell.j - 1] = 0;
                empty_cell.i = gauche.i;
                empty_cell.j = gauche.j;
            } else {
                console.log("Out of bound!!");
            }
            break;
        default:
    }
    displayState();
    console.log("Movement:", move)
}

function displayState() {
    $(".grid").empty();
    for (let i = 0; i < current_state.length; i++) {
        for (let j = 0; j < current_state[i].length; j++) {
            const elem = current_state[i][j];
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

    displayState();
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
        applyMove(HAUT);
    } else if (e.keyCode === 40) {
        // down arrow
        applyMove(BAS);
    } else if (e.keyCode === 37) {
        // left arrow
        applyMove(GAUCHE);
    } else if (e.keyCode === 39) {
        // right arrow
        applyMove(DROITE);
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

function findSolution() {

    let visited = [];
    let depth = 0;
    let max_depth = 20;

    if (DFS(current_state, visited, depth, max_depth)) {
        console.log("win");
    }

}

/**
 * @return {boolean}
 */
function DFS(state, visited, depth, max_depth) {

    let temp = [];
    let nodes = findMove();
    visited.push(state);
    let stack = temp.concat(nodes);

    if (state === win_state) {
        return true;
    }

    while (stack !== 0) {
        stack.forEach(function (node) {
            let newState = applyMove(node);
            console.log(stack);
            stack.pop();
            console.log(stack);
            DFS(newState, visited, depth + 1, max_depth)
        });

        if (visited.includes(stack[0])) {
            console.log("already visited");
        }

    }

}

function reset() {
    setInitState();
    displayState();
}

// Affichage initial : on fait un reset
reset();

