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

// Percurso ilustrativo: somente texto e desenho locais; nenhuma chamada a IA.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const board = document.querySelector('.mission-board');
const nodes = [...board.querySelectorAll('.mission-node')];
const playButton = board.querySelector('.mission-play');
const routes = [...board.querySelectorAll('.mission-routes path')];
const packet = board.querySelector('.mission-packet');
const processSelect = document.querySelector('#processo-exemplo');
let currentStage = 0;
let demoTimer = null;
let packetFrame = null;
let playing = false;
let currentTopic = 'orcamento';
let keyboardInteraction = false;
document.addEventListener('keydown',()=>{keyboardInteraction=true;});
document.addEventListener('pointerdown',()=>{keyboardInteraction=false;},{passive:true});
const missionExamples = {
  orcamento: { label:'orçamento', stages:[['O trabalho começa com contexto.','Pedido, catálogo e condições da empresa entram no mesmo fluxo.'],['Cada agente cuida de uma parte.','Um organiza os itens. Outro prepara o rascunho e sinaliza o que falta.'],['As decisões continuam com pessoas.','O responsável confere preços, estoque e condições antes do envio.'],['Uma proposta pronta para a próxima etapa.','O rascunho revisado pode seguir para o cliente após a aprovação.']] },
  relatorio: { label:'relatório', stages:[['Primeiro, entender o que os dados dizem.','Registros, período e objetivo do relatório são definidos pela empresa.'],['Informações dispersas ganham estrutura.','Os agentes agrupam os dados e apontam lacunas para conferência.'],['Uma conclusão precisa de conferência.','O responsável verifica as fontes e revisa as interpretações.'],['O resultado vira um documento útil.','O relatório revisado pode ser compartilhado conforme o escopo.']] },
  conteudo: { label:'conteúdo', stages:[['A voz da marca vem antes do texto.','Oferta, público e informações autorizadas orientam o trabalho.'],['Ideias viram uma proposta de conteúdo.','Os agentes organizam temas, textos e uma sequência de publicação.'],['A marca tem a palavra final.','O responsável confere a linguagem e aprova o que pode ser publicado.'],['Um plano que pode sair do papel.','Textos e calendário revisados ficam prontos para o próximo passo.']] }
};
function cancelPacket() {
  if (packetFrame !== null) cancelAnimationFrame(packetFrame);
  packetFrame = null;
  packet.setAttribute('visibility','hidden');
}
function stopDemo() {
  clearTimeout(demoTimer);
  demoTimer = null;
  playing = false;
  playButton.querySelector('span').textContent = motionPreference.matches ? 'Explorar etapa seguinte' : currentStage === 3 ? 'Repetir o percurso' : 'Ver o percurso';
}
function movePacket(path) {
  cancelPacket();
  if (motionPreference.matches || document.hidden) return;
  const length = path.getTotalLength();
  const start = performance.now();
  packet.setAttribute('visibility','visible');
  function draw(time) {
    const progress = Math.min((time-start)/650,1);
    const position = path.getPointAtLength(length*(1-Math.pow(1-progress,3)));
    packet.setAttribute('cx',position.x);
    packet.setAttribute('cy',position.y);
    if (progress<1) packetFrame=requestAnimationFrame(draw);
    else {packetFrame=null;packet.setAttribute('visibility','hidden');}
  }
  packetFrame=requestAnimationFrame(draw);
}
function showStage(index,animate=true) {
  const previous = currentStage;
  currentStage = index;
  board.dataset.stage = String(index);
  nodes.forEach((node,i)=>node.setAttribute('aria-pressed',String(i===index)));
  const [title,description] = missionExamples[currentTopic].stages[index];
  board.querySelector('.mission-position').textContent = `0${index+1} / 04`;
  board.querySelector('.mission-detail h3').textContent = title;
  board.querySelector('.mission-detail p').textContent = description;
  if (animate && index===(previous+1)%4) movePacket(routes[previous]);
  else cancelPacket();
  if (!playing) stopDemo();
}
nodes.forEach((node,index)=>{
  node.disabled=false;
  node.addEventListener('click',()=>{stopDemo();showStage(index,!keyboardInteraction);});
  node.addEventListener('keydown',event=>{
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?3:(index+(event.key==='ArrowRight'?1:3))%4;
    nodes[next].focus();stopDemo();showStage(next,false);
  });
});
playButton.disabled=false;
playButton.addEventListener('click',()=>{
  if (playing) {stopDemo();cancelPacket();return;}
  if (motionPreference.matches || keyboardInteraction) {showStage((currentStage+1)%4,false);return;}
  showStage(0);
  playing=true;
  playButton.querySelector('span').textContent='Pausar percurso';
  function next() {
    if (!playing) return;
    showStage(currentStage+1);
    if (currentStage===3) stopDemo();
    else demoTimer=setTimeout(next,1600);
  }
  demoTimer=setTimeout(next,1600);
});
function syncTopic() {
  currentTopic=processSelect.value;
  stopDemo();showStage(0);
  board.querySelector('.mission-topic').textContent=`Exemplo: ${missionExamples[currentTopic].label}`;
  document.querySelectorAll('.solution').forEach(article=>article.dataset.selected=String(article.querySelector('.solution-explore').dataset.process===currentTopic));
  const panel=document.querySelector('.process-panel');
  if (!motionPreference.matches && !keyboardInteraction) {
    panel.classList.add('is-changing');
    panel.animate([{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});
    setTimeout(()=>panel.classList.remove('is-changing'),300);
  }
}
processSelect.addEventListener('change',syncTopic);
document.querySelectorAll('.solution-explore').forEach(button=>{
  button.hidden=false;
  button.addEventListener('click',()=>{
    processSelect.value=button.dataset.process;
    processSelect.dispatchEvent(new Event('change',{bubbles:true}));
    document.querySelector('#exemplo').scrollIntoView({behavior:motionPreference.matches||keyboardInteraction?'instant':'smooth',block:'start'});
    processSelect.focus({preventScroll:true});
  });
});
motionPreference.addEventListener('change',()=>{stopDemo();cancelPacket();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopDemo();cancelPacket();}});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){stopDemo();cancelPacket();}},{threshold:0}).observe(board);
  const links=[...navigation.querySelectorAll('a[href^="#"]')];
  const sectionObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    links.forEach(link=>{if(link.hash===`#${visible.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  },{rootMargin:'-15% 0px -50% 0px',threshold:[0,.15,.5]});
  links.forEach(link=>{const section=document.querySelector(link.hash);if(section)sectionObserver.observe(section);});
}
let scrollFramePending=false;
function updateReadingProgress() {
  const scrollable=document.documentElement.scrollHeight-innerHeight;
  document.documentElement.style.setProperty('--reading-progress',String(scrollable>0?Math.min(scrollY/scrollable,1):0));
  scrollFramePending=false;
}
addEventListener('scroll',()=>{if(!scrollFramePending){scrollFramePending=true;requestAnimationFrame(updateReadingProgress);}},{passive:true});
addEventListener('resize',updateReadingProgress);
if ('ResizeObserver' in window) new ResizeObserver(entries=>{
  document.documentElement.style.setProperty('--header-clearance',`${Math.ceil(entries[0].target.getBoundingClientRect().height)+20}px`);
}).observe(document.querySelector('.site-header'));
updateReadingProgress();
stopDemo();
