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
  }
}


// Função de renderizar tarefas (geral)
function renderizarTarefas() {

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
}


// Eventos
document.getElementById("btnAdicionar").addEventListener("click", adicionarTarefa);

// Carrega dados ao iniciar
window.addEventListener("load", carregarLocalStorage);
