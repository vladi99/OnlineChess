var Client = (function (window) {
    let board,
        game = new Chess(),
        statusEl = $('#status'),
        socket,
        gameID,
        playerColor,
        playerName;


    const init = function (config) {
        gameID = config.gameID;
        playerColor = config.playerColor;
        playerName = config.playerName;

        socket = io.connect();

        const cfg = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        board = ChessBoard('board', cfg);

        socket.emit('join', gameID);
    };

    const onDragStart = function(source, piece, position, orientation) {
        if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
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
            socket.emit('move', {gameID: gameID, move: move})
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

    updateStatus();
    return init;
}(window));
