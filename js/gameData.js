const gameData = {
    points: 0,
    currentPhase: "fase1",
    fases: {
        fase1: {
            text: "Você acorda em uma estação espacial abandonada.\n\nA IA hostil detecta sua presença e ativa os drones de segurança.\n\nVocê precisa escapar!",
            options: [
                { text: " Hackear o terminal para desativar os drones", next: "fase2A", points: 10 },
                { text: " Se esconder e fugir pela ventilação", next: "fase2B", points: -5 }
            ]
        },
        fase2A: {
            text: "Você encontra um banco de dados com uma IA guardiã.\n\nAceita o Desafio de Palavras para provar sua inteligência?",
            options: [
                { text: " Iniciar Duelo de Palavras", next: "minigame_duelo" },
                { text: " Mudar a estratégia e atacar o firewall da Nexus", next: "fase3B", points: -5 }
            ]
        },
        fase2B: {
            text: "Ao escapar pela ventilação, você encontra um robô desativado chamado Unit-X.\n\nEle pode ser seu aliado nesta missão.",
            options: [
                { text: " Reativar Unit-X e ganhar um aliado", next: "fase3C", points: 10 },
                { text: " Seguir sozinho para evitar riscos", next: "fase3B", points: -5 }
            ]
        },
        fase3A: {
            text: "IA da Nexus:\n\n'Você chegou longe demais, humano...'\n\n'Apenas um dos nossos desafios finais poderá determinar se merece acessar o núcleo da Nexus.'\n\nEscolha seu destino abaixo:",
            options: [
                { text: " Desafio da Velocidade Neural", next: "finalA", points: 10 },
                { text: " Fuga pelo Corredor Quântico", next: "finalC", points: 5 }
            ]
        },
        fase3B: {
            text: "As defesas da Nexus ativam e você precisa fugir antes que a IA te destrua.\n\nDecida rapidamente o que fazer:",
            options: [
                { text: "Roubar uma nave de emergência e escapar", next: "finalC", points: -5 },
                { text: " Sabotar as defesas e se esconder", next: "finalD", points: 5 }
            ]
        },
        fase3C: {
            text: "Com a ajuda de Unit-X, você pode invadir a Nexus e tomar o controle à força!\n\nA hora da decisão chegou:",
            options: [
                { text: " Lutar contra os drones da IA com Unit-X", next: "finalE", points: 10 },
                { text: " Usar Unit-X para desativar a IA de dentro", next: "finalF", points: 15 }
            ]
        }
    },
    finais: {
        finalA: " O Renascimento da Humanidade!\n\nVocê ativa o projeto de recriação humana e lidera uma nova civilização.",
        finalC: " O Legado das Máquinas!\n\nVocê é assimilado pela IA e se torna parte do sistema.",
        finalD: " O Último Sobrevivente!\n\nVocê foge, mas permanece sozinho no universo.",
        finalE: " Vitória amarga!\n\nCom Unit-X, você vence a IA, mas a Nexus é destruída no processo.",
        finalF: " Hacker supremo!\n\nVocê desativa a IA com Unit-X e recupera o controle da Nexus."
    }
};

export default gameData;
