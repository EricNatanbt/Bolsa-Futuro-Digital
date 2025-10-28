const btnPedra = document.getElementById('pedra');
const btnPapel = document.getElementById('papel');
const btnTesoura = document.getElementById('tesoura');
// ----------------------------------------------
// Questão 1:
// Implemente o evento de onclick para os outros botões (papel e tesoura)
// ----------------------------------------------

if (btnPedra) {
    btnPedra.onclick = () => {
        const escolhaComputador = obterEscolhaComputador();
        mostrarResultado('pedra', escolhaComputador);
    }
}
if (btnPapel) {
    btnPapel.onclick = () => {
        const escolhaComputador = obterEscolhaComputador();
        mostrarResultado('papel', escolhaComputador);
    }
}
if (btnTesoura) {
    btnTesoura.onclick = () => {
        const escolhaComputador = obterEscolhaComputador();
        mostrarResultado('tesoura', escolhaComputador);
    }
}

function obterEscolhaComputador() {
    const opcoes = ['pedra', 'papel', 'tesoura'];
    return opcoes[Math.floor(Math.random() * opcoes.length)];
}

function mostrarResultado(escolhaUsuario: string, escolhaComputador: string) {
    const opcoes = `\nComputador: ${escolhaComputador} \nVocê: ${escolhaUsuario}`;

     // ----------------------------------------------
    // Questão 2:
    // Termine de implementar a função mostrarResultado
    // ----------------------------------------------

    if (escolhaUsuario === escolhaComputador) {
        alert(`É um empate! \n${opcoes}`);
    }
    if (escolhaUsuario !== escolhaComputador) {
        if ((escolhaUsuario === 'pedra' && escolhaComputador === 'tesoura') ||
            (escolhaUsuario === 'papel' && escolhaComputador === 'pedra') ||
            (escolhaUsuario === 'tesoura' && escolhaComputador === 'papel')) {
            alert(`Você ganhou! \n${opcoes}`);
            return;
        }
        alert(`Você perdeu! \n${opcoes}`);
    }
}