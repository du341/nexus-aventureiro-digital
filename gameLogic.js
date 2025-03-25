// Importa os dados do jogo e funções utilitárias de outros arquivos
import { gameData } from './gameData.js';
import { mostrarFeedback, iniciarDueloPalavras } from './utils.js';

// Função para iniciar o jogo
export function startGame() {
    gameData.points = 0; // Reseta os pontos do jogador
    gameData.currentPhase = "fase1"; // Define a fase inicial
    updateUI(); // Atualiza a interface do jogo
}

// Função para atualizar a interface do jogo com base na fase atual
export function updateUI() {
    const phase = gameData.fases[gameData.currentPhase] || {}; // Obtém os dados da fase atual

    // Troca o background automaticamente pela fase, se definido
    if (faseBackgrounds[gameData.currentPhase]) {
        document.body.style.backgroundImage = `url('${faseBackgrounds[gameData.currentPhase]}')`;
    }

    // Verifica se a fase atual é o minigame de duelo de palavras
    if (gameData.currentPhase === "minigame_duelo") {
        iniciarDueloPalavras(); // Inicia o minigame
        return; // Sai da função para evitar executar o restante do código
    }

    // Atualiza o texto da história ou exibe o final do jogo
    storyText.textContent = phase.text || `${gameData.finais[gameData.currentPhase]} Pontuação final: ${gameData.points} pontos!`;
    choicesDiv.innerHTML = ''; // Limpa as opções de escolha

    // Verifica se a fase tem opções de escolha
    if (phase.options) {
        phase.options.forEach(option => {
            const btn = document.createElement('button'); // Cria um botão para cada opção
            btn.textContent = option.text; // Define o texto do botão
            btn.onclick = () => { // Adiciona evento de clique ao botão
                if (option.points !== undefined) { // Verifica se a opção concede pontos
                    gameData.points += option.points; // Atualiza os pontos do jogador
                    mostrarFeedback(option.points); // Mostra o feedback de pontos
                }
                gameData.currentPhase = option.next; // Atualiza a fase atual
                updateUI(); // Atualiza a interface do jogo
            };
            choicesDiv.appendChild(btn); // Adiciona o botão à div de escolhas
        });
    } else {
        restartBtn.style.display = 'block'; // Mostra o botão de reiniciar, se não houver opções
    }

    pointsSpan.textContent = gameData.points; // Atualiza a exibição dos pontos do jogador
}