var btnPedra = document.getElementById('pedra');
var btnPapel = document.getElementById('papel');
var btnTesoura = document.getElementById('tesoura');
// ----------------------------------------------
// Questão 1:
// Implemente o evento de onclick para os outros botões (papel e tesoura)
// ----------------------------------------------
if (btnPedra) {
    btnPedra.onclick = function () {
        var escolhaComputador = obterEscolhaComputador();
        mostrarResultado('pedra', escolhaComputador);
    };
}
if (btnPapel) {
    btnPapel.onclick = function () {
        var escolhaComputador = obterEscolhaComputador();
        mostrarResultado('papel', escolhaComputador);
    };
}
if (btnTesoura) {
    btnTesoura.onclick = function () {
        var escolhaComputador = obterEscolhaComputador();
        mostrarResultado('tesoura', escolhaComputador);
    };
}
function obterEscolhaComputador() {
    var opcoes = ['pedra', 'papel', 'tesoura'];
    return opcoes[Math.floor(Math.random() * opcoes.length)];
}
function mostrarResultado(escolhaUsuario, escolhaComputador) {
    var opcoes = "\nComputador: ".concat(escolhaComputador, " \nVocê: ").concat(escolhaUsuario);
    // ----------------------------------------------
    // Questão 2:
    // Termine de implementar a função mostrarResultado
    // ----------------------------------------------
    if (escolhaUsuario === escolhaComputador) {
        alert("\u00C9 um empate! \n".concat(opcoes));
    }
    if (escolhaUsuario !== escolhaComputador) {
        if ((escolhaUsuario === 'pedra' && escolhaComputador === 'tesoura') ||
            (escolhaUsuario === 'papel' && escolhaComputador === 'pedra') ||
            (escolhaUsuario === 'tesoura' && escolhaComputador === 'papel')) {
            alert("Voc\u00EA ganhou! \n".concat(opcoes));
            return;
        }
        alert("Voc\u00EA perdeu! \n".concat(opcoes));
    }
}
