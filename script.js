
                    // REFERENCING THE ELEMENTS


const gameContainer = document.getElementById('game-container');

let pltfrmsSpikesCont = document.getElementById('platforms-spikes-container');


const ball = document.querySelector('.ball');

const topSpikes = document.querySelector('.top-spikes');


const lifesNmbr = document.querySelector('.life-number');

const scoreNmbr = document.querySelector('.score-number');

const savedScore = document.querySelector('.score-num');

const savedHiScore = document.querySelector('.hi-score-num');

const savedHiScoreEnd = document.querySelector('.hi-score-end-num');


const startGameCont = document.getElementById('start-game-cont');

const loseLifeContinue = document.getElementById('lose-life-continue');

const gameOverCont = document.getElementById('game-over-container');


// Saved hi-score
savedHiScore.innerText = 0 + +localStorage.getItem('rapid-ball-hi-score')


                    // GAMEPLAY


// Count Score true if ball falls or false if touches a platform
let countScore;

// Objects Creator
let myBall = {
    y:50, // top
    x: 512, // left
    height:60,
    width:60,
}

let myPlatform = {
    y:618, // top
    x: 0, // left
    height:55,
    width: 128, // 256 - 192 - 128 
}

let mySpikes = {
    y:618, // top
    x: 0,// left
    height:55,
    width:290,
}

ball.style.top = myBall.y + 'px';
ball.style.left = myBall.x + 'px';

ball.style.display = 'none'


// IDs ARRAY TO CANCEL ANIMATIONS
let idsArray = []
let timeoutArray = [];


            // GAMEPLAY INITIAL SPEEDS DIFFICULTY

// Change the difficulty every N seconds
let diffTimer = 5000

// Timer to throw the platforms and the spikes
let launcherSpeed = 2200;
// vSlow-2200 slow=1600 med=1000 fast=600 vFast=400

// Ball Left & Right Speed
let moveSpeed = 4;
// vSlow=4 Slow=8 med=10 fast=14 vFast=18

// Speed of the platforms, spikes and ball fall.
let speed = 1;
// vSlow=1 slow=2 med=4 fast=6 vFast=8

// Ball Height IMPORTANT to rise this number as the speed rises. Otherwise the ball trasspasses some platforms
let BH = 6;
// vSlow=6 slow=8 med=10 fast=12 vFast=16


                // BALL L & R MOVEMENT


//  Animation Left
let idL;
function moveL() {
    cancelAnimationFrame(idL)
    idL = requestAnimationFrame(moveL);
    // Adding The IDs to the array
    idsArray.push(idL)
        
    if (myBall.x > 0) {
        myBall.x -= moveSpeed+1;
        ball.style.left = myBall.x + 'px'
    } else {
        cancelAnimationFrame(idL)
    }
}

// Animation Right
let idR;
function moveR() {
    cancelAnimationFrame(idR)
    idR = requestAnimationFrame(moveR);
    // Adding The IDs to the array
    idsArray.push(idR)
    if (myBall.x < 1024 - myBall.width) {
        myBall.x += moveSpeed+1;
        ball.style.left = myBall.x + 'px';
    } else {
        cancelAnimationFrame(idR)
    }
}


                // PLAYER CONTROLLERS


// Move left
let movePlayerL = (e) => {
    if (e.key === 'a') {
        window.addEventListener('keydown', movePlayerR);
        moveL();
        window.removeEventListener('keydown', movePlayerL);
    }
}

window.addEventListener('keydown', movePlayerL);

// Move Right
let movePlayerR = (e) => {
    if (e.key === 'd') {
        window.addEventListener('keydown', movePlayerL);
        moveR();
        window.removeEventListener('keydown', movePlayerR);
    }
}

window.addEventListener('keydown', movePlayerR);

// Stop Player Movement
let stopPlayer = (e) => {
    if (e.key === 'a') {
        window.addEventListener('keydown', movePlayerL);
        cancelAnimationFrame(idL);
    } else if (e.key === 'd') {
        window.addEventListener('keydown', movePlayerR);
        cancelAnimationFrame(idR);
    }
}

window.addEventListener('keyup', stopPlayer);


                // BALL FALLS


