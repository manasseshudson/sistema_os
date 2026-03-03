function toggleSidebar() {
	const sidebar = document.getElementById('sidebar');
	const overlay = document.getElementById('overlay');
	const icon = document.querySelector('#menuBtn span');

	const isOpen = !sidebar.classList.contains('-translate-x-full');

	sidebar.classList.toggle('-translate-x-full');
	overlay.classList.toggle('hidden');

	icon.textContent = isOpen ? 'menu' : 'close';
}
document.getElementById("placa").addEventListener("blur", async function () {
			const placa = this.value.trim();

			if (placa !== "") {
			try {
				// Chama a API
				const response = await fetch(`/getDados/${placa}`);
			  
				if (!response.ok) {
					throw new Error("Erro ao buscar dados");
				}

				const dados = await response.json();
				console.log(dados)
				// Preenche o campo cliente
				document.getElementById("cliente").value = dados.cliente || "";

			} catch (error) {
			  console.error("Erro:", error);
			  document.getElementById("cliente").value = "";
			}
			}
		});
	
	
      // Modal Logic
      const openModalBtn = document.getElementById('openModalBtn');
      const closeModalBtn = document.getElementById('closeModalBtn');
      const modalOverlay = document.getElementById('modalOverlay');

      function openModal() {
        modalOverlay.classList.add('active');
      }

      function closeModal() {
        modalOverlay.classList.remove('active');
      }
      openModalBtn.addEventListener('click', openModal);
      closeModalBtn.addEventListener('click', closeModal);
      // Close modal when clicking outside content
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
      // Close modal on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
          closeModal();
        }
      });
const campo = document.getElementById('valor');
		
		campo.addEventListener('input', () => {
		  let valor = campo.value.replace(/\D/g, ''); // remove tudo que não é número
		  valor = (valor / 100).toFixed(2) + ''; // divide por 100 e fixa 2 casas
		  valor = valor.replace('.', ','); // troca ponto por vírgula
		  //valor = 'R$ ' + valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // formata milhar
		  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // formata milhar
		  valor = valor.replace(',', '.');
		  campo.value = valor;
		});
