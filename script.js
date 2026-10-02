'use strict';

// Somente interação local. Nenhum dado é armazenado ou enviado por este script.
document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
menuButton.hidden = false;
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const examples = {
  orcamento: {
    process: 'Preparar um orçamento',
    input: 'Pedido do cliente, catálogo e condições comerciais fornecidos pela empresa.',
    work: 'Organizar os itens solicitados e apontar informações que faltam.',
    output: 'Rascunho de proposta com itens, valores fornecidos e pendências destacadas.',
    approval: 'O responsável confere preços, estoque e condições e decide sobre o envio.'
  },
  relatorio: {
    process: 'Organizar um relatório',
    input: 'Planilhas e registros do período, com o objetivo do relatório definido pela empresa.',
    work: 'Agrupar informações, estruturar o documento e sinalizar lacunas para conferência.',
    output: 'Rascunho de relatório com resumo, fontes utilizadas e pontos que precisam de revisão.',
    approval: 'O responsável verifica os dados e as conclusões antes de compartilhar o relatório.'
  },
  conteudo: {
    process: 'Planejar conteúdo',
    input: 'Oferta, público, identidade da marca e informações autorizadas pela empresa.',
    work: 'Organizar temas e preparar sugestões de textos e de calendário.',
    output: 'Proposta de conteúdo com rascunhos e sequência de publicação sugerida.',
    approval: 'O responsável revisa linguagem, oferta e informações e decide o que publicar.'
  }
};
document.querySelector('#processo-exemplo').addEventListener('change', (event) => {
  const example = examples[event.target.value];
  if (!example) return;
  for (const [field, value] of Object.entries(example)) {
    document.querySelector(`#example-${field}`).textContent = value;
  }
});

const form = document.querySelector('#contact-form');
const channel = document.querySelector('#canal');
const submit = document.querySelector('#contact-submit');
const status = document.querySelector('#form-status');
submit.disabled = false;
channel.addEventListener('change', () => {
  submit.textContent = channel.value === 'email' ? 'Preparar mensagem por e-mail' : 'Preparar mensagem no WhatsApp';
  status.textContent = '';
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = ['nome', 'empresa', 'processo'].map((id) => document.getElementById(id));
  for (const field of fields) {
    field.setCustomValidity(field.value.trim() ? '' : 'Preencha este campo antes de preparar a mensagem.');
  }
  if (!form.reportValidity()) return;
  const [name, company, process] = fields.map((field) => field.value.trim());
  const message = `Olá, Pedro! Quero conversar sobre uma solução do Atlas Bull.\n\nNome: ${name}\nEmpresa: ${company}\nProcesso que precisa melhorar: ${process}`;
  const url = channel.value === 'email'
    ? `mailto:Pedrohocrespo01@hotmail.com?subject=${encodeURIComponent('Conversa sobre um processo — Atlas Bull')}&body=${encodeURIComponent(message)}`
    : `https://wa.me/5522998196745?text=${encodeURIComponent(message)}`;
  status.replaceChildren();
  const explanation = document.createTextNode('Mensagem preparada. Revise e confirme o envio no canal escolhido. Se ele não abrir, ');
  const fallback = document.createElement('a');
  fallback.href = url;
  fallback.textContent = 'abra a mensagem preparada aqui';
  if (channel.value === 'whatsapp') {
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.setAttribute('aria-label', 'Abrir mensagem preparada no WhatsApp em nova aba');
  }
  status.append(explanation, fallback, document.createTextNode('.'));
  if (channel.value === 'email') window.location.href = url;
  else window.open(url, '_blank', 'noopener,noreferrer');
});
form.addEventListener('input', (event) => {
  if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  status.textContent = '';
});
