// Comportamento apenas de protótipo: monta o menu e simula edição e exclusão.
(function () {
  var menu = [
    ['painel', 'index.html', 'Painel'],
    ['ordens', 'ordens.html', 'Ordens de serviço'],
    ['clientes', 'clientes.html', 'Clientes'],
    ['veiculos', 'veiculos.html', 'Veículos'],
    ['mecanicos', 'mecanicos.html', 'Mecânicos'],
    ['servicos', 'servicos.html', 'Serviços']
  ];

  var main = document.querySelector('main');
  var layout = document.createElement('div');
  layout.className = 'layout';
  layout.innerHTML =
    '<aside class="lateral"><a class="marca" href="index.html">Meca<span>Gestão</span></a><nav>' +
    menu.map(function (item) {
      var ativo = item[0] === document.body.dataset.pagina ? ' class="ativo"' : '';
      return '<a href="' + item[1] + '"' + ativo + '>' + item[2] + '</a>';
    }).join('') +
    '</nav></aside>';
  main.parentNode.insertBefore(layout, main);
  layout.appendChild(main);

  var parametros = new URLSearchParams(location.search);

  // Formulários: ?editar=1 mostra a tela preenchida, em modo de edição.
  if (parametros.has('editar')) {
    document.body.classList.add('editando');
    document.querySelectorAll('[data-editar]').forEach(function (campo) {
      campo.value = campo.dataset.editar;
    });
    document.querySelectorAll('[data-editar-texto]').forEach(function (elemento) {
      elemento.textContent = elemento.dataset.editarTexto;
    });
  }

  document.querySelectorAll('form[data-voltar]').forEach(function (formulario) {
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      location.href = formulario.dataset.voltar;
    });
  });

  // Listagens: confirmação de exclusão (?excluir=1 abre o modal na primeira linha).
  var botoes = document.querySelectorAll('[data-excluir]');
  if (!botoes.length) return;

  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.hidden = true;
  modal.innerHTML =
    '<div class="modal-caixa" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">' +
    '<h2 id="modal-titulo">Confirmar exclusão</h2><p></p>' +
    '<div class="rodape-form"><button class="btn" type="button">Cancelar</button>' +
    '<button class="btn perigo" type="button">Excluir</button></div></div>';
  document.body.appendChild(modal);

  function abrir(nome) {
    modal.querySelector('p').textContent =
      'Deseja excluir "' + nome + '"? Esta ação não pode ser desfeita.';
    modal.hidden = false;
  }

  botoes.forEach(function (botao) {
    botao.addEventListener('click', function () { abrir(botao.dataset.excluir); });
  });
  modal.querySelectorAll('button').forEach(function (botao) {
    botao.addEventListener('click', function () { modal.hidden = true; });
  });

  if (parametros.has('excluir')) abrir(botoes[0].dataset.excluir);
})();
