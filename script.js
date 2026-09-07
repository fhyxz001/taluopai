const spreads = {
  love: { title: '关系与爱的三张牌', subtitle: '过去 · 现在 · 未来', positions: ['关系的根源', '此刻的心意', '关系的走向'] },
  career: { title: '事业与方向的三张牌', subtitle: '资源 · 阻力 · 下一步', positions: ['你拥有的资源', '正在面对的阻力', '值得走向的方向'] },
  daily: { title: '今日指引', subtitle: '一张牌 · 一个提醒', positions: ['今日的核心能量'] },
  choice: { title: '艰难抉择的五张牌', subtitle: '内心 · 选项 A · 选项 B · 盲点 · 建议', positions: ['你真正想要的', '选择 A 的能量', '选择 B 的能量', '容易忽略的盲点', '此刻的行动建议'] }
};

const deck = [
  ['愚者','新的开始并不需要完整的地图。允许自己先迈出一步，未知会在路上逐渐显形。','✦'],
  ['魔术师','你手上的工具已经足够。把分散的想法聚拢起来，主动创造，而不是等待时机降临。','☿'],
  ['女祭司','答案藏在安静处，也藏在你已经察觉却暂时忽略的直觉里。先听，再行动。','☾'],
  ['皇后','滋养与丰盛正在发生。用温柔对待自己，好的关系和成果需要被耐心培育。','❀'],
  ['皇帝','为混乱建立边界。清晰的规则、稳定的节奏，会帮助你重新拿回主导权。','♜'],
  ['教皇','向成熟的经验请教并不等于失去自我。传统里或许藏着一条可靠的捷径。','✚'],
  ['恋人','真正的选择始于诚实地承认自己的价值排序。别只问哪条路更安全，也问哪条更像你。','♡'],
  ['战车','方向一旦确定，犹豫就会消耗力量。驾驭相反的情绪，朝同一个目标持续前进。','➶'],
  ['力量','不必用强硬证明勇敢。稳定、耐心与对脆弱的接纳，才是此刻最有穿透力的力量。','♌'],
  ['隐者','暂时离开喧闹并不是退缩，而是在寻找自己的灯。给思考留出不被打扰的时间。','⌁'],
  ['命运之轮','局面正在转动，旧的周期即将松开。抓住变化给出的窗口，但不要试图控制全部结果。','◎'],
  ['正义','让事实与感受都被看见。一个公平的决定，通常需要你承担与选择相等的责任。','⚖'],
  ['倒吊人','换一个角度，停下来，反而会带来进展。某种暂时的延迟正在帮你看清代价与意义。','▽'],
  ['死神','结束不是惩罚，是空间被清理出来。放下已经完成使命的旧身份，新的章节才会有位置。','☠'],
  ['节制','不要急着二选一，先寻找能够共存的比例。温和的调整，会带来持续而真实的改变。','⚗'],
  ['恶魔','看见让你上瘾的东西：恐惧、执念，或一段不再平等的交换。意识本身就是松绑的开始。','⛓'],
  ['高塔','一个不稳固的结构正在崩塌。虽然突然，却也替更诚实的生活腾出了空间。','ϟ'],
  ['星星','希望不是盲目乐观，而是你在破碎之后依然愿意相信未来。恢复、疗愈与灵感都在靠近。','★'],
  ['月亮','不确定感会放大想象。暂缓下结论，等雾散一些；梦境和情绪值得记录，但不必立刻服从。','☽'],
  ['太阳','清晰、热度与坦率会照亮局面。把真实的喜悦说出来，你会发现支持比想象中更多。','☀'],
  ['审判','一个旧问题正在呼唤最终回应。原谅过去的自己，听见内心真正准备好承担的召唤。','♧'],
  ['世界','一段旅程正在完整地闭合。庆祝已经走过的路，然后把经验带入更辽阔的下一轮。','◌']
];

let currentSpread = 'love';
let currentCards = [];
let revealed = 0;

const $ = (selector) => document.querySelector(selector);
const options = document.querySelectorAll('.spread-option');
const cardsEl = $('#cards');
const resultsEl = $('#results');
const resultGrid = $('#resultGrid');

function shuffledDeck() {
  return [...deck].sort(() => Math.random() - 0.5);
}

function renderReading() {
  const spread = spreads[currentSpread];
  $('#readingTitle').textContent = spread.title;
  $('#readingSubtitle').textContent = spread.subtitle;
  $('#progress').textContent = `已翻开 0 / ${spread.positions.length}`;
  $('#drawBtn').textContent = '开始抽牌';
  currentCards = shuffledDeck().slice(0, spread.positions.length);
  revealed = 0;
  cardsEl.innerHTML = spread.positions.map((position, index) => `
    <div class="card-slot locked" data-index="${index}">
      <div class="tarot-card" role="button" tabindex="0" aria-label="翻开第 ${index + 1} 张牌">
        <div class="card-inner">
          <div class="card-face card-back"></div>
          <div class="card-face card-front" style="--art-glow: ${index % 2 ? 'rgba(110, 162, 157, .45)' : 'rgba(174, 116, 143, .45)'}">
            <div class="card-art">${currentCards[index][2]}</div>
            <div class="card-name">${currentCards[index][0]}</div>
            <div class="card-position">${position}</div>
          </div>
        </div>
      </div>
      <div class="card-caption">待翻开</div>
    </div>`).join('');
  resultGrid.innerHTML = '<p class="empty-results">翻开牌面后，你的专属解读会在这里出现。</p>';
  resultsEl.classList.remove('visible');
  cardsEl.querySelectorAll('.tarot-card').forEach((card) => {
    card.addEventListener('click', () => revealCard(Number(card.closest('.card-slot').dataset.index)));
    card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') revealCard(Number(card.closest('.card-slot').dataset.index)); });
  });
}

function revealCard(index) {
  if (index !== revealed) return;
  const slot = cardsEl.querySelector(`[data-index="${index}"]`);
  if (!slot || !slot.classList.contains('locked')) return;
  slot.classList.remove('locked');
  slot.querySelector('.tarot-card').classList.add('flipped');
  slot.querySelector('.card-caption').textContent = '已揭示';
  revealed++;
  $('#progress').textContent = `已翻开 ${revealed} / ${currentCards.length}`;
  $('#drawBtn').textContent = revealed < currentCards.length ? '翻开下一张' : '查看完整解读';
  if (revealed === currentCards.length) showResults();
}

function showResults() {
  resultGrid.innerHTML = currentCards.map((card, index) => `<article class="result"><div class="result-top"><h3>${card[0]}</h3><span class="result-tag">${spreads[currentSpread].positions[index]}</span></div><p>${card[1]}</p></article>`).join('');
  resultsEl.classList.add('visible');
  setTimeout(() => resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 160);
}

options.forEach((option) => option.addEventListener('click', () => {
  options.forEach((item) => item.classList.remove('selected'));
  option.classList.add('selected');
  currentSpread = option.dataset.spread;
  renderReading();
  $('#reading').scrollIntoView({ behavior: 'smooth', block: 'center' });
}));

$('#drawBtn').addEventListener('click', () => {
  if (revealed < currentCards.length) revealCard(revealed);
  else showResults();
});
$('#resetBtn').addEventListener('click', renderReading);
renderReading();
