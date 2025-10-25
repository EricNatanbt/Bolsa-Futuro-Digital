// Programa simples em TypeScript
function saudacao(nome: string): string {
    return `Olá, ${nome}! Bem-vindo ao TypeScript.`;
}

const usuario: string = "Usuário";
const mensagem: string = saudacao(usuario);

const idade: number = 19;
console.log(mensagem);
console.log(`A idade do usuário é: ${idade}`);
