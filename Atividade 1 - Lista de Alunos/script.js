let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
let editIndex = null;

// Função para gerar próximo ID de 4 dígitos
function gerarID() {
  if (alunos.length === 0) return "0000";
  let ultimoID = alunos[alunos.length - 1].id;
  let proximoID = (parseInt(ultimoID) + 1) % 10000; // ciclo até 9999
  return proximoID.toString().padStart(4, '0');
}

// Salvar alunos no localStorage
function salvar() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
  renderizar();
}

// Renderiza a lista de alunos
function renderizar() {
  const lista = document.getElementById("listaAlunos");
  lista.innerHTML = "";

  let filtroNome = document.getElementById("pesquisaNome")?.value.toLowerCase() || "";
  let ordenarPor = document.getElementById("ordenar")?.value || "";

  let listaFiltrada = alunos.filter(aluno => aluno.nome.toLowerCase().includes(filtroNome));

  // Ordenação
  if (ordenarPor === "nome") {
    listaFiltrada.sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (ordenarPor === "idade") {
    listaFiltrada.sort((a, b) => Number(a.idade) - Number(b.idade));
  } else if (ordenarPor === "sexo") {
    listaFiltrada.sort((a, b) => a.sexo.localeCompare(b.sexo));
  }

  if (listaFiltrada.length === 0) {
    lista.innerHTML = `<div class="task-item"><span>Nenhum aluno encontrado.</span></div>`;
    return;
  }

  listaFiltrada.forEach((aluno) => {
    const item = document.createElement("div");
    item.className = "task-item";

    // Botões de ação usando o ID do aluno
    item.innerHTML = `
      <span class="col id">${aluno.id}</span>
      <span class="col nome">${aluno.nome}</span>
      <span class="col idade">${aluno.idade}</span>
      <span class="col sexo">${aluno.sexo}</span>
      <span class="col email">${aluno.email}</span>
      <span class="col acoes">
        <button class="editar" onclick="editarAlunoPorID('${aluno.id}')">✏️</button>
        <button class="remover" onclick="removerAlunoPorID('${aluno.id}')">🗑</button>
      </span>
    `;

    lista.appendChild(item);
  });
}

// Função para remover aluno pelo ID
function removerAlunoPorID(id) {
  if (confirm("Tem certeza que deseja remover este aluno?")) {
    const index = alunos.findIndex(a => a.id === id);
    if (index !== -1) {
      alunos.splice(index, 1);
      salvar();
    }
  }
}

// Função para editar aluno pelo ID
function editarAlunoPorID(id) {
  const index = alunos.findIndex(a => a.id === id);
  if (index !== -1) {
    const t = alunos[index];
    document.getElementById("nome").value = t.nome;
    document.getElementById("idade").value = t.idade;
    document.getElementById("sexo").value = t.sexo;
    document.getElementById("email").value = t.email;
    editIndex = index;
  }
}
document.getElementById("taskForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let nova = {
    id: editIndex !== null ? alunos[editIndex].id : gerarID(),
    nome: document.getElementById("nome").value,
    idade: document.getElementById("idade").value,
    sexo: document.getElementById("sexo").value,
    email: document.getElementById("email").value
  };

  if (editIndex !== null) {
    alunos[editIndex] = nova;
    editIndex = null;
  } else {
    alunos.push(nova);
  }

  e.target.reset();
  salvar();
});

// Eventos de pesquisa e ordenação
document.getElementById("pesquisaNome").addEventListener("input", renderizar);
document.getElementById("ordenar").addEventListener("change", renderizar);

renderizar();
