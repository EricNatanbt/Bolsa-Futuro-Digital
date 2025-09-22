let pessoas = {}; 

// Função para salvar no localStorage
function salvarLocalStorage() {
  localStorage.setItem("tarefas_pessoas", JSON.stringify(pessoas));
}

// Função para carregar do localStorage
function carregarLocalStorage() {
  const dados = localStorage.getItem("tarefas_pessoas");
  if (dados) {
    pessoas = JSON.parse(dados);
    renderizarTarefas();
    atualizarContador();
  }
}

// Função de adicionar tarefa
function adicionarTarefa() {
  const pessoa = document.getElementById("pessoa").value.trim();
  const tarefa = document.getElementById("tarefa").value.trim();
  const dia = document.getElementById("dias").value;

  if (!pessoa || !tarefa) {
    alert("Preencha todos os campos!");
    return;
  }

  if (!pessoas[pessoa]) pessoas[pessoa] = {};
  if (!pessoas[pessoa][dia]) pessoas[pessoa][dia] = [];

  pessoas[pessoa][dia].push({ texto: tarefa, concluida: false });

  salvarLocalStorage();
  renderizarTarefas();
  atualizarContador();

  document.getElementById("pessoa").value = "";
  document.getElementById("tarefa").value = "";
}

// Função de concluir tarefa
function concluirTarefa(pessoa, dia, index) {
  if (pessoas[pessoa] && pessoas[pessoa][dia] && pessoas[pessoa][dia][index]) {
    pessoas[pessoa][dia][index].concluida = !pessoas[pessoa][dia][index].concluida;
    salvarLocalStorage();
    renderizarTarefas();
    atualizarContador();
  }
}

// Função de remover tarefa
function removerTarefa(pessoa, dia, index) {
  if (pessoas[pessoa] && pessoas[pessoa][dia]) {
    pessoas[pessoa][dia].splice(index, 1);

    if (pessoas[pessoa][dia].length === 0) {
      delete pessoas[pessoa][dia];
    }
    if (Object.keys(pessoas[pessoa]).length === 0) {
      delete pessoas[pessoa];
    }

    salvarLocalStorage();
    renderizarTarefas();
    atualizarContador();
  }
}

// Função de atualizar contador (com filtros opcionais)
function atualizarContador(filtros = {}) {
  let totalPendentes = 0;
  let totalConcluidas = 0;

  const { pessoaFiltro = "", tarefaFiltro = "", filtroDia = "" } = filtros;

  for (const pessoa in pessoas) {
    if (pessoaFiltro && !pessoa.toLowerCase().includes(pessoaFiltro.toLowerCase())) continue;

    for (const dia in pessoas[pessoa]) {
      if (filtroDia && dia !== filtroDia) continue;

      pessoas[pessoa][dia].forEach(t => {
        if (tarefaFiltro && !t.texto.toLowerCase().includes(tarefaFiltro.toLowerCase())) return;

        if (t.concluida) totalConcluidas++;
        else totalPendentes++;
      });
    }
  }

  document.getElementById("contador").innerText = 
    `Pendentes: ${totalPendentes} | Concluídas: ${totalConcluidas}`;
}

