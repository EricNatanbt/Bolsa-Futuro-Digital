
// Contador
let contador = 0;
const textoContador = document.getElementById('contador');
document.getElementById('mais').onclick = () => {
  contador++;
  textoContador.textContent = contador;
};
document.getElementById('menos').onclick = () => {
  contador--;
  textoContador.textContent = contador;
};

// Validação de formulário
const form = document.getElementById('formulario');
form.onsubmit = (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('mensagem');
  if (!nome || !email) {
    msg.textContent = 'Preencha todos os campos!';
    msg.style.color = 'red';
  } else {
    msg.textContent = 'Formulário enviado com sucesso!';
    msg.style.color = 'green';
    form.reset();
  }
};

// Troca de cor de fundo
const botaoCor = document.getElementById('trocarCor');
botaoCor.onclick = () => {
  const corAleatoria = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  document.body.style.backgroundColor = corAleatoria;
};

// Lista dinâmica
const lista = document.getElementById('lista');
const inputItem = document.getElementById('itemInput');
document.getElementById('adicionar').onclick = () => {
  const texto = inputItem.value.trim();
  if (texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    lista.appendChild(li);
    inputItem.value = '';
  }
};
