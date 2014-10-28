// app.js main java script file

"use strict";

var tiles = [];
var i = 0;
for (i = 1; i <= 32; i++) {
    tiles.push({
        tileNum: i,
        src: 'img/tile' + i + '.jpg',
        flipped: false,
        matched: false
    });
} // for each tile

// when document is ready
$(document).ready(function() {
    $('#startGame').click(function() {
        tiles = _.shuffle(tiles);
        var toUse = tiles.slice(0, 8);
        var pairs = [];
        _.forEach(toUse, function(tile) {
            pairs.push(tile);
            pairs.push(_.clone(tile));
        });
        pairs = _.shuffle(pairs);
        var gameBoard = $('#gameBoard');
        var img;
        var row = $(document.createElement('div'));
        _.forEach(pairs, function(tile, elemIndex) {
            if (elemIndex > 0 && elemIndex % 4 == 0) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'tile ' + tile.tileNum
            });
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);

        var seconds = Date.now();
        window.setInterval(function() {
            var elapsedSeconds = (Date.now() - seconds) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);

        $('#gameBoard img').click(function() {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            flipTile(tile, clickedImg);
        });

    });
});

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}