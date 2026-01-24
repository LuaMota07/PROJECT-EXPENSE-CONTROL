let gastos = [];
let total = 0;

function adicionarGasto() {
  const descricao = document.getElementById("descricao").value;
  const valor = Number(document.getElementById("valor").value);
  const cartao = document.getElementById("cartao").value;
  const local = document.getElementById("local").value;

  if (descricao === "" || valor <= 0 || cartao === "" || local === "") {
    alert("Preencha todos os campos!");
    return;
  }

  gastos.push({ descricao, valor, cartao, local });
  total += valor;

  limparCampos();
  atualizarTela();
}

function atualizarTela() {
  const lista = document.getElementById("lista");
  const totalSpan = document.getElementById("total");
  lista.innerHTML = "";

  gastos.forEach((gasto, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${gasto.descricao}</strong><br>
        R$ ${gasto.valor.toFixed(2)}<br>
        Pagamento: ${gasto.cartao}<br>
        Local: ${gasto.local}
      </div>
      <button onclick="removerGasto(${index})">X</button>
    `;
    lista.appendChild(li);
  });

  totalSpan.textContent = total.toFixed(2);

  atualizarDashboard();
}

function removerGasto(index) {
  total -= gastos[index].valor;
  gastos.splice(index, 1);
  atualizarTela();
}

function limparCampos() {
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("cartao").value = "";
  document.getElementById("local").value = "";
}

function exportarPlanilha() {
  if (gastos.length === 0) {
    alert("Não há dados para exportar!");
    return;
  }

  let csv = "Descrição,Valor,Forma de Pagamento,Local\n";

  gastos.forEach(gasto => {
    csv += `${gasto.descricao},${gasto.valor},${gasto.cartao},${gasto.local}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "controle_gastos.csv";
  link.click();
}

/* DASHBOARD */

function atualizarDashboard() {
  const totalGeral = document.getElementById("totalGeral");
  const porCartao = document.getElementById("porCartao");
  const porLocal = document.getElementById("porLocal");

  let totalDash = 0;
  let totalPorCartao = {};
  let totalPorLocal = {};

  gastos.forEach(gasto => {
    totalDash += gasto.valor;

    if (!totalPorCartao[gasto.cartao]) {
      totalPorCartao[gasto.cartao] = 0;
    }
    totalPorCartao[gasto.cartao] += gasto.valor;

    if (!totalPorLocal[gasto.local]) {
      totalPorLocal[gasto.local] = 0;
    }
    totalPorLocal[gasto.local] += gasto.valor;
  });

  totalGeral.textContent = totalDash.toFixed(2);

  porCartao.innerHTML = "";
  for (let cartao in totalPorCartao) {
    porCartao.innerHTML += `<li>${cartao}: R$ ${totalPorCartao[cartao].toFixed(2)}</li>`;
  }

  porLocal.innerHTML = "";
  for (let local in totalPorLocal) {
    porLocal.innerHTML += `<li>${local}: R$ ${totalPorLocal[local].toFixed(2)}</li>`;
  }
}
