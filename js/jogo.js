let isPlayerMirrored = false;
let stopMovingLeft = false;

let enemyLife = 4;

const KEYS = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    SPACE: 32
}

const GAMEWIDTH = 367
const GAMEHEIGHT = 110

const PLAYERWIDTH = 79
const PLAYERHEIGHT = 74

let game = {
    pressed: []
}

$(document).keydown(function(e) {
    if (e.which == KEYS.SPACE) {
        attack()
        return
    }
    if (e.which == KEYS.A) {
        mirrorPlayer(); 
    }
    if (e.which == KEYS.D) {
        unmirrorPlayer(); 
    }
    game.pressed[e.which] = true
})

$(document).keyup(function(e) {
    if (e.which == KEYS.SPACE) {
        return
    }
    game.pressed[e.which] = false
    // game.pressed[KEYS.S] = true
})

function mirrorPlayer() {
    if (!isPlayerMirrored) {
        $('#player').css('transform', 'scaleX(-1)');
        isPlayerMirrored = true;
    }
}

function unmirrorPlayer() {
    if (isPlayerMirrored) {
        $('#player').css('transform', 'scaleX(1)'); 
        isPlayerMirrored = false;
    }
}



function movePlayer() {
    
    let playerTop = parseInt($('#player').css('top'))
    let playerLeft = parseInt($('#player').css('left'))
    var position = parseInt($('#area_jogo').css('background-position'))
    
    


    if (game.pressed[KEYS.W]) {
        if (playerTop <= GAMEHEIGHT) {
            return
        }
        playerTop -= 5
        
        $('#player').css('top', playerTop)
    }
    if (game.pressed[KEYS.S]) {
        if (playerTop >= (GAMEHEIGHT * 2.2) - PLAYERHEIGHT) {
            return
        }
        playerTop += 5
        $('#player').css('top', playerTop)
    }
    if (game.pressed[KEYS.A]) {
        if (stopMovingLeft){
            return
        }
        if (position >= 0) {
            if (playerLeft <= 0) {
                return
            }
            playerLeft -= 5
            $('#player').css('left', playerLeft)
            return
        }
        if (playerLeft >= 120 ) {
            playerLeft -= 5
            $('#player').css('left', playerLeft)
            return
        }
        $('#area_jogo')
        .css('background-position', position + 5)
    }
    if (game.pressed[KEYS.D]) {
        if (position <= -365) {
            if (playerLeft >= GAMEWIDTH - PLAYERWIDTH - 3) {
                return
            }
            playerLeft += 5
            $('#player').css('left', playerLeft)
            return
        }
        if (playerLeft <= 120) {
            playerLeft += 5
            $('#player').css('left', playerLeft)
            return
        }
        $('#area_jogo')
        .css('background-position', position - 5)
    }
}

function loop(){
    movePlayer()
    moveEnemy()
    checkCollision()
}

setInterval(
    loop,
    30
)

function start() {
    createNewPlayer()
    createNewEnemy()
}

function createNewPlayer() {
    $('#player').remove()
    $('#area_jogo').append('<div id="player"></div>')
}

function attack() {
    stopMovingLeft = true
    let playerLeft = parseInt($('#player').css('left'));
    let playerRight = parseInt($('#player').css('right'));
    let attackDirection = isPlayerMirrored ? -1 : 1; 

    $('#player').remove();
    $('#area_jogo').append('<div id="player_attack"></div>');
    $('#player_attack').css("left", playerLeft);
    $('#player_attack').css("right", playerRight);

    $('#player_attack').css('transform', 'scaleX(' + attackDirection + ')');

    setTimeout(function() {
        $('#player_attack').remove();
        $('#area_jogo').append('<div id="player"></div>');
        $('#player').css("left", playerLeft);
        $('#player').css("right", playerRight);
        $('#player').css('transform', 'scaleX(' + attackDirection + ')');
        stopMovingLeft = false
    }, 500);
}

function createNewEnemy() {
    $('#enemy').remove()
    $('#area_jogo').append('<div id="enemy"></div>')
}

function moveEnemy() {
    if (stopMovingLeft){
        return
    }
    let enemyLeft = parseInt($('#enemy').css('left'))
    enemyLeft += 1
    if (enemyLeft >= GAMEWIDTH - PLAYERWIDTH) {
        // createNewEnemy()
        // enemyLeft = 20
        return
    }
    $('#enemy').css('left', enemyLeft)
}

function checkCollision() {
    const enemy = $('#enemy')
    const enemyHurt = $('#enemy_hurt')
    const player = $('#player')
    const player_attack = $('#player_attack')

    if (player.collision(enemy).length || player_attack.collision(enemy).length || player_attack.collision(enemyHurt).length ) {
        if (player_attack.collision(enemy).length) {
            hurtEnemy()
        }
        stopMovingLeft = true
    } else {
        stopMovingLeft = false
    }
}

function hurtEnemy() {
    let enemyLeft = parseInt($('#enemy').css('left'));
    let enemyRight = parseInt($('#enemy').css('right'));

    $('#enemy').remove();
    $('#area_jogo').append('<div id="enemy_hurt"></div>');
    $('#enemy_hurt').css("left", enemyLeft);
    $('#enemy_hurt').css("right", enemyRight);
    enemyLife -= 1


    setTimeout(function() {
        $('#enemy_hurt').remove();
        $('#area_jogo').append('<div id="enemy"></div>');
        if (enemyLife <= 0){
            //TODO KILL ENEMY CSS AND FUNCTION
            killEnemy()
            return
        }
        $('#enemy').css("left", enemyLeft);
        $('#enemy').css("right", enemyRight);
    }, 800);
}


start()