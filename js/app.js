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
    $('#gameInfo p').css('display', 'none');
    $('#startGame').click(function() {
        // sets initial display of game information
        $('#gameInfo p').css('display', 'inline-table');
        $('#elapsed-seconds').text('0:00');
        $('#matched-pairs').text('0');
        $('#unmatched-pairs').text('8');
        $('#attempts').text('0');
        // gets a random set of 8 pairs of tiles to use for the board
        // and sets their position on the board 
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

        // displays the elapsed time
        var seconds = Date.now();
        var minutes = 0;
        var matched = 0;
        var unmatched = 8;
        var attempts = 0;
        window.setInterval(function() {
            var elapsedSeconds = (Date.now() - seconds) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            minutes = Math.floor(elapsedSeconds / 60);
            elapsedSeconds = elapsedSeconds % 60;
            if (elapsedSeconds < 10) {
                elapsedSeconds = "0" + elapsedSeconds;
            }
            $('#elapsed-seconds').text(minutes + ":" + elapsedSeconds);
        }, 1000);
        var clickedImgs = [];
        var clickedTiles = [];
        $('#gameBoard img').click(function() {
            var clickedImg = $(this);
            clickedImgs.push(this);
            var tile = clickedImg.data('tile');
            clickedTiles.push(tile);
            flipTile(tile, clickedImg);
            console.log(clickedImgs);
            console.log(clickedTiles);
            if (clickedImgs.length == 2) {
                console.log(clickedTiles[0].src != clickedTiles[1].src);
                if (clickedTiles[0].src != clickedTiles[1].src) {
                    window.setTimeout(function() {
                        flipTile(clickedTiles[0], $(clickedImgs[0]));
                        flipTile(clickedTiles[1], $(clickedImgs[1]));
                    }, 1000);
                    attempts++;
                } else {
                    matched++;
                    unmatched--;
                }
                clickedImgs = [];
            }
        });

    });
});

function flipTile(tile, img) {
    console.log('flipTile');
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
