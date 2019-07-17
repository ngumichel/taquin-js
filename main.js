var answer = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null]
];

var randgame = [1, 2, 3, 4, 5, 6, 7, 8, null];
randgame.sort(function(a, b){return 0.5 - Math.random()});

var game = [[], [], []];

console.log(randgame);