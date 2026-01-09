const clickSound = new Audio('assets/click.mp3');
const winSound = new Audio('assets/win.mp3');
const loseSound = new Audio('assets/lose.mp3');
const drawSound = new Audio('assets/draw.mp3');

clickSound.preload = 'auto';
winSound.preload = 'auto';
loseSound.preload = 'auto';
drawSound.preload = 'auto';

let userChoice = '', computerChoice = '';
let round = 1, totalRounds = 3, userScore = 0, computerScore = 0;
let isWaiting = false;

const levelScreen = document.getElementById('level-screen');
const gameScreen = document.getElementById('game-screen');
const roundInfo = document.getElementById('round-info');
const scoreEl = document.getElementById('score');
const userChoiceEl = document.getElementById('user-choice');
const computerChoiceEl = document.getElementById('computer-choice');
const resultEl = document.getElementById('result');
const finalResultEl = document.getElementById('final-result');
const popup = document.getElementById('popup');
const playAgainBtn = document.getElementById('play-again');
const backLevelsBtn = document.getElementById('back-to-levels'); 

document.querySelectorAll('.level-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        clickSound.play();
        let level = button.textContent.includes('Easy') ? 'easy' :
                    button.textContent.includes('Medium') ? 'medium' : 'hard';
        startGame(level);
    });
});

function startGame(level) {
    levelScreen.classList.remove('active');
    gameScreen.classList.add('active');

    totalRounds = level === 'easy' ? 3 : level === 'medium' ? 5 : 7;

    round = 1; userScore = 0; computerScore = 0; isWaiting = false;
    roundInfo.textContent = `Round ${round}`;
    scoreEl.textContent = `You: ${userScore} | Computer: ${computerScore}`;
    resultEl.textContent = 'Make your move!';
    userChoiceEl.textContent = '❓';
    computerChoiceEl.textContent = '❓';

    enableChoiceButtons();
}

const choices = ['rock', 'paper', 'scissors'];

choices.forEach(choice => {
    document.getElementById(choice).addEventListener('click', () => {
        if(isWaiting) return;
        isWaiting = true;
        clickSound.play();
        userChoice = choice;
        userChoiceEl.textContent = getEmoji(choice);
        computerChoiceEl.textContent = '❓';
        resultEl.textContent = 'Computer choosing...';

        setTimeout(() => { playRound(); isWaiting = false; }, 2000);
    });
});

function playRound() {
    computerChoice = choices[Math.floor(Math.random() * choices.length)];
    computerChoiceEl.textContent = getEmoji(computerChoice);

    let result = '';
    if(userChoice === computerChoice) {
        result = 'Draw!';
        drawSound.play();
        resultEl.style.color = '#f1c40f';
    } else if(
        (userChoice==='rock' && computerChoice==='scissors') ||
        (userChoice==='paper' && computerChoice==='rock') ||
        (userChoice==='scissors' && computerChoice==='paper')
    ) {
        result='You Win!';
        winSound.play();
        userScore++;
        resultEl.style.color='#2ecc71';
    } else {
        result='You Lose!';
        loseSound.play();
        computerScore++;
        resultEl.style.color='#e74c3c';
    }

    resultEl.textContent = result;
    scoreEl.textContent = `You: ${userScore} | Computer: ${computerScore}`;

    if(round < totalRounds) {
        round++; 
        roundInfo.textContent = `Round ${round}`;
    } else {
        disableChoiceButtons(); 
        setTimeout(showFinalResult,2000);
    }
}

function disableChoiceButtons() { choices.forEach(c => document.getElementById(c).disabled = true); }
function enableChoiceButtons() { choices.forEach(c => document.getElementById(c).disabled = false); }

function showFinalResult() {
    let finalText = userScore > computerScore ? '🎉 You Win the Game!' :
                    userScore < computerScore ? '💀 You Lose the Game!' : '🤝 It\'s a Draw!';
    finalResultEl.textContent = finalText;
    popup.classList.add('active');
}

playAgainBtn.addEventListener('click', () => {
    clickSound.play();
    popup.classList.remove('active');
    startGame(totalRounds===3?'easy':totalRounds===5?'medium':'hard');
});

backLevelsBtn.addEventListener('click', () => {
    clickSound.play();
    popup.classList.remove('active');
    gameScreen.classList.remove('active');
    levelScreen.classList.add('active');
});

function getEmoji(choice){ return choice==='rock'?'✊':choice==='paper'?'✋':'✌️'; }
