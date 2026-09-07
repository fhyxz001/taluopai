const spreads={
  love:{title:'关系与爱的三张牌',hint:'圣三角 · 过去 / 现在 / 未来',positions:['关系的根源','此刻的心意','关系的走向']},
  career:{title:'事业与方向的三张牌',hint:'行动牌阵 · 资源 / 阻力 / 下一步',positions:['你拥有的资源','正在面对的阻力','值得走向的方向']},
  daily:{title:'今日指引',hint:'一张牌 · 今天最重要的提醒',positions:['今日的核心能量']},
  choice:{title:'艰难抉择的五张牌',hint:'抉择牌阵 · 内心 / A / B / 盲点 / 建议',positions:['你真正想要的','选择 A 的能量','选择 B 的能量','容易忽略的盲点','此刻的行动建议']}
};
const deck=[
 ['愚者','新的开始','✦'],['魔术师','创造与行动','☿'],['女祭司','直觉与未知','☾'],['皇后','滋养与丰盛','❀'],['皇帝','秩序与边界','♜'],['教皇','经验与传统','✚'],['恋人','选择与连接','♡'],['战车','方向与胜意','➶'],['力量','勇气与耐心','♌'],['隐者','独处与寻找','⌁'],['命运之轮','变化与周期','◎'],['正义','平衡与责任','⚖'],['倒吊人','暂停与换位','▽'],['死神','结束与转化','☠'],['节制','融合与调整','⚗'],['恶魔','执念与束缚','⛓'],['高塔','突变与重建','ϟ'],['星星','希望与疗愈','★'],['月亮','迷雾与想象','☽'],['太阳','清晰与喜悦','☀'],['审判','觉醒与回应','♧'],['世界','完成与新章','◌']
];
let currentTopic='love';let currentCards=[];let isDrawing=false;
const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
function shuffle(items){return [...items].sort(()=>Math.random()-.5)}
function randomCards(count){return shuffle(deck).slice(0,count).map(card=>({...{name:card[0],keyword:card[1],symbol:card[2]},orientation:Math.random()>.72?'逆位':'正位'}))}
function renderSetup(){const spread=spreads[currentTopic];$('#spreadHint').textContent=spread.hint;$('#cardCount').textContent=String(spread.positions.length).padStart(2,'0');$('#deckMessage').textContent=`静下心来，准备好后抽 ${spread.positions.length} 张牌`}
function renderCards(){const spread=spreads[currentTopic];$('#drawnCards').innerHTML=currentCards.map((card,index)=>`<article class="drawn-card" style="animation-delay:${index*.08}s"><div class="mini-card"><div class="mini-symbol">${card.symbol}</div><strong class="mini-name">${card.name}</strong><small class="mini-position">${spread.positions[index]}</small><small class="mini-orientation">${card.orientation}</small></div></article>`).join('')}
function buildCopyText(){const spread=spreads[currentTopic];const question=$('#question').value.trim();const lines=['【塔罗抽牌结果】',`占卜方向：${topicLabel(currentTopic)}`,`牌阵：${spread.title}（${spread.hint.split(' · ')[1]||spread.hint}）`,question?`我的问题：${question}`:'我的问题：未填写','',...currentCards.map((card,index)=>`${index+1}. ${spread.positions[index]}：${card.name}（${card.orientation}）`),'','请根据以上牌阵位置、牌名与正逆位进行塔罗解读。暂不需要复述抽牌结果，请直接开始分析。'];return lines.join('\n')}
function topicLabel(topic){return {love:'关系与爱',career:'事业与方向',daily:'今日指引',choice:'艰难抉择'}[topic]}
function draw(){if(isDrawing)return;isDrawing=true;const stack=$('#deckStack');stack.classList.add('shuffling');$('#drawBtn').disabled=true;$('#drawBtn span').textContent='正在洗牌…';setTimeout(()=>{const spread=spreads[currentTopic];currentCards=randomCards(spread.positions.length);stack.classList.remove('shuffling');renderCards();$('#resultText').value=buildCopyText();$('#resultSummary').textContent=`${currentCards.length} 张牌已抽取 · 结果可复制`;$('#resultPanel').classList.remove('hidden');$('#drawBtn span').textContent='再次抽牌';$('#drawBtn').disabled=false;isDrawing=false;setTimeout(()=>$('#resultPanel').scrollIntoView({behavior:'smooth',block:'start'}),180)},900)}
function reset(){currentCards=[];$('#resultPanel').classList.add('hidden');$('#resultText').value='';$('#copyStatus').textContent='';$('#copyBtn').classList.remove('copied');$('#drawBtn span').textContent='开始抽牌';$('#deckMessage').textContent=`静下心来，准备好后抽 ${spreads[currentTopic].positions.length} 张牌`;window.scrollTo({top:0,behavior:'smooth'})}
$$('.topic').forEach(button=>button.addEventListener('click',()=>{$$('.topic').forEach(item=>item.classList.remove('selected'));button.classList.add('selected');currentTopic=button.dataset.topic;renderSetup();reset()}));
$('#drawBtn').addEventListener('click',()=>{if($('#resultPanel').classList.contains('hidden'))draw();else{reset();setTimeout(draw,150)}});$('#resetBtn').addEventListener('click',reset);
$('#copyBtn').addEventListener('click',async()=>{const text=$('#resultText').value;if(!text)return;try{await navigator.clipboard.writeText(text)}catch{const area=$('#resultText');area.focus();area.select();document.execCommand('copy')}$('#copyBtn').textContent='已复制 ✓';$('#copyBtn').classList.add('copied');$('#copyStatus').textContent='结果已复制，可以粘贴给 AI 进行解读';setTimeout(()=>{$('#copyBtn').textContent='复制结果';$('#copyBtn').classList.remove('copied')},2200)});
renderSetup();