let idD;
function ballFalls() {
    idD = requestAnimationFrame(ballFalls)
    // Adding The IDs to the array
    idsArray.push(idD)
    if (myBall.y < 618) {
        myBall.y += speed;
        ball.style.top = myBall.y + 'px'
    } else {
        stopGame()
    }
    topSpikesCollision()
    scoreCounter()
    countScore = true
    bonusScoreLife()
}


                // CREATING THE PLATFORMS


let idU;
function platformCreator() {
    
    let platform = document.createElement('div');
    platform.classList.add('platform');
    pltfrmsSpikesCont.append(platform)
    
    platform.style.width = myPlatform.width + 'px';
    
    // Platform Random LEFT/HOR Position
    rndmWdthPstn()
    function rndmWdthPstn() {
        
        let rndmNmbr = () => {
            return Math.floor(Math.random() * (1024 - myPlatform.width))
        }
                
        let widthArray = [];
        for (let i = 0; i < (1024 - myPlatform.width); i++) {
             widthArray.push(i)
        }
        // Platform position
        platform.style.left = widthArray[rndmNmbr()] + 'px';
    }

    
                // ANIMATE PLATFORM

    
    // Platform Initial TOP/VER Position
    let Tp = 618;
    speed; // Per Pixel
    idU;
    animate()
    function animate() {
        idU = requestAnimationFrame(animate)
        // Adding The IDs to the array
        idsArray.push(idU)
        if (Tp > 0 - myPlatform.height) {
            Tp -= speed;
            platform.style.top = Tp + 'px';
        } else {
            cancelAnimationFrame(idU);
            platform.remove();
        }
        platformCollision();
    }
}


                // CREATING THE SPIKES


let idUP;
function spikesCreator() {
    
    let spikes = document.createElement('div');
    spikes.classList.add('spikes');
    pltfrmsSpikesCont.append(spikes);
    spikes.innerText = '^^^^^';
    
    // Spikes Random LEFT/HOR Position
    rndmWdthPstn()
    function rndmWdthPstn() {
        
        let rndmNmbr = () => {
            return Math.floor(Math.random() * (1024 - mySpikes.width))
        }
                
        let widthArray = [];
        for (let i = 0; i < (1024 - mySpikes.width); i++) {
             widthArray.push(i)
        }
        // Spikes position
        spikes.style.left = widthArray[rndmNmbr()] + 'px';
    }

    
                // ANIMATE SPIKES

    
    // Platform Initial TOP/VER Position
    let Tp = 618;
    speed; // Per Pixel
    idUP;
    animate()
    function animate() {
        idUP = requestAnimationFrame(animate)
        // Adding The IDs to the array
        idsArray.push(idUP)
        if (Tp > 0 - mySpikes.height) {
            Tp -= speed;
            spikes.style.top = Tp + 'px';
        } else {
            cancelAnimationFrame(idUP);
            spikes.remove();
        }
        spikesCollision(spikes)
    }
}


            // LAUNCHING PLATFORMS & SPIKES RANDOMLY


let timeout;
function platformsSpikesLauncher() {
    
    timeout = setTimeout(runThis, launcherSpeed);
    timeoutArray.push(timeout)
    function runThis() {
        
        function rndmNum() {
        return Math.ceil(Math.random() * 100);
        }
        
        if (rndmNum() < 10) {
                spikesCreator()
        } else if (rndmNum() < 40) {
                platformCreator()
        } else if (rndmNum() < 50) {
                spikesCreator()
        } else if (rndmNum() < 80) {
                platformCreator()
        } else if (rndmNum() < 90) {
                spikesCreator()
        } else {
                platformCreator()
        }
        
    resetCountdown()
    }
}

// Resets The Count
function resetCountdown() {
// Clears the timer to 0 
    clearTimeout(timeout);
// Restarts the timer
    platformsSpikesLauncher();
}


                    // COLLISION DETECTION


