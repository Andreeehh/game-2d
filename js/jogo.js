let isPlayerMirrored = false;
let stopMoving = {};

let killCount = 0

let enemyId = 0;

let girlLife = 4;

let gameLevel = 1;

let stopGame = false

const KEYS = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    SPACE: 32
}

const GAMEWIDTH = 735
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
        if (stopMoving.left){
            return
        }
        if (playerLeft <= 0) {
            return
        }
        playerLeft -= 5
        $('#player').css('left', playerLeft)
        return
        
    }
    if (game.pressed[KEYS.D]) {
        if (playerLeft >= GAMEWIDTH - PLAYERWIDTH - 3) {
            return
        }
        playerLeft += 5
        $('#player').css('left', playerLeft)
        return
        
    }
}

function loop(){
    if (stopGame) {
        return
    }
    movePlayer()
    moveEnemy()
    checkCollision() 
}

setInterval(
    loop,
    40
)


function createEnemies(){
    if (stopGame) {
        return
    }
    createNewEnemy()
}

setInterval(
    createEnemies,
    5000
)

function start() {
    $('#area_jogo').empty();
    let url = `../img/back${gameLevel}.jpg`
    $('#area_jogo').css("background", `url('${url}')`)
    $('#area_jogo').animate({
        opacity: 1
    }, 4000, function() {
        stopGame = false
        
        $('#area_jogo').append("<div id='life'></div>")
        $('#area_jogo').append("<div id='kill_count'>Kills: 0</div>")
        girlLife = 4
        createNewPlayer()
        createNewEnemy()
        $('#area_jogo').append('<div id="girl"></div>');
    });
    
}

function createNewPlayer() {
    $('#player').remove()
    $('#area_jogo').append('<div id="player"></div>')
}

function attack() {
    stopMoving.left = true;
    let playerLeft = parseInt($('#player').css('left'));
    let playerTop = parseInt($('#player').css('top'));
    let attackDirection = isPlayerMirrored ? -1 : 1; 

    $('#player').remove();
    $('#area_jogo').append('<div id="player_attack"></div>');
    $('#player_attack').css("left", playerLeft);
    $('#player_attack').css("top", playerTop);

    $('#player_attack').css('transform', 'scaleX(' + attackDirection + ')');

    setTimeout(function() {
        $('#player_attack').remove();
        $('#area_jogo').append('<div id="player"></div>');
        $('#player').css("left", playerLeft);
        $('#player').css("top", playerTop);
        $('#player').css('transform', 'scaleX(' + attackDirection + ')');
        stopMoving.left = false
    }, 500);
}

function createNewEnemy() {
    let enemys = $('.enemy')
    for (let i = 0; i < enemys.length; i++){
        let enemy = $(enemys[i]);
        let enemyLeft = parseInt(enemy.css('left'))
        if (enemyLeft >= 600) {
            return
        }
    }
    enemyId += 1
    var newEnemy = $(`<div id="${enemyId}" class="enemy"></div>`);
    newEnemy.data('enemyLife', 4); 
    $('#area_jogo').append(newEnemy);
}

function moveEnemy() {
    let enemys = $('.enemy');
    for (let i = 0; i < enemys.length; i++){
        let enemy = $(enemys[i]);
        let enemyLeft = parseInt(enemy.css('left'));
        if (!stopMoving[enemy.attr('id')]) {
            enemyLeft -= (1 * gameLevel);
            enemy.css('left', enemyLeft);
        }
    }
}

function checkCollision() {
    const enemys = $('.enemy')
    const girl = $('#girl')
    const playerAttack = $('#player_attack')

    for (let i = 0; i < enemys.length; i++){
        let enemy = $(enemys[i]);
        if (playerAttack.collision(enemy).length) {
            if (playerAttack.collision(enemy).length) {
                hurtEnemy(enemys[i].id)
            }
            stopMoving.left = true;
            stopMoving[enemy.attr('id')] = true;
        } else {
            stopMoving.left = false;
            stopMoving[enemy.attr('id')] = false;
        }
        if (girl.collision(enemy).length) {
            attackEnemy(enemys[i].id)
            stopMoving[enemy.attr('id')] = true;
        } else {
            stopMoving[enemy.attr('id')] = false;
        }
    }
    
}

function hurtEnemy(id) {
    let enemy = $(`#${id}`)
    let enemyLeft = parseInt(enemy.css('left'));
    let enemyTop = parseInt(enemy.css('top'));

    let enemyLife = enemy.data('enemyLife');
    enemyLife -= 1;

    

    enemy.remove();
    $('#area_jogo').append(`<div id="${id}_hurt" class="enemy_hurt"></div>`);
    let enemyHurt = $(`#${id}_hurt`)

    $(enemyHurt).css("left", enemyLeft);
    $(enemyHurt).css("top", enemyTop);

    setTimeout(function() {
        if (enemyLife <= 0){
            killEnemy(id)
            return
        }    
        $(enemyHurt).remove();
        enemy.data('enemyLife', enemyLife);
        $('#area_jogo').append(enemy); 
    }, 800);
}

function killEnemy(id) {
    let enemy = $(`#${id}_hurt`)
    let enemyLeft = parseInt(enemy.css('left'));
    let enemyTop = parseInt(enemy.css('top'));
    
    let enemyLife = enemy.data('enemyLife');
    enemyLife -= 1;
    

    enemy.remove();
    $('#area_jogo').append(`<div id="${id}_death" class="enemy_death"></div>`);
    $(`#${id}_death`).css("left", enemyLeft);
    $(`#${id}_death`).css("top", enemyTop);
    updateKillCount()


    setTimeout(function() {
        $(`#${id}_death`).remove();
    }, 800);
}

function updateKillCount() {
    killCount += 1
    if (killCount == 10) {
        stopGame = true
        gameLevel += 1
        if (gameLevel == 5) {
            gameLevel = 1
            alert("Você zerou o jogo")
        }
        $('#area_jogo').animate({
            opacity: 0
        }, 4000, function() {
            
            killCount = 0
            start()
        });
        
    }
    $('#kill_count').text('Kills: ' + killCount);
}

function attackEnemy(id) {
    let enemy = $(`#${id}`)
    let enemyLeft = parseInt(enemy.css('left'));
    let enemyTop = parseInt(enemy.css('top'));

    enemy.remove();
    $('#area_jogo').append(`<div id="${id}_attack" class="enemy_attack"></div>`);
    let enemyAttack = $(`#${id}_attack`)

    $(enemyAttack).css("left", enemyLeft);
    $(enemyAttack).css("top", enemyTop);
    
    const delay = 300;
    new Promise((resolve) => {
        setTimeout(() => {
            hurtGirl();
            resolve();
        }, delay);
    });

    setTimeout(function() {
        $(enemyAttack).remove();
        $('#area_jogo').append(enemy); 
    }, 800);
}

function hurtGirl() {
    girlLife -= 1
    let backgroundTo = 0;
    switch (girlLife) {
        case 3: {
            backgroundTo = -75
            break;
        }
        case 2: {
            backgroundTo = -150
            break
        }
        case 1: {
            backgroundTo = -225
            break
        }
        default: {
            backgroundTo = 0
            break
        }
    }
    if (girlLife == 0) {
        alert("game-over")
        start()
    }
    $('#life').css('background-position', `0 ${backgroundTo}px`);
    $('#girl').remove();
    $('#area_jogo').append(`<div id="girl_hurt"></div>`);
    setTimeout(function() {
        $('#girl_hurt').remove();
        $('#area_jogo').append(`<div id="girl"></div>`);
    }, 4000);
}


start()