let board,
    game = new Chess(),
    statusEl = $('#status'),
    serverGame,
    playerColor;

socket = io();

socket.on('joingame', function(msg) {
    console.log("joined as game id: " + msg.game.id );
    playerColor = msg.color;
    initGame(msg.game);
});

socket.on('move', function (msg) {
    if (serverGame && msg.gameId === serverGame.id) {
        game.move(msg.move);
        board.position(game.fen());
    }
});
// do not pick up pieces if the game is over
// only pick up pieces for the side to move
const onDragStart = function(source, piece, position, orientation) {
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
        (game.turn() !== playerColor[0])){
        return false;
    }
};

const onDrop = function(source, target) {
    // see if the move is legal
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) {
        return 'snapback';
    } else {
        socket.emit('move', {move: move, gameId: serverGame.id, board: game.fen()})
    }
    updateStatus();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
const onSnapEnd = function() {
    board.position(game.fen());
};

const updateStatus = function() {
    let status = '';

    let moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate() === true) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (game.in_draw() === true) {
        status = 'Game over, drawn position';
    }

    // game still on
    else {
        status = moveColor + ' to move';

        // check?
        if (game.in_check() === true) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    statusEl.html(status);
};

const initGame = function (serverGameState) {
    serverGame = serverGameState;

    const cfg = {
        draggable: true,
        showNotation: false,
        orientation: playerColor,
        position: serverGame.board ? serverGame.board : 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };

    game = serverGame.board ? new Chess(serverGame.board) : new Chess();
    board = new ChessBoard('game-board', cfg);
};

updateStatus();