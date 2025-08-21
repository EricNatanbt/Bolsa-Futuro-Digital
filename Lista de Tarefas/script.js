let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let editIndex = null;

function formatarData(data) {
  if (!data) return "—";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function salvar() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  renderizar();
}

function renderizar() {
  const lista = document.getElementById("listaTarefas");
  lista.innerHTML = "";

  // 🔍 Pesquisa por título
  let termo = document.getElementById("pesquisa").value.toLowerCase();
  let filtradas = tarefas.filter(t => t.titulo.toLowerCase().includes(termo));

  // 📌 Ordenação
  let ordenar = document.getElementById("ordenar").value;
  if (ordenar === "prioridade") {
    const ordem = { "Alta": 3, "Média": 2, "Baixa": 1 };
    filtradas.sort((a, b) => ordem[b.prioridade] - ordem[a.prioridade]);
  } else if (ordenar === "prazo") {
    filtradas.sort((a, b) => (a.prazo || "").localeCompare(b.prazo || ""));
  } else if (ordenar === "status") {
    filtradas.sort((a, b) => a.status.localeCompare(b.status));
  }

  for (let i = 0; i < filtradas.length; i++) {
    const t = filtradas[i];
    let classe = t.status === "Concluída" ? "concluida" : "";

    lista.innerHTML += `
      <div class="task-item">
        <span class="col titulo ${classe}">${t.titulo}</span>
        <span class="col descricao ${classe}">${t.descricao}</span>
        <span class="col prioridade ${classe}">${t.prioridade}</span>
        <span class="col prazo ${classe}">${formatarData(t.prazo)}</span>
        <span class="col status ${classe}">${t.status}</span>
        <span class="col acoes">
          <button class="concluir" onclick="concluir(${tarefas.indexOf(t)})">✔</button>
          <button class="editar" onclick="editar(${tarefas.indexOf(t)})">✏️</button>
          <button class="remover" onclick="remover(${tarefas.indexOf(t)})">🗑</button>
        </span>
      </div>`;
  }
}

function concluir(i) {
  tarefas[i].status = tarefas[i].status === "Concluída" ? "Pendente" : "Concluída";
  salvar();
}

function remover(i) {
  tarefas.splice(i, 1);
  salvar();
}

function editar(i) {
  const t = tarefas[i];
  document.getElementById("titulo").value = t.titulo;
  document.getElementById("descricao").value = t.descricao;
  document.getElementById("prioridade").value = t.prioridade;
  document.getElementById("prazo").value = t.prazo;
  editIndex = i;
}

document.getElementById("taskForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let nova = {
    titulo: document.getElementById("titulo").value,
    descricao: document.getElementById("descricao").value,
    prioridade: document.getElementById("prioridade").value,
    prazo: document.getElementById("prazo").value,
    status: "Pendente"
  };

  if (editIndex !== null) {
    nova.status = tarefas[editIndex].status;
    tarefas[editIndex] = nova;
    editIndex = null;
  } else {
    tarefas.push(nova);
  }

  e.target.reset();
  salvar();
});

// 🔍 Atualiza a lista ao digitar na pesquisa ou trocar a ordenação
document.getElementById("pesquisa").addEventListener("input", renderizar);
document.getElementById("ordenar").addEventListener("change", renderizar);

renderizar();
