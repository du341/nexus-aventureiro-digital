// Importa os dados do jogo de outro arquivo
import gameData from './gameData.js';

// Seleciona elementos HTML que serão manipulados no jogo
const storyText = document.getElementById('story-text');
const choicesDiv = document.getElementById('choices');
const restartBtn = document.getElementById('restart-btn');
const pointsSpan = document.getElementById('points');
const feedbackDiv = document.getElementById('feedback');
const audioPositive = document.getElementById('audio-positive');
const audioNegative = document.getElementById('audio-negative');
const baloon = document.getElementById('dica-baloon');

// Objeto para controlar o minigame de palavras
let minigame = {
    word: '', // Palavra correta do enigma
    attempts: 0, // Tentativas feitas pelo jogador
    maxAttempts: 5 // Número máximo de tentativas
};

// Define os fundos de tela para cada fase
const faseBackgrounds = {
    fase1: 'img/fase1.jpeg',
    fase2A: 'img/fase2A.webp',
    fase2B: 'img/fase2B.webp',
    fase3A: 'img/fase3A.webp',
    fase3B: 'img/fase3B.webp',
    fase3C: 'img/fase3C.webp'
};

// Lista de enigmas para o minigame
const enigmas = [
    // Cada enigma tem uma pergunta, resposta e dica
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

// Mostra um feedback visual e sonoro baseado nos pontos ganhos ou perdidos
function mostrarFeedback(pontos) {
    feedbackDiv.className = "feedback-show"; // Mostra o feedback
    feedbackDiv.textContent = pontos > 0 ? `+${pontos} pontos` : `${pontos} pontos`; // Exibe os pontos
    feedbackDiv.classList.add(pontos > 0 ? "feedback-positive" : "feedback-negative"); // Define a cor do feedback
    if (pontos > 0) {
        audioPositive.play(); // Toca som positivo
    } else {
        audioNegative.play(); // Toca som negativo
    }
    setTimeout(() => {
        feedbackDiv.className = ""; // Esconde o feedback após 1,5 segundos
        feedbackDiv.textContent = "";
    }, 1500);
}

// Inicia o jogo, resetando os pontos e a fase atual
function startGame() {
    gameData.points = 0; // Reseta os pontos
    gameData.currentPhase = "fase1"; // Define a fase inicial
    updateUI(); // Atualiza a interface do jogo
}

// Atualiza a interface do jogo com base na fase atual
function updateUI() {
    const phase = gameData.fases[gameData.currentPhase] || {}; // Obtém os dados da fase atual

    // Troca o fundo da página de acordo com a fase
    if (faseBackgrounds[gameData.currentPhase]) {
        document.body.style.backgroundImage = `url('${faseBackgrounds[gameData.currentPhase]}')`;
    }

    // Verifica se a fase atual é o minigame de palavras
    if (gameData.currentPhase === "minigame_duelo") {
        iniciarDueloPalavras(); // Inicia o minigame
        return;
    }

    // Atualiza o texto da história e limpa as opções
    storyText.textContent = phase.text || `${gameData.finais[gameData.currentPhase]} Pontuação final: ${gameData.points} pontos!`;
    choicesDiv.innerHTML = '';

    // Cria botões para as opções da fase
    if (phase.options) {
        phase.options.forEach(option => {
            const btn = document.createElement('button'); // Cria um botão
            btn.textContent = option.text; // Define o texto do botão
            btn.onclick = () => {
                if (option.points !== undefined) {
                    gameData.points += option.points; // Atualiza os pontos
                    mostrarFeedback(option.points); // Mostra o feedback
                }
                gameData.currentPhase = option.next; // Avança para a próxima fase
                updateUI(); // Atualiza a interface
            };
            choicesDiv.appendChild(btn); // Adiciona o botão à interface
        });
    } else {
        restartBtn.style.display = 'block'; // Mostra o botão de reiniciar se não houver opções
    }

    pointsSpan.textContent = gameData.points; // Atualiza a pontuação na interface
}

// Inicia o minigame de palavras
function iniciarDueloPalavras() {
    const enigmaSorteado = enigmas[Math.floor(Math.random() * enigmas.length)]; // Sorteia um enigma
    minigame.word = enigmaSorteado.resposta.toLowerCase(); // Define a palavra correta
    minigame.attempts = 0; // Reseta as tentativas

    // Atualiza o texto da história com o enigma
    storyText.innerHTML = `
        "${enigmaSorteado.pergunta}"
        <br><br>A IA Guardiã propõe um desafio simples:
        <br><br>Responda a palavra correta (5 tentativas).
    `;

    baloon.style.display = 'block'; // Mostra a dica
    baloon.textContent = "💡 Dica: " + enigmaSorteado.dica;

    criarInputTentativa(); // Cria o campo de entrada para o jogador
}

// Cria o campo de entrada para o jogador tentar adivinhar a palavra
function criarInputTentativa() {
    choicesDiv.innerHTML = `
        <input type="text" id="guess" placeholder="Digite sua tentativa">
        <button id="guess-btn">Tentar</button>
        <p>Tentativas restantes: ${minigame.maxAttempts - minigame.attempts}</p>
    `;

    document.getElementById('guess-btn').addEventListener('click', () => {
        const palpite = document.getElementById('guess').value.toLowerCase(); // Obtém o palpite do jogador
        minigame.attempts++; // Incrementa as tentativas

        if (palpite === minigame.word) {
            esconderBaloon(); // Esconde a dica
            gameData.points += 10; // Adiciona pontos
            mostrarFeedback(10); // Mostra feedback positivo
            storyText.textContent = "Você venceu o desafio! +10 pontos."; // Mensagem de vitória
            gameData.currentPhase = "fase3A"; // Avança para a próxima fase
            setTimeout(updateUI, 1500); // Atualiza a interface após 1,5 segundos
        } else if (minigame.attempts >= minigame.maxAttempts) {
            esconderBaloon(); // Esconde a dica
            storyText.textContent = "Você falhou! A IA detecta sua presença."; // Mensagem de falha
            gameData.currentPhase = "fase3B"; // Avança para a próxima fase
            setTimeout(updateUI, 1500); // Atualiza a interface após 1,5 segundos
        } else {
            alert("Errado! Tente novamente."); // Mensagem de erro
            criarInputTentativa(); // Permite nova tentativa
        }
    });
}

// Esconde a dica do balão
function esconderBaloon() {
    baloon.style.display = 'none';
}

// Adiciona evento ao botão de reiniciar para começar o jogo novamente
restartBtn.addEventListener('click', () => {
    restartBtn.style.display = 'none'; // Esconde o botão de reiniciar
    startGame(); // Reinicia o jogo
});

// Inicia o jogo ao carregar o script
startGame();