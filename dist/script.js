const iconPaths={
'▤':'<path d="M4 5h16v15H4zM8 5V3m8 2V3M8 10h8m-8 4h8m-8 3h5"/>',
'▦':'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2m-8 3h2"/>',
'◷':'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6m-3 0v3m6 1 2-2"/>',
'▱':'<rect x="5" y="7" width="15" height="14" rx="3"/><path d="M16 3H5a2 2 0 0 0-2 2v11m6-4h7m-7 4h5"/>',
'✓':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
'◉':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
'▥':'<path d="M4 3v17h17M8 16v-5m5 5V7m5 9V4"/>',
'✳':'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/>'};
function drawIcon(symbol){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.65');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.innerHTML=iconPaths[symbol]||iconPaths['✳'];return svg;}
const content={organizar:[['▤','Tudo no seu lugar','Reúna disciplinas, atividades e materiais. Tenha clareza sobre o que precisa estudar e quais são os próximos prazos.'],['▦','Um plano possível','Distribua as atividades de acordo com sua disponibilidade, os prazos e as prioridades. Saiba o que cabe na sua rotina.'],['◷','Tempo para se concentrar','Inicie sessões de foco com Pomodoro e registre o tempo dedicado aos estudos, um momento de cada vez.']],praticar:[['▱','Revisar para lembrar','Crie flashcards e use a revisão espaçada para reencontrar cada conteúdo no momento de praticar.'],['✓','Aprender fazendo','Pratique com o banco fixo de exercícios e acompanhe suas respostas. Com IA configurada, gere questionários e simulados.'],['▤','Seu material por perto','Organize anotações e documentos TXT, Markdown, PDF, DOCX e PPTX, com texto e arquivos privados na sua conta.']],evoluir:[['◉','Metas com significado','Registre objetivos e acompanhe o que você já concluiu. Transforme uma intenção em próximos passos.'],['▥','Progresso que aparece','Consulte sessões registradas, tempo de estudo e desempenho nos exercícios para compreender sua evolução.'],['✳','Apoio para revisar','Com o assistente de IA configurado, explore explicações, resumos e guias de revisão a partir dos seus materiais.']]};
const tabs=[...document.querySelectorAll('[role=tab]')],panel=document.querySelector('#feature-panel');
function activate(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});panel.setAttribute('aria-labelledby',tab.id);panel.replaceChildren(...content[tab.dataset.tab].map(([icon,title,description])=>{const article=document.createElement('article');article.className='feature-card';const symbol=document.createElement('span');symbol.className='feature-icon';symbol.setAttribute('aria-hidden','true');symbol.append(drawIcon(icon));const heading=document.createElement('h3');heading.textContent=title;const p=document.createElement('p');p.textContent=description;article.append(symbol,heading,p);return article}));}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();tabs[next].focus();activate(tabs[next])}})});if(tabs.length&&panel)activate(tabs[0]);
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open)});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){menu.click();menu.focus()}});

// A página permanece visível sem JavaScript ou quando movimento reduzido está ativo.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
function setupMotion(){
 if(revealObserver)revealObserver.disconnect();
 const targets=[...document.querySelectorAll('.intro>div,.creators>div,.section-head,.tabs,.resource-note,.routine-heading,.steps article,.android-grid>div,.ai-section>div,.faq>div,.final-cta,footer>div')];
 targets.forEach(el=>el.classList.remove('motion-ready','motion-visible'));
 if(motionPreference.matches||!('IntersectionObserver' in window))return;
 revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('motion-visible');revealObserver.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
 targets.forEach((el,index)=>{el.style.setProperty('--reveal-delay',`${index%2*75}ms`);el.classList.add('motion-ready');revealObserver.observe(el)});
}
setupMotion();motionPreference.addEventListener('change',setupMotion);

