// app.js main java script file

"use strict";

var tiles = [];
for (var i = 1; i <= 32; i++) {
    var tileToPush = {
        tileNum: i,
        src: 'img/tile' + i + '.jpg',
        flipped: false,
        matched: false
    };
    tiles.push(tileToPush);

} // for each tile
var gameBoard = $('#gameBoard');

// when document is ready
$(document).ready(function() {
    $('#gameInfo p').css('display', 'none');
    $(window).resize(function() {
        var body = $('body').css('margin')
        var height = window.innerHeight - $('#head').innerHeight() - $('#gameInfo').innerHeight() - 16;
        if (height <= window.innerWidth - 16) {
            var imgSize = (height - 35) * 0.25;
            $('#gameBoard img').css('width', imgSize + 'px');
            $('#gameBoard img').css('height', imgSize + 'px');
        } else {
            $('#gameBoard img').css('width', '25%');
            $('#gameBoard img').css('height', '25%');
        }
    });
    var resetInterval = null;
    $('#startGame').click(function() {
        window.alert('Click the squares and try to find matches!');
        resizeWindow();
        var div = document.getElementById('gameBoard');
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
        if (clearInterval) {
            window.clearInterval(resetInterval);
        }
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
        var body = $('body').css('margin')
        var height = window.innerHeight - $('#head').innerHeight() - $('#gameInfo').innerHeight() - 16;
        if (height <= window.innerWidth - 16) {
            var imgSize = (height - 35) * 0.25;
            $('#gameBoard img').css('width', imgSize + 'px');
            $('#gameBoard img').css('height', imgSize + 'px');
        } else {
            $('#gameBoard img').css('width', '25%');
            $('#gameBoard img').css('height', '25%');
        }
        // displays the elapsed time
        var seconds = Date.now();
        var minutes = 0;
        var matched = 0;
        var unmatched = 8;
        var attempts = 0;
        resetInterval = window.setInterval(function() {
            var elapsedSeconds = (Date.now() - seconds) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            minutes = Math.floor(elapsedSeconds / 60);
            elapsedSeconds = elapsedSeconds % 60;
            if (elapsedSeconds < 10) {
                elapsedSeconds = "0" + elapsedSeconds;
            }
            $('#elapsed-seconds').text(minutes + ":" + elapsedSeconds);
        }, 1000);

        // logic of the game
        var firstClickedImg = null;
        $('#gameBoard img').click(function() {
            // flips the clicked tile
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            flipTile(tile, clickedImg);
            // if this is the second tile flipped, checks if they match
            if (firstClickedImg != null) {
                var t1 = firstClickedImg.data('tile');
                if (tile.src !== t1.src) {
                    setTimeout(function() {
                        flipTile(tile, clickedImg);
                        flipTile(t1, firstClickedImg);
                        firstClickedImg = null;
                    }, 1000);
                } else {
                    matched++;
                    unmatched--;
                    tile.matched = true;
                    t1.matched = true;
                    firstClickedImg = null;
                }
                attempts++;
            } else {
                firstClickedImg = clickedImg;
            }
            updateUI(pairs, matched, unmatched, attempts);
            $('#matched-pairs').text(matched);
            $('#unmatched-pairs').text(unmatched);
            $('#attempts').text(attempts);
        });
    });
});

function updateUI(pairs, matched, unmatched, attempts) {
    $('#matched-pairs').text(matched);
    $('#unmatched-pairs').text(unmatched);
    $('#attempts').text(attempts);
    var won = true;
    _.forEach(pairs, function(tile, elemIndex) {
        won = tile.matched && won;
    });
    if (won) {
        window.alert('Congratulations! You Won!');
    }
}

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

function resizeWindow() {
    console.log('resize');
    var body = $('body').css('margin')
    var height = window.innerHeight - $('#head').innerHeight() - $('#gameInfo').innerHeight() - 16;
    if (height <= window.innerWidth - 16) {
        console.log('height');
        var imgSize = (height - 35) * 0.25;
        $('#gameBoard img').css('width', imgSize + 'px');
        $('#gameBoard img').css('height', imgSize + 'px');
    } else {
        console.log('width');
        $('#gameBoard img').css('width', '25%');
        $('#gameBoard img').css('height', '25%');
    }
}
