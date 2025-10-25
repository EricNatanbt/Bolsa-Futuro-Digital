// Programa simples em TypeScript
function saudacao(nome) {
    return "Ol\u00E1, ".concat(nome, "! Bem-vindo ao TypeScript.");
}
var usuario = "Teste";
var mensagem = saudacao(usuario);
var idade = 19;
console.log(mensagem);
console.log("A idade do usu\u00E1rio \u00E9: ".concat(idade));
