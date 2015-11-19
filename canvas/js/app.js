/* script file for the Canvas demo */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    var canvas = document.getElementById('game-canvas');
    //2D rendering context
    var ctx = canvas.getContext('2d');

    //ctx.fillStyle = 'rgba(255,0,0,0.6)';
    //ctx.fillRect(20, 20, 50, 60);
    //
    //ctx.fillStyle = 'rgba(0,0,255,0.6)';
    //ctx.fillRect(40, 40, 50, 60);
    //
    //ctx.fillStyle = '#000';
    //var idx;
    //for(idx = 0; idx < canvas.width; idx += 20) {
    //    ctx.fillText(idx, idx, 10); //text, top of text, left of text
    //}
    //
    //for(idx = 0; idx < canvas.height; idx += 20) {
    //    ctx.fillText(idx, 0, idx); //text, top of text, left of text
    //}

    //current gamestate
    var gameState;

    //create a gamestate object
    function newGameState() {
        return {
            ball: {
                left: Math.random() * canvas.width,
                top: Math.random() * canvas.height,
                width: 10,
                height: 10,
                vectorX: 1,
                vectorY: 1,
                velocity: 6
            },
            paddle: {
                left: 20,
                top: 0,
                width: 10,
                height: canvas.height / 4
            },
            lastTimestamp: performance.now()
        }
    } //newGameState()

    //render current game state to canvas element
    function render() {
        //clears the entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var ball = gameState.ball;

        //begins path
        ctx.beginPath();

        //draws arc
        ctx.arc(ball.left + (ball.width / 2),
            ball.top + (ball.height / 2),
            ball.width / 2, 0, 2 * Math.PI);

        //fills circle
        ctx.fill();

        //render paddle
        var paddle = gameState.paddle;
        ctx.fillRect(paddle.left, paddle.top, paddle.width, paddle.height);
    } //render()

    //advance the animation by one step
    var acceleration = 0.25;
    function step() {
        var ball = gameState.ball;

        //move the ball
        ball.left += ball.vectorX * ball.velocity;
        ball.top += ball.vectorY * ball.velocity;

        if (ball.left <= 0 || ball.left + ball.width >= canvas.width) {
            ball.vectorX = -ball.vectorX;
            ball.velocity += acceleration;
        }

        if (ball.top <= 0 || ball.top + ball.height >= canvas.height) {
            ball.vectorY = -ball.vectorY;
            ball.velocity += acceleration;
        }

        var paddle = gameState.paddle;
        if (ball.left <= paddle.left + paddle.width) {
            if (ball.top + ball.height >= paddle.top
                && ball.top <= paddle.top + paddle.height) {
                ball.vectorX = -ball.vectorX;
                paddle.height = paddle.height / 1.05;
            } else {
                //game over
                ctx.font = '20px Helvetica Neue';
                var message = 'Game Over';

                //get width of text
                var metrics = ctx.measureText('Game Over');

                ctx.fillText(message, (canvas.width - metrics.width)/2,
                    (canvas.height - 20)/2);

                return false;
            }
        }

        if (ball.velocity <= 0 || ball.velocity >= 1000) {
            acceleration = -acceleration;
        }

        return true;

    } //step()

    //advance the animation and redraw
    function animate(timestamp) {
        var keepGoing = true;
        render();

        //advance animation if 16ms have passed
        if (timestamp - gameState.lastTimestamp > 16) {
            keepGoing = step();
            gameState.lastTimestamp = timestamp;
        }

        //if game is still going, keep animating
        if (keepGoing) {
            requestAnimationFrame(animate);
        }
    } //animate

    document.addEventListener('mousemove', function(evt) {
        var canvasY = evt.clientY - canvas.offsetTop;
        var paddle = gameState.paddle;
        paddle.top = canvasY - (paddle.height/2);
    });

    //create a new game state
    gameState = newGameState();

    //ask the browser to animate as quickly as possible
    requestAnimationFrame(animate);
});