function platformCollision() {

    let platforms = document.querySelectorAll('.platform')

    platforms.forEach(platform => {

        let Pltfrm = {
            y:parseInt(getComputedStyle(platform).top),
            x:parseInt(getComputedStyle(platform).left),
            height:parseInt(getComputedStyle(platform).height),
            width:parseInt(getComputedStyle(platform).width)
        }

        let Ball = {
            y:parseInt(getComputedStyle(ball).top),
            x:parseInt(getComputedStyle(ball).left),
            height:parseInt(getComputedStyle(ball).height),
            width:parseInt(getComputedStyle(ball).width)
        }
        
        // Walk Over The Platform
        if (Ball.y + Ball.height-BH < Pltfrm.y &&
            Ball.y + Ball.height >= Pltfrm.y &&
            Ball.x > Pltfrm.x - Ball.width &&
            Ball.x < Pltfrm.x + Pltfrm.width) {
            
            myBall.y -= speed *2
            ball.style.top = myBall.y + 'px';
            countScore = false
        } else // Dont Trasspass LeftSide
        if (Ball.y < Pltfrm.y + Pltfrm.height &&
            Ball.y + Ball.height > Pltfrm.y &&
            Ball.x < Pltfrm.x &&
            Ball.x + Ball.width > Pltfrm.x ) {
            
            myBall.x -= moveSpeed *2
            ball.style.left = myBall.x + 'px';
        } else // Dont Trasspass RightSide
        if (Ball.y < Pltfrm.y + Pltfrm.height &&
            Ball.y + Ball.height > Pltfrm.y &&
            Ball.x < Pltfrm.x + Pltfrm.width &&
            Ball.x + Ball.width > Pltfrm.x + Pltfrm.width) {
            
            myBall.x += moveSpeed *2
            ball.style.left = myBall.x + 'px';
        }
    })
}
// Spikes Kills The Ball
function topSpikesCollision() {
    // Top Spikes;
    let topSpikesProp = {
        y:parseInt(getComputedStyle(topSpikes).top),
        height:parseInt(getComputedStyle(topSpikes).height),
    }

    // Ball
    let Ball = {
        y:parseInt(getComputedStyle(ball).top),
        x:parseInt(getComputedStyle(ball).left),
        height:parseInt(getComputedStyle(ball).height),
        width:parseInt(getComputedStyle(ball).width)
    }
    
    // Ball Hits the top spikes
    if (Ball.y < topSpikesProp.y + topSpikesProp.height) {
        stopGame()
    }
}

// Spikes Kills The Ball
function spikesCollision(spikes) {
    spikes;
    
    let Spikes = {
        y:parseInt(getComputedStyle(spikes).top),
        x:parseInt(getComputedStyle(spikes).left),
        height:parseInt(getComputedStyle(spikes).height),
        width:parseInt(getComputedStyle(spikes).width)
    }
    
    let Ball = {
        y:parseInt(getComputedStyle(ball).top),
        x:parseInt(getComputedStyle(ball).left),
        height:parseInt(getComputedStyle(ball).height),
        width:parseInt(getComputedStyle(ball).width)
    }

    // Ball Hits The Rising Spikes
    if (Ball.y < Spikes.y &&
        Ball.y + Ball.height > Spikes.y &&
        Ball.x > Spikes.x - Ball.width &&
        Ball.x < Spikes.x + Spikes.width) {
        
        stopGame()
    }
}


                    // START GAME


window.addEventListener('keydown', startGameBttn)
// Start Game Button
function startGameBttn(e) {
    if (e.key === 'Enter') {
        window.removeEventListener('keydown', startGameBttn)
        startGame();
    }
}


// Starts Gameplay 
function startGame() {
    // Hides Initial UI
    startGameCont.style.display = 'none';
    // Ball Appears
    ball.style.display = 'unset'
    // Ball position
    myBall.y = 50;
    ball.style.top = myBall.y + 'px';
    // Ball Starts falling and platform and spikes are launched
    ballFalls();
    platformCreator();
    platformsSpikesLauncher();

    changeDiff()
    
}


                    // RESET GAME 


function restartGameBttn(e) {
    if (e.key === 'Enter') {
    window.removeEventListener('keydown', restartGameBttn)
    // Restart the game but keeping the score until life reaches zero
    restartGame()
    }
}

function restartGame() {
    // Hides continue
    loseLifeContinue.style.display = 'none';
    // Selecting all the platforms and spikes
    let platforms = document.querySelectorAll('.platform');
    let spikes = document.querySelectorAll('.spikes');

    // Deleting the displayed platforms 
    platforms.forEach(platform => {
        platform.style.display = 'none'
        platform.remove()
    })
    // Deleting the displayed spikes
    spikes.forEach(spike => {
        spike.style.display = 'none'
        spike.remove()
    })
    startGame()
}


                    // STOP GAME


