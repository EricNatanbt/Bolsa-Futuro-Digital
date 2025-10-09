//Questão 1

let nome = "Eric";
const idade = 19;
var cidade = "Campina Grande";

console.log("Meu nome é " + nome + ", tenho " + idade + " anos e moro em " + cidade + ".");

//Questão 2

let n1 = prompt("Digite o primeiro número:");
let n2 = prompt("Digite o segundo número:");
console.log(Number(n1) + Number(n2));

//Questão 3

let idadee = prompt("Digite sua idade:");

if (idadee >= 18) {
  console.log("Pode dirigir!");
} else {
  console.log("Não pode dirigir!");
}

//Questão 4

for (let i = 1; i <= 20; i++) {
  console.log("Número:", i);
}

//Questão 5

let contador = 1;
let numero = prompt("Digite um número que deseja ver a tabuada dele:");
while (contador <= 10) {
    console.log(numero + " x " + contador + " = " + (numero * contador));
    contador++;
}

//Questão 6

let valor = prompt("Digite um número para dobrar o valor:");
function dobrarValor(valor) {
    return valor * 2;
}
console.log("O dobro de " + valor + " é " + dobrarValor(valor) + ".");

//Questão 7
let amigos = ["Ana", "Bruno", "Carlos", "Diana", "Eduardo"];
console.log("Meus amigos são:");
for (let i = 0; i < amigos.length; i++) {
    console.log(amigos[i]);
}

//Questão 8

let carro = {
    modelo: "Fusca",
    ano: 1969,
    marca: "Volkswagen"
};
console.log("Modelo:", carro.modelo);
console.log("Ano:", carro.ano);
console.log("Marca:", carro.marca);

//Questão 9

let numeroDaSorte = prompt("Digite um número de 1 a 10:");
let numeroAleatorio = Math.floor(Math.random() * 10) + 1;

if (Number(numeroDaSorte) === numeroAleatorio) {
    console.log("Parabéns! Você acertou o número da sorte:", numeroAleatorio);
} else {
    console.log("Que pena! O número da sorte era:", numeroAleatorio);
}
