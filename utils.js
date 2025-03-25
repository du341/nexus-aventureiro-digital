// Importa os dados do jogo de outro arquivo
import { gameData } from './gameData.js';

// Seleciona elementos do DOM (HTML) para manipulação
const feedbackDiv = document.getElementById('feedback'); // Div para mostrar feedback de pontos
const audioPositive = document.getElementById('audio-positive'); // Áudio para feedback positivo
const audioNegative = document.getElementById('audio-negative'); // Áudio para feedback negativo
const baloon = document.getElementById('dica-baloon'); // Balão de dica
const storyText = document.getElementById('story-text'); // Texto da história
const choicesDiv = document.getElementById('choices'); // Div para opções de escolha

// Lista de enigmas com perguntas, respostas e dicas
const enigmas = [
    {
        pergunta: "Tenho quatro patas e não ando, tenho costas e não me deito. Quem sou eu?",
        resposta: "cadeira", // Resposta correta
        dica: "Está sempre em casa ou no escritório." // Dica para ajudar o jogador
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

// Objeto que controla o estado do minigame
let minigame = {
    word: '', // Palavra correta do enigma
    attempts: 0, // Número de tentativas feitas
    maxAttempts: 5 // Número máximo de tentativas permitidas
};

// Função para mostrar feedback de pontos ao jogador
export function mostrarFeedback(pontos) {
    feedbackDiv.className = "feedback-show"; // Mostra a div de feedback
    feedbackDiv.textContent = pontos > 0 ? `+${pontos} pontos` : `${pontos} pontos`; // Define o texto do feedback
    feedbackDiv.classList.add(pontos > 0 ? "feedback-positive" : "feedback-negative"); // Aplica a classe de estilo correspondente
    if (pontos > 0) {
        audioPositive.play(); // Toca áudio positivo
    } else {
        audioNegative.play(); // Toca áudio negativo
    }
    setTimeout(() => {
        feedbackDiv.className = ""; // Esconde o feedback após 1,5 segundos
        feedbackDiv.textContent = "";
    }, 1500);
}

// Função para iniciar o minigame de duelo de palavras
export function iniciarDueloPalavras() {
    const enigmaSorteado = enigmas[Math.floor(Math.random() * enigmas.length)]; // Sorteia um enigma aleatório
    minigame.word = enigmaSorteado.resposta.toLowerCase(); // Define a palavra correta do enigma
    minigame.attempts = 0; // Reseta o número de tentativas

    // Atualiza o texto da história com o enigma
    storyText.innerHTML = `
        "${enigmaSorteado.pergunta}"
        <br><br>A IA Guardiã propõe um desafio simples:
        <br><br>Responda a palavra correta (5 tentativas).
    `;

    baloon.style.display = 'block'; // Mostra o balão de dica
    baloon.textContent = "💡 Dica: " + enigmaSorteado.dica; // Exibe a dica do enigma

    criarInputTentativa(); // Cria o campo para o jogador digitar sua tentativa
}

// Função para criar o campo de entrada para tentativas
function criarInputTentativa() {
    choicesDiv.innerHTML = `
        <input type="text" id="guess" placeholder="Digite sua tentativa"> <!-- Campo de texto -->
        <button id="guess-btn">Tentar</button> <!-- Botão para enviar tentativa -->
        <p>Tentativas restantes: ${minigame.maxAttempts - minigame.attempts}</p> <!-- Mostra tentativas restantes -->
    `;

    // Adiciona evento de clique no botão de tentativa
    document.getElementById('guess-btn').addEventListener('click', () => {
        const palpite = document.getElementById('guess').value.toLowerCase(); // Lê o valor digitado pelo jogador
        minigame.attempts++; // Incrementa o número de tentativas

        if (palpite === minigame.word) { // Verifica se o palpite está correto
            esconderBaloon(); // Esconde o balão de dica
            gameData.points += 10; // Adiciona 10 pontos ao jogador
            mostrarFeedback(10); // Mostra feedback positivo
            storyText.textContent = "Você venceu o desafio! +10 pontos."; // Atualiza o texto da história
            gameData.currentPhase = "fase3A"; // Avança para a próxima fase
            setTimeout(updateUI, 1500); // Atualiza a interface após 1,5 segundos
        } else if (minigame.attempts >= minigame.maxAttempts) { // Verifica se o jogador usou todas as tentativas
            esconderBaloon();
            storyText.textContent = "Você falhou! A IA detecta sua presença."; // Mensagem de falha
            gameData.currentPhase = "fase3B"; // Define a fase de falha
            setTimeout(updateUI, 1500);
        } else {
            alert("Errado! Tente novamente."); // Mensagem de erro
            criarInputTentativa(); // Permite nova tentativa
        }
    });
}

// Função para esconder o balão de dica
export function esconderBaloon() {
    baloon.style.display = 'none'; // Esconde o balão
}