// Função de renderizar tarefas (geral)
function renderizarTarefas() {

// Limpa campos de filtro
  document.getElementById("filtro-tarefa").value = "";
  document.getElementById("filtro-pessoa").value = "";
  document.getElementById("filtro-dia").value = "";

  const container = document.getElementById('tarefas-container');
  container.innerHTML = '';

  const ordemDias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  const nomesDias = {
    'segunda': 'Segunda',
    'terca': 'Terça',
    'quarta': 'Quarta',
    'quinta': 'Quinta',
    'sexta': 'Sexta',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  };

  for (const pessoa in pessoas) {
    const pessoaDiv = document.createElement('div');
    pessoaDiv.className = 'pessoa-container';
    pessoaDiv.innerHTML = `<h2>Usuário: ${pessoa}</h2>`;
    container.appendChild(pessoaDiv);

    ordemDias.forEach(dia => {
      if (pessoas[pessoa][dia] && pessoas[pessoa][dia].length > 0) {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia-container';
        diaDiv.innerHTML = `<h3>${nomesDias[dia]}</h3>`;
        pessoaDiv.appendChild(diaDiv);

        pessoas[pessoa][dia].forEach((tarefa, index) => {
          const tarefaDiv = document.createElement('div');
          tarefaDiv.className = 'tarefa-item';
          if (tarefa.concluida) {
            tarefaDiv.classList.add('concluida');
          }
          tarefaDiv.innerHTML = `
            <span class="tarefa-texto">${tarefa.texto}</span>
            <div class="tarefa-botoes">
              <button onclick="concluirTarefa('${pessoa}', '${dia}', ${index})" class="btn-concluir">
                ${tarefa.concluida ? 'Desfazer' : 'Concluir'}
              </button>
              <button onclick="removerTarefa('${pessoa}', '${dia}', ${index})" class="btn-remover">Remover</button>
            </div>
          `;
          diaDiv.appendChild(tarefaDiv);
        });
      }
    });
  }
  // Atualiza contador geral
  atualizarContador();
}

// Função de filtrar tarefas
function filtrarTarefas() {
  const tarefaFiltro = document.getElementById("filtro-tarefa").value.trim().toLowerCase();
  const pessoaFiltro = document.getElementById("filtro-pessoa").value.trim().toLowerCase(); 
  const filtroDia = document.getElementById("filtro-dia").value;

  const container = document.getElementById('tarefas-container');
  container.innerHTML = '';

  const ordemDias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  const nomesDias = {
    'segunda': 'Segunda',
    'terca': 'Terça',
    'quarta': 'Quarta',
    'quinta': 'Quinta',
    'sexta': 'Sexta',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  };

  for (const pessoa in pessoas) {
    if (pessoaFiltro && !pessoa.toLowerCase().includes(pessoaFiltro)) continue;

    const pessoaDiv = document.createElement('div');
    pessoaDiv.className = 'pessoa-container';
    pessoaDiv.innerHTML = `<h2>Usuário: ${pessoa}</h2>`;
    container.appendChild(pessoaDiv);

    ordemDias.forEach(dia => {
      if (filtroDia && dia !== filtroDia) return;
      if (!pessoas[pessoa][dia] || pessoas[pessoa][dia].length === 0) return;

      const tarefasFiltradas = pessoas[pessoa][dia].filter(t => {
        return !tarefaFiltro || t.texto.toLowerCase().includes(tarefaFiltro);
      });

      if (tarefasFiltradas.length === 0) return;

      const diaDiv = document.createElement('div');
      diaDiv.className = 'dia-container';
      diaDiv.innerHTML = `<h3>${nomesDias[dia]}</h3>`;
      pessoaDiv.appendChild(diaDiv);

      tarefasFiltradas.forEach((tarefa, index) => {
        const tarefaDiv = document.createElement('div');
        tarefaDiv.className = 'tarefa-item';
        if (tarefa.concluida) tarefaDiv.classList.add('concluida');

        tarefaDiv.innerHTML = `
          <span class="tarefa-texto">${tarefa.texto}</span>
          <div class="tarefa-botoes">
            <button onclick="concluirTarefa('${pessoa}', '${dia}', ${index})" class="btn-concluir">
              ${tarefa.concluida ? 'Desfazer' : 'Concluir'}
            </button>
            <button onclick="removerTarefa('${pessoa}', '${dia}', ${index})" class="btn-remover">Remover</button>
          </div>
        `;
        diaDiv.appendChild(tarefaDiv);
      });
    });
  }

  // Atualiza o contador de acordo com o filtro aplicado
  atualizarContador({ pessoaFiltro, tarefaFiltro, filtroDia });
}

// Eventos
document.getElementById("btnAdicionar").addEventListener("click", adicionarTarefa);

// Carrega dados ao iniciar
window.addEventListener("load", carregarLocalStorage);