const scrollProgress=document.createElement('div');scrollProgress.className='scroll-progress';scrollProgress.setAttribute('aria-hidden','true');document.body.append(scrollProgress);
const backTop=document.createElement('button');backTop.type='button';backTop.className='back-top';backTop.setAttribute('aria-label','Voltar ao início');backTop.textContent='⌃';document.body.append(backTop);backTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:motionPreference.matches?'instant':'smooth'});document.querySelector('.brand').focus({preventScroll:true})});
let scrollQueued=false;function updateScroll(){const max=document.documentElement.scrollHeight-window.innerHeight;scrollProgress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,window.scrollY/max)):0})`;backTop.classList.toggle('visible',window.scrollY>650);scrollQueued=false}window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll)}},{passive:true});window.addEventListener('resize',updateScroll);updateScroll();
const scene=document.querySelector('.study-scene');if(scene){for(let n=0;n<4;n++){const particle=document.createElement('span');particle.className='spark-particle';particle.setAttribute('aria-hidden','true');scene.append(particle)}}
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
 document.querySelectorAll('.hero-art,.phone-scene').forEach(area=>{const target=area.querySelector('.study-scene')||area;area.addEventListener('pointermove',event=>{if(motionPreference.matches)return;const rect=area.getBoundingClientRect();target.style.setProperty('--scene-x',`${(event.clientX-rect.left-rect.width/2)*.025}px`);target.style.setProperty('--scene-y',`${(event.clientY-rect.top-rect.height/2)*.025}px`)});area.addEventListener('pointerleave',()=>{target.style.setProperty('--scene-x','0px');target.style.setProperty('--scene-y','0px')})});
 panel?.addEventListener('pointermove',event=>{if(motionPreference.matches)return;const card=event.target.closest('.feature-card');if(!card)return;const rect=card.getBoundingClientRect();card.style.setProperty('--pointer-x',`${event.clientX-rect.left}px`);card.style.setProperty('--pointer-y',`${event.clientY-rect.top}px`)});
}

const installDialog=document.querySelector('#install-dialog');document.querySelectorAll('.install-trigger').forEach(button=>button.addEventListener('click',()=>installDialog.showModal()));installDialog.querySelector('.close-install').addEventListener('click',()=>installDialog.close());installDialog.addEventListener('click',event=>{if(event.target!==installDialog)return;const rect=installDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)installDialog.close()});

 document.querySelectorAll('.step-icon,.notebook-icon,.timer-icon,.tool-list>div>span,.phone-item>span').forEach(el=>{const symbol=el.textContent.trim();el.replaceChildren(drawIcon(symbol))});
// Pausa os movimentos contínuos fora da área visível.
const animatedScenes=document.querySelectorAll('.hero-art,.phone-scene');
if('IntersectionObserver' in window){const sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('scene-paused',!entry.isIntersecting)),{rootMargin:'50px'});animatedScenes.forEach(scene=>sceneObserver.observe(scene))}

const themeToggle=document.querySelector('.theme-toggle');
function syncThemeButton(){const dark=document.documentElement.dataset.theme==='dark';themeToggle.setAttribute('aria-pressed',String(dark));themeToggle.setAttribute('aria-label',dark?'Ativar modo claro':'Ativar modo escuro');themeToggle.title=dark?'Ativar modo claro':'Ativar modo escuro'}
themeToggle.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;try{localStorage.setItem('studymind-presentation-theme',theme)}catch{}syncThemeButton()});syncThemeButton();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',event=>{let saved;try{saved=localStorage.getItem('studymind-presentation-theme')}catch{}if(!saved){const theme=event.matches?'dark':'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;syncThemeButton()}});

// Entradas dos atalhos ao aparecerem na tela e resposta visual nos botões.
const directoryCards=document.querySelectorAll('.directory-grid>a');
if('IntersectionObserver' in window){const cardsObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('card-visible');cardsObserver.unobserve(entry.target)}}),{threshold:.12});directoryCards.forEach((card,index)=>{card.style.setProperty('--card-delay',`${index*75}ms`);cardsObserver.observe(card)})}
document.querySelectorAll('.button,.tabs button').forEach(button=>button.addEventListener('pointerdown',event=>{if(motionPreference.matches)return;const rect=button.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='interaction-ripple';ripple.setAttribute('aria-hidden','true');ripple.style.left=`${event.clientX-rect.left}px`;ripple.style.top=`${event.clientY-rect.top}px`;button.append(ripple);ripple.addEventListener('animationend',()=>ripple.remove(),{once:true})}));

// APK original gerado pelo workflow Android do projeto principal.
const apkSection=installDialog.querySelector('.apk-option');
if(apkSection){
 const heading=document.createElement('h3');heading.textContent='Aplicativo para Android';
 const description=document.createElement('p');description.textContent='Baixe o APK do StudyMind e abra o arquivo no celular para instalar. Compatível com Android 8 ou superior.';
 const download=document.createElement('a');download.className='button';download.href='studymind-android.apk';download.download='StudyMind-Android.apk';download.textContent='Baixar APK Android';
 const note=document.createElement('small');note.textContent='Versão de desenvolvimento gerada pelo GitHub Actions. Se o Android solicitar, permita a instalação por este navegador. O aplicativo acessa studyminds.vercel.app e precisa de internet.';
 apkSection.replaceChildren(heading,description,download,note);
 installDialog.querySelector(':scope > p').after(apkSection);
}
