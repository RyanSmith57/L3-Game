const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const player = new Sprite({
    position: {
    x:0,
    y:0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0,
    }
})



const enemy = new Sprite({
    position: {
    x:400,
    y:100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0,
    }
})



console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({
    rectangle1, rectangle2
}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
         rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
         && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
         )
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -3
    } else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 3
    }

     //enemy movement
     if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -3
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 3
    }

    //collision detection
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
          player.isAttacking
          ){
            player.isAttacking = false
            enemy.health -= 20
       document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
          enemy.isAttacking
          ){
            enemy.isAttacking = false
            player.health -= 20
            document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // game end based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie'
        document.querySelector('#displayText').style.display = 'flex'
     } else if(player.health > enemy.health){
         document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
     }else if(player.health < enemy.health){
         document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
     }

}

let timer = 60
let timerId
function decreaseTimer(){
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
    document.querySelector('#timer').innerHTML = timer
}
if(timer === 0) {
    determineWinner({player, enemy, timerId})
}
}

decreaseTimer()

animate()

window.addEventListener('keydown', (event) => {

    //player keys
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
    }
    switch (event.key) {
        case 'a':
           keys.a.pressed = true
           player.lastkey = 'a'
            break
    }
    switch (event.key) {
        case 'w':
           player.velocity.y = -20
            break
    }
    switch (event.key) {
        case ' ':
            player.attack()
            break
    }

    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
    }
    switch (event.key) {
        case 'ArrowLeft':
           keys.ArrowLeft.pressed = true
           enemy.lastkey = 'ArrowLeft'
            break
    }
    switch (event.key) {
        case 'ArrowUp':
           enemy.velocity.y = -20
            break
    }
    switch (event.key) {
        case 'ArrowDown':
           enemy.isAttacking = true
            break
    }

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
    }
    switch (event.key) {
        case 'a':
           keys.a.pressed = false
            break
    }
    switch (event.key) {
        case 'w':
           keys.w.pressed = false
            break
    }

    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
    }
    switch (event.key) {
        case 'ArrowLeft':
           keys.ArrowLeft.pressed = false
            break
    }
    switch (event.key) {
        case 'ArrowRight':
           keys.ArrowUp.pressed = false
            break
    }

})