$(document).ready(function () {
		
			//COMBO TIPO DE SERVIÇO
			$.get("/tipo_servico", function (data, status) {			
				var select2 = $('#tipo_servico');
				select2.html('');
				select2.append('<option value="" selected>Selecione</option>');
				for (let i = 0; i < data.length; i++) {
					select2.append('<option value="' + data[i].id + '">' + data[i].nome + '</option>');
				}
			});
			
			//COMBO SITUAÇAO
			$.get("/situacao", function (data, status) {
				var select2 = $('#situacao');
				select2.html('');
				select2.append('<option value="" selected>Selecione</option>');
				for (let i = 0; i < data.length; i++) {
					select2.append('<option value="' + data[i].id + '">' + data[i].nome + '</option>');
				}
			});
		
			function Competencia() {
				var data = new Date();
				var dia = String(data.getDate()).padStart(2, '0');
				var mes = String(data.getMonth() + 1).padStart(2, '0');
				var ano = data.getFullYear();
				dataAtual = dia + '/' + mes + '/' + ano;
				return dataAtual;
			}
			
			var getData = Competencia();
			document.getElementById("competencia").value = getData;
		
			$("#salvarOS").click(function () {
				const btn = $(this)

				// evita clique duplo
				if (btn.prop("disabled")) return
				// desabilita botão
				btn.prop("disabled", true)
				 .addClass("opacity-60 cursor-not-allowed")
				 .text("Salvando...")

			let placa = $("#placa").val()
			let cliente = $("#cliente").val()
			let dataLancamento = $("#competencia").val()
			let dataPrevisaoSaida = $("#dataPrevisaoSaida").val()
			let situacao = $("#situacao").val()
			let tipo_servico = $("#tipo_servico").val()
			let valor = $("#valor").val()
			let obs = $("#observacao").val()
			let uid_usuario = $("#uid_usuario").val()

			if(tipo_servico==""){
				alert("Informe o Tipo de Serviço")
				btn.prop("disabled", false)
				   .removeClass("opacity-60 cursor-not-allowed")
				   .text("Salvar Ordem")
				return;
			}
				
			if(situacao==""){
				alert("Informe a Situação")
				btn.prop("disabled", false)
				   .removeClass("opacity-60 cursor-not-allowed")
				   .text("Salvar Ordem")
				return;
			}


			  if (dataPrevisaoSaida) {
				dataPrevisaoSaida = formatarData(dataPrevisaoSaida)
			  }

			if (!dataLancamento) {
				alert("Informe a Data de Entrada")

				// reabilita botão se validação falhar
				btn.prop("disabled", false)
				   .removeClass("opacity-60 cursor-not-allowed")
				   .text("Salvar Ordem")

				return
			}

			let dataLanc = formatarData(dataLancamento)

			$.post('/addOS', {
				placa,
				cliente,
				dataLancamento: dataLanc,
				dataPrevisaoSaida,
				situacao,
				tipo_servico,
				valor,
				observacao: obs,
				uid_usuario
			})
			.done(function (resposta) {
			alert(resposta.mensagem)
			
		})
		.fail(function () {
			alert("Erro ao salvar a Ordem de Serviço")
			// reabilita botão se der erro
			btn.prop("disabled", false)
			   .removeClass("opacity-60 cursor-not-allowed")
			   .text("Salvar Ordem")
		  })
	})

		
		
		function formatarData(data){
			
			
			//const data = "2025-09-30";
			const partes = data.split("-");
			const date = new Date(partes[0], partes[1] - 1, partes[2]); // ano, mês (0-index), dia

			const formatada = date.toLocaleDateString("pt-BR");
			console.log(formatada); // 30/09/2025
			return formatada;

		}

		document.getElementById("placa").addEventListener("blur", async function () {
			const placa = this.value.trim();

			if (placa !== "") {
			try {
				// Chama a API
				const response = await fetch(`/getDados/${placa}`);
			  
				if (!response.ok) {
					throw new Error("Erro ao buscar dados");
				}

				const dados = await response.json();
				console.log(dados)
				// Preenche o campo cliente
				document.getElementById("cliente").value = dados.cliente || "";

			} catch (error) {
			  console.error("Erro:", error);
			  document.getElementById("cliente").value = "";
			}
			}
		});
		
		
		

  })
	function visualizar(id){
		//COMBO SITUAÇAO
		$.get("/dadosOs/"+id, function (data, status) {
			console.log(data)
			
			for (let i = 0; i < data.length; i++) {
				console.log(data[i].numeroOS)
				document.getElementById("numeroOS").textContent =data[i].numeroOS;				
				document.getElementById("nomeCliente").textContent =data[i].cliente;
				
				
				//document.getElementById("nomeCliente").textContent =data[i].dataLancamento;
				//document.getElementById("nomeCliente").textContent =data[i].valor;
				
			}
			
		});
	}
	function concluirOrdemServico(idOrdemServico){
		//alert(idOrdemServico);
		if (confirm("Confirma a Finalização da Ordem de Serviço?")) {
			$.post('/finalizarOrdemServico', {
				idOrdemServico: idOrdemServico			
			}, function (resposta) {
				alert(resposta.mensagem)
				window.location.href = "/principal/"+"<%= uid_usuario %>"
			});			
		}
	}

function abrirModalDetalhes(btn) {
	
	document.getElementById('modal-os').innerText = btn.dataset.os
	document.getElementById('modal-cliente').innerText = btn.dataset.cliente
	document.getElementById('modal-entrada').innerText = btn.dataset.entrada
	document.getElementById('modal-prev').innerText = btn.dataset.prev || '-'
	document.getElementById('modal-status').innerText = btn.dataset.status
	document.getElementById('modal-observacao').innerText = btn.dataset.observacao

	const btnFechar = document.getElementById("btnFecharOS");

	  if (btn.dataset.status === "Aberta") {
		btnFechar.classList.remove("hidden");
	  } else {
		btnFechar.classList.add("hidden");
	  }

	document.getElementById('modalDetalhes').classList.remove('hidden')
}
function fecharModalDetalhes() {
	document.getElementById('modalDetalhes').classList.add('hidden')
}


function realizarCheckList(numeroOS){
	alert(numeroOS);
	window.location.href = "/checlist/"+numeroOS+"/"+uid_usuario;
	
}