function stopGame() {
    // Hides ball
    ball.style.display = 'none';
    // Shows continue
    loseLifeContinue.style.display = 'flex';
    // Stop Platforms and Spikes
    idsArray.forEach(id=>{
        cancelAnimationFrame(id)
    })
    // Stop Platforms-Spikes Launcher
    timeoutArray.forEach(timeout=>{
        clearTimeout(timeout)
    })
    
    // Substract one Life
    lifesNmbr.innerText--
    let life = lifesNmbr.innerText
    // Checks the lifes
    lifeChecker(life)
    
    // Adds Reset Button
    window.addEventListener('keydown', restartGameBttn)       
}


                    // GAME OVER


// Checks the life
function lifeChecker(life) {
    if (life == 0) {
        gameOver()
    }
}
// Game Over 
function gameOver() {
    // Hides & quits ball
    ball.style.display = 'none';
    ball.remove()
    // Hides continue
    loseLifeContinue.style.display = 'none';
    // Shows Game Over
    gameOverCont.style.display = 'flex';
    
    // Stop Platforms and Spikes
    idsArray.forEach(id=>{
        cancelAnimationFrame(id)
    })
    // Stop Platforms-Spikes Launcher
    timeoutArray.forEach(timeout=>{
        clearTimeout(timeout)
    })
    // Adds reset game enter button
    window.addEventListener('keydown', resetGameBttn)

    
}

// Start Game Button
function resetGameBttn(e) {
    if (e.key === 'Enter') {
        window.removeEventListener('keydown', resetGameBttn)
        window.location.reload()
    }
}


                // CHANGING GAME DIFFICULTY


function changeDiff() {
    idTo = setTimeout(difficulty, diffTimer)
    timeoutArray.push(idTo)    
    function difficulty() {
        // Changing the level of difficulty
        // Initial Launcher Speed 2200
        if (launcherSpeed > 1200) {       // vEasy
            launcherSpeed -= 200; 
            moveSpeed += 1;
            speed += .25
            BH += .5;
    
            myPlatform.width = 128;
            
        } else if (launcherSpeed > 600) { // Easy
            launcherSpeed -= 150; 
            moveSpeed += 1;
            speed += .5;
            BH += .5;
    
            myPlatform.width = 160;
            
        } else if (launcherSpeed > 450) { // Normal
            launcherSpeed -= 36; 
            moveSpeed += 1.5;
            speed += .5;
            BH += .5;
    
            myPlatform.width = 192;
            
        } else if (launcherSpeed > 300) { // Hard
            launcherSpeed -= 35; 
            moveSpeed += 1.5;
            speed += .5;
            BH += 1;
    
            myPlatform.width = 224;
            
        } else {                         // vHard
            launcherSpeed = 300;
            moveSpeed = 20;
            speed = 8;
            BH = 16;

            myPlatform.width = 256
        }
        
        // Reset Timer
        clearTimeout(idTo)
        changeDiff()
    }
}


                // ADDING SCORES


let score = 0
function scoreCounter() {
        if (countScore == true) { 
            score++
            const format = scoreFormat(score)
            scoreNmbr.innerText = format;
            savingScores()
        }
}

function scoreFormat(ptsUnit) {
     return ptsUnit < 10 ? '0000000'+ptsUnit:
            ptsUnit < 100 ? '000000'+ptsUnit:
            ptsUnit < 1000 ? '00000'+ptsUnit:
            ptsUnit < 10000 ? '0000'+ptsUnit:
            ptsUnit < 100000 ? '000'+ptsUnit:
            ptsUnit < 1000000 ? '00'+ptsUnit:
            ptsUnit < 10000000 ? '0'+ptsUnit:
                                     ptsUnit;
}


                // SAVING SCORES


function savingScores() {
    sessionStorage.setItem('rapid-ball-score', parseInt(scoreNmbr.innerText));
    savedScore.innerText = (+sessionStorage.getItem('rapid-ball-score'))

    if (+savedScore.innerText > savedHiScore.innerText) {
        localStorage.setItem('rapid-ball-hi-score', +savedScore.innerText)
    }

    savedHiScore.innerText = 0 + +localStorage.getItem('rapid-ball-hi-score');
    savedHiScoreEnd.innerText = 0 + +savedHiScore.innerText
}


            // WINNING LIFES


let lifePlus = 1995
function bonusScoreLife() {
    if ((parseInt(scoreNmbr.innerText / lifePlus)) === 1) {
        lifesNmbr.innerText++
        lifePlus+=1995
    }
}



