const spreads={
  love:{title:'关系与爱的三张牌',hint:'圣三角 · 过去 / 现在 / 未来',positions:['关系的根源','此刻的心意','关系的走向']},
  career:{title:'事业与方向的三张牌',hint:'行动牌阵 · 资源 / 阻力 / 下一步',positions:['你拥有的资源','正在面对的阻力','值得走向的方向']},
  daily:{title:'今日指引',hint:'一张牌 · 今天最重要的提醒',positions:['今日的核心能量']},
  choice:{title:'艰难抉择的五张牌',hint:'抉择牌阵 · 内心 / A / B / 盲点 / 建议',positions:['你真正想要的','选择 A 的能量','选择 B 的能量','容易忽略的盲点','此刻的行动建议']}
};
const deck=[
 ['愚者','新的开始','✦','愚者'],['魔术师','创造与行动','☿','魔术师'],['女祭司','直觉与未知','☾','女教皇'],['女帝','滋养与丰盛','❀','女帝'],['皇帝','秩序与边界','♜','皇帝'],['教皇','经验与传统','✚','法皇'],['恋人','选择与连接','♡','恋人'],['战车','方向与胜意','➶','战车'],['力量','勇气与耐心','♌','力'],['隐者','独处与寻找','⌁','隐者'],['命运之轮','变化与周期','◎','命运之轮'],['正义','平衡与责任','⚖','正义'],['倒吊人','暂停与换位','▽','倒吊人'],['死神','结束与转化','☠','死神'],['节制','融合与调整','⚗','节制'],['恶魔','执念与束缚','⛓','恶魔'],['高塔','突变与重建','ϟ','塔'],['星星','希望与疗愈','★','星'],['月亮','迷雾与想象','☽','月亮'],['太阳','清晰与喜悦','☀','太阳'],['审判','觉醒与回应','♧','审判'],['世界','完成与新章','◌','世界']
];
let currentTopic='love',availableCards=[],selectedCards=[],isConfirmed=false;
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const shuffle=items=>[...items].sort(()=>Math.random()-.5);
const requiredCount=()=>spreads[currentTopic].positions.length;
const orientation=()=>Math.random()>.72?'逆位':'正位';
const localFiles={
  '愚者':'19.愚者','魔术师':'9.魔术师','女教皇':'11.女教皇','女帝':'10.女帝','皇帝':'4.皇帝',
  '法皇':'3.法皇','恋人':'7.恋人','战车':'21.战车','力':'6.力','隐者':'18.隐者',
  '命运之轮':'8.命运之轮','正义':'22.正义','倒吊人':'1.倒吊人','死神':'14.死神','节制':'5.节制',
  '恶魔':'2.恶魔','塔':'15.塔','星':'17.星','月亮':'20.月亮','太阳':'16.太阳',
  '审判':'12.审判','世界':'13.世界'
};
const imagePath=card=>`image/${encodeURIComponent(localFiles[card.file])}.jpg`;
function renderSetup(){const spread=spreads[currentTopic];$('#spreadHint').textContent=spread.hint;$('#cardCount').textContent=String(spread.positions.length).padStart(2,'0');renderDeck();}
function renderDeck(){availableCards=shuffle(deck).slice(0,14).map(([name,keyword,symbol,file])=>({name,keyword,symbol,file}));selectedCards=[];isConfirmed=false;$('#deckFan').innerHTML=availableCards.map((card,index)=>`<button class="pick-card" data-index="${index}" type="button" aria-label="选择第 ${index+1} 张牌" aria-pressed="false"><span class="pick-back"><i>✦</i></span></button>`).join('');$$('.pick-card').forEach(card=>card.addEventListener('click',()=>toggleCard(Number(card.dataset.index))));updateSelectionUI();}
function toggleCard(index){if(isConfirmed)return;const existing=selectedCards.findIndex(item=>item.index===index);if(existing>=0)selectedCards.splice(existing,1);else{if(selectedCards.length>=requiredCount())return;const card=availableCards[index];selectedCards.push({index,...card,orientation:orientation()});}updateSelectionUI();}
function updateSelectionUI(){const count=requiredCount();$$('.pick-card').forEach(card=>{const active=selectedCards.some(item=>item.index===Number(card.dataset.index));card.classList.toggle('selected',active);card.setAttribute('aria-pressed',String(active));});$('#deckMessage').textContent=selectedCards.length===count?'已经选够了，确认后揭晓结果':'请从牌堆中选择 '+count+' 张牌';const button=$('#drawBtn');button.disabled=selectedCards.length!==count;button.querySelector('span').textContent=selectedCards.length===count?'我选好了':'已选 '+selectedCards.length+' / '+count;}
function buildCopyText(){const spread=spreads[currentTopic],question=$('#question').value.trim();return ['月相占卜结果',`探索主题：${currentTopic==='love'?'关系与爱':currentTopic==='career'?'事业与方向':currentTopic==='daily'?'今日指引':'艰难抉择'}`,`牌阵：${spread.title} · ${spread.hint}`,question?`心里的问题：${question}`:'未填写具体问题','',...selectedCards.map((card,index)=>`${index+1}. ${spread.positions[index]}：${card.name}（${card.orientation}）`),'','请基于以上抽牌结果，给我一份温和、具体的解读。'].join('\n');}
function confirmSelection(){if(selectedCards.length!==requiredCount()||isConfirmed)return;isConfirmed=true;$('#drawBtn').disabled=true;$('#drawBtn').querySelector('span').textContent='已完成抽牌';$('#deckMessage').textContent='牌面已为你展开';$$('.pick-card').forEach(card=>card.disabled=true);renderResults();}
function renderResults(){const spread=spreads[currentTopic];$('#drawnCards').innerHTML=selectedCards.map((card,index)=>`<article class="drawn-card" style="animation-delay:${index*.08}s"><div class="mini-card"><img src="${imagePath(card)}" alt="${card.name}"><div class="mini-card-info"><strong class="mini-name">${card.name}</strong><small class="mini-position">${spread.positions[index]}</small><small class="mini-orientation">${card.orientation} · ${card.keyword}</small></div></div></article>`).join('');$('#resultText').value=buildCopyText();$('#resultSummary').textContent=`${selectedCards.length} 张牌 · 已完成抽牌`;$('#resultPanel').classList.remove('hidden');setTimeout(()=>$('#resultPanel').scrollIntoView({behavior:'smooth',block:'start'}),180);}
$$('.topic').forEach(button=>button.addEventListener('click',()=>{$$('.topic').forEach(item=>item.classList.remove('selected'));button.classList.add('selected');currentTopic=button.dataset.topic;$('#resultPanel').classList.add('hidden');renderSetup();window.scrollTo({top:0,behavior:'smooth'});}));
$('#drawBtn').addEventListener('click',confirmSelection);
$('#copyBtn').addEventListener('click',async()=>{const text=$('#resultText').value;if(!text)return;try{await navigator.clipboard.writeText(text);}catch{const area=$('#resultText');area.focus();area.select();document.execCommand('copy');}$('#copyBtn').textContent='已复制 ✓';$('#copyBtn').classList.add('copied');$('#copyStatus').textContent='结果已复制，可以交给 AI 解读';setTimeout(()=>{$('#copyBtn').textContent='复制结果';$('#copyBtn').classList.remove('copied');},2200);});
renderSetup();
