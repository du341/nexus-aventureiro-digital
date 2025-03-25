import { gameData } from './gameData.js';

const storyText = document.getElementById('story-text');
const choicesDiv = document.getElementById('choices');
const restartBtn = document.getElementById('restart-btn');
const pointsSpan = document.getElementById('points');
const feedbackDiv = document.getElementById('feedback');
const audioPositive = document.getElementById('audio-positive');
const audioNegative = document.getElementById('audio-negative');
const baloon = document.getElementById('dica-baloon');

let minigame = {
    word: '',
    attempts: 0,
    maxAttempts: 5
};

const faseBackgrounds = {
    fase1: 'img/fase1.jpeg',
    fase2A: 'img/fase2A.webp',
    fase2B: 'img/fase2B.webp',
    fase3A: 'img/fase3A.webp',
    fase3B: 'img/fase3B.webp',
    fase3C: 'img/fase3C.webp'
};

const enigmas = [
    {
        pergunta: "Tenho quatro patas e não ando, tenho costas e não me deito. Quem sou eu?",
        resposta: "cadeira",
        dica: "Está sempre em casa ou no escritório."
    },
    {
        pergunta: "Sou cheio de buracos, mas consigo segurar água. Quem sou eu?",
        resposta: "esponja",
        dica: "Está na cozinha ou no banho."
    },
    {
        pergunta: "Tem dentes mas não morde. Quem sou eu?",
        resposta: "pente",
        dica: "Você usa no cabelo."
    }
];

function mostrarFeedback(pontos) {
    feedbackDiv.className = "feedback-show";
    feedbackDiv.textContent = pontos > 0 ? `+${pontos} pontos` : `${pontos} pontos`;
    feedbackDiv.classList.add(pontos > 0 ? "feedback-positive" : "feedback-negative");
    if (pontos > 0) {
        audioPositive.play();
    } else {
        audioNegative.play();
    }
    setTimeout(() => {
        feedbackDiv.className = "";
        feedbackDiv.textContent = "";
    }, 1500);
}

function startGame() {
    gameData.points = 0;
    gameData.currentPhase = "fase1";
    updateUI();
}

function updateUI() {
    const phase = gameData.fases[gameData.currentPhase] || {};

    // Troca o background automaticamente pela fase
    if (faseBackgrounds[gameData.currentPhase]) {
        document.body.style.backgroundImage = `url('${faseBackgrounds[gameData.currentPhase]}')`;
    }

    if (gameData.currentPhase === "minigame_duelo") {
        iniciarDueloPalavras();
        return;
    }

    storyText.textContent = phase.text || `${gameData.finais[gameData.currentPhase]} Pontuação final: ${gameData.points} pontos!`;
    choicesDiv.innerHTML = '';

    if (phase.options) {
        phase.options.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option.text;
            btn.onclick = () => {
                if (option.points !== undefined) {
                    gameData.points += option.points;
                    mostrarFeedback(option.points);
                }
                gameData.currentPhase = option.next;
                updateUI();
            };
            choicesDiv.appendChild(btn);
        });
    } else {
        restartBtn.style.display = 'block';
    }

    pointsSpan.textContent = gameData.points;
}

function iniciarDueloPalavras() {
    const enigmaSorteado = enigmas[Math.floor(Math.random() * enigmas.length)];
    minigame.word = enigmaSorteado.resposta.toLowerCase();
    minigame.attempts = 0;

    storyText.innerHTML = `
        "${enigmaSorteado.pergunta}"
        <br><br>A IA Guardiã propõe um desafio simples:
        <br><br>Responda a palavra correta (5 tentativas).
    `;

    baloon.style.display = 'block';
    baloon.textContent = "💡 Dica: " + enigmaSorteado.dica;

    criarInputTentativa();
}

function criarInputTentativa() {
    choicesDiv.innerHTML = `
        <input type="text" id="guess" placeholder="Digite sua tentativa">
        <button id="guess-btn">Tentar</button>
        <p>Tentativas restantes: ${minigame.maxAttempts - minigame.attempts}</p>
    `;

    document.getElementById('guess-btn').addEventListener('click', () => {
        const palpite = document.getElementById('guess').value.toLowerCase();
        minigame.attempts++;

        if (palpite === minigame.word) {
            esconderBaloon();
            gameData.points += 10;
            mostrarFeedback(10);
            storyText.textContent = "Você venceu o desafio! +10 pontos.";
            gameData.currentPhase = "fase3A";
            setTimeout(updateUI, 1500);
        } else if (minigame.attempts >= minigame.maxAttempts) {
            esconderBaloon();
            storyText.textContent = "Você falhou! A IA detecta sua presença.";
            gameData.currentPhase = "fase3B";
            setTimeout(updateUI, 1500);
        } else {
            alert("Errado! Tente novamente.");
            criarInputTentativa();
        }
    });
}

function esconderBaloon() {
    baloon.style.display = 'none';
}

restartBtn.addEventListener('click', () => {
    restartBtn.style.display = 'none';
    startGame();
});

startGame();