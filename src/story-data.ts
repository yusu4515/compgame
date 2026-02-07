import type { Chapter, StoryLine } from './types';

const NPC_IMAGES = {
  sage: '/static/assets/avatars/avatar-queen-mage.png',
  villager: '/static/assets/avatars/avatar-fox-mage.png',
  knight: '/static/assets/avatars/avatar-male-knight.png',
  clerk: '/static/assets/avatars/avatar-heroine-knight.png',
  steward: '/static/assets/avatars/avatar-rabbit-paladin.png',
  guard: '/static/assets/avatars/avatar-wolf-guardian.png',
  artisan: '/static/assets/avatars/avatar-knight-cat.png',
};

const ENEMY_IMAGE = '/static/assets/visuals/monster-compendium.png';

const narrator = (text: string): StoryLine => ({
  role: 'narrator',
  text,
  speakerName: '語り部',
  portrait: NPC_IMAGES.sage,
});

const hero = (text: string, partnerRole: StoryLine['role'] = 'ally'): StoryLine => ({
  role: 'hero',
  text,
  partnerRole,
});

const ally = (text: string, speakerName?: string, portrait?: string): StoryLine => ({
  role: 'ally',
  text,
  speakerName,
  portrait,
});

const enemy = (text: string, speakerName?: string, portrait?: string): StoryLine => ({
  role: 'enemy',
  text,
  speakerName,
  portrait,
});

/**
 * 全ストーリーチャプターデータ
 */
export const chapters: Chapter[] = [
  {
    id: 'prologue',
    title: 'プロローグ',
    subtitle: '目覚めと守護者の印',
    category: '導入',
    narration: [
      narrator('誠実の魔力で栄えたエシカル王国は、いま混沌の霧に覆われている。'),
      narrator('霧は人々の良心を奪い、不祥事モンスターを生み出した。'),
      ally('目覚めたか、{hero}よ。ここは王城の宝物庫だ。', '大賢者アウレリア', NPC_IMAGES.sage),
      hero('あなたは…誰ですか？', 'ally'),
      ally('守護者の証が、君を選んだ。学びと誠実が王国を救う。', '大賢者アウレリア', NPC_IMAGES.sage),
      narrator('水晶は暖かな光を放ち、{hero}の胸に誓いを刻んだ。'),
      hero('僕が王国を救う…。', 'ally'),
      ally('五つの聖域へ向かい、霧の源を浄化するのだ。', '大賢者アウレリア', NPC_IMAGES.sage),
      narrator('王城の門が開く。風は新たな旅の匂いを運んだ。'),
      hero('行こう。守護者として。', 'ally'),
    ],
    stage: '王城・宝物庫',
    monster: 'なし',
    scenario: '守護者としての覚醒',
    playerRole: '守護者の証を受け取り、王国を救う旅に出る',
    cleared: false,
    order: 0,
    quizTriggers: [4],
    ally: {
      name: '大賢者アウレリア',
      image: NPC_IMAGES.sage,
    },
  },
  {
    id: 'chapter1',
    title: '第一章',
    subtitle: '欺瞞の砂漠',
    category: '法務分野',
    narration: [
      narrator('蜃気楼の砂漠では、幻影族が偽りの契約で村人を縛りつけている。'),
      ally('守護者さま、オアシスの水が独占されているのです。', 'オアシス村の長老', NPC_IMAGES.villager),
      hero('偽の契約書で支配しているのか…。', 'ally'),
      enemy('この契約は完璧だ。誰も私を止められない!', '幻影族の首領', ENEMY_IMAGE),
      ally('助けてください、子どもたちが渇いています。', 'オアシス村の長老', NPC_IMAGES.villager),
      hero('法の力で幻影を暴こう。証拠と記録が真実を示す。', 'enemy'),
      enemy('ならば見せてみろ、真実の裁きを!', '幻影族の首領', ENEMY_IMAGE),
      narrator('{hero}は契約の矛盾を突き、砂漠の幻影は揺らいだ。'),
      ally('勇者さま、村は救われますか?', 'オアシス村の長老', NPC_IMAGES.villager),
      hero('必ず救う。正しい取引の光で。', 'ally'),
    ],
    stage: '蜃気楼の広がる砂漠',
    monster: '幻影族(ファントム)',
    scenario: '偽の契約書による支配を打破',
    playerRole: '正しい取引のルールで幻影を破壊する',
    cleared: false,
    order: 1,
    quizTriggers: [3, 7],
    ally: {
      name: 'オアシス村の長老',
      image: NPC_IMAGES.villager,
    },
    enemy: {
      name: '幻影族の首領',
      image: ENEMY_IMAGE,
    },
  },
  {
    id: 'chapter2',
    title: '第二章',
    subtitle: '強欲の地下迷宮',
    category: '経理分野',
    narration: [
      narrator('金貨の迷宮では、強欲族が公金を魔力の糧に変えている。'),
      ally('守護者さま、帳簿が消え、金庫の鍵も奪われました。', '王国の会計官', NPC_IMAGES.clerk),
      hero('公金の私物化は王国を蝕む。', 'ally'),
      enemy('これは投資だ! 私の力が王国を富ませる!', '強欲族の巨獣', ENEMY_IMAGE),
      ally('数字が嘘を吐けば、民は苦しみます。', '王国の会計官', NPC_IMAGES.clerk),
      hero('正しい精算と記録で、真実の鏡を磨こう。', 'enemy'),
      enemy('ならば計算勝負だ、守護者!', '強欲族の巨獣', ENEMY_IMAGE),
      narrator('迷宮の壁が歪み、金貨が叫び声を上げた。'),
      ally('どうか、帳簿を取り戻してください。', '王国の会計官', NPC_IMAGES.clerk),
      hero('必ず取り戻す。公私の境を示すために。', 'ally'),
    ],
    stage: '金貨に埋め尽くされた迷宮',
    monster: '強欲族(グリーディ)',
    scenario: '公金の不正使用による堕落',
    playerRole: '公私混同を正し、正しい金銭管理を示す',
    cleared: false,
    order: 2,
    quizTriggers: [3, 7],
    ally: {
      name: '王国の会計官',
      image: NPC_IMAGES.clerk,
    },
    enemy: {
      name: '強欲族の巨獣',
      image: ENEMY_IMAGE,
    },
  },
  {
    id: 'chapter3',
    title: '第三章',
    subtitle: '沈黙の毒霧の森',
    category: '人事分野',
    narration: [
      narrator('毒霧の森では、言葉の刃が心を刺し、仲間を疑わせる。'),
      ally('守護者さま、隊長の言葉が怖くて誰も話せません。', '若き騎士団員', NPC_IMAGES.knight),
      hero('言葉は人を支える力になる。', 'ally'),
      enemy('弱者に優しさなど不要だ! 恐怖で縛れ!', '毒霧族の影', ENEMY_IMAGE),
      ally('叱責ばかりで心が折れそうです。', '若き騎士団員', NPC_IMAGES.knight),
      hero('敬意を持つ対話こそが信頼を守る。', 'enemy'),
      enemy('ならば霧の刃で試してみろ!', '毒霧族の影', ENEMY_IMAGE),
      narrator('紫の霧が濃くなり、森の静寂が破られる。'),
      ally('私たちも変わりたい…助けてください。', '若き騎士団員', NPC_IMAGES.knight),
      hero('共に誠実な言葉を取り戻そう。', 'ally'),
    ],
    stage: '毒霧の漂う静寂の森',
    monster: '毒霧族(ミストウォーカー)',
    scenario: 'パワハラによる信頼の崩壊',
    playerRole: '他者を敬う心で毒霧を浄化する',
    cleared: false,
    order: 3,
    quizTriggers: [3, 7],
    ally: {
      name: '若き騎士団員',
      image: NPC_IMAGES.knight,
    },
    enemy: {
      name: '毒霧族の影',
      image: ENEMY_IMAGE,
    },
  },
  {
    id: 'chapter4',
    title: '第四章',
    subtitle: '影の包囲網',
    category: '情シス分野',
    narration: [
      narrator('夜の城下町では、密偵族が鍵の開いた窓を狙っている。'),
      ally('守護者さま、結界の鍵が閉じられていません!', '情報守護官', NPC_IMAGES.guard),
      hero('小さな油断が致命傷になる。', 'ally'),
      enemy('鍵一つの隙が、王国の秘密を暴く!', '密偵族の影', ENEMY_IMAGE),
      ally('この魔導書が漏れれば、王国は崩れます。', '情報守護官', NPC_IMAGES.guard),
      hero('手順を守り、結界を再構築する。', 'enemy'),
      enemy('守護者よ、油断の代償を味わえ!', '密偵族の影', ENEMY_IMAGE),
      narrator('暗闇の視線が交錯し、警報が鳴り響いた。'),
      ally('守護者さま、私たちも学び直します。', '情報守護官', NPC_IMAGES.guard),
      hero('共に守ろう、王国の秘宝を。', 'ally'),
    ],
    stage: '暗闇に包まれた城下町',
    monster: '密偵族(スパイ・シャドウ)',
    scenario: '情報漏洩の危機',
    playerRole: '情報保護の結界を張り、侵入者を阻止',
    cleared: false,
    order: 4,
    quizTriggers: [3, 7],
    ally: {
      name: '情報守護官',
      image: NPC_IMAGES.guard,
    },
    enemy: {
      name: '密偵族の影',
      image: ENEMY_IMAGE,
    },
  },
  {
    id: 'chapter5',
    title: '第五章',
    subtitle: '歪んだ時計塔',
    category: '労務分野',
    narration: [
      narrator('時計塔では歯車が暴走し、人々の休息が奪われている。'),
      ally('守護者さま、弟子たちは眠れずに倒れています。', '時計職人の弟子', NPC_IMAGES.artisan),
      hero('休息は力を取り戻す聖なる時間だ。', 'ally'),
      enemy('働き続けろ! 休む者は弱者だ!', '怠惰族の監督', ENEMY_IMAGE),
      ally('師匠は呪いにかかり、止められません…。', '時計職人の弟子', NPC_IMAGES.artisan),
      hero('健全な労働こそが持続の力になる。', 'enemy'),
      enemy('ならばお前の意思で歯車を止めてみろ!', '怠惰族の監督', ENEMY_IMAGE),
      narrator('塔の鐘が歪み、時間が崩れていく。'),
      ally('どうか、休息の光を取り戻してください。', '時計職人の弟子', NPC_IMAGES.artisan),
      hero('共に歯車を正しいリズムに戻そう。', 'ally'),
    ],
    stage: '狂った歯車の時計塔',
    monster: '怠惰族(スロース)',
    scenario: '過重労働による崩壊',
    playerRole: '歯車を止め、健全な労働を取り戻す',
    cleared: false,
    order: 5,
    quizTriggers: [3, 7],
    ally: {
      name: '時計職人の弟子',
      image: NPC_IMAGES.artisan,
    },
    enemy: {
      name: '怠惰族の監督',
      image: ENEMY_IMAGE,
    },
  },
  {
    id: 'final',
    title: '終章',
    subtitle: '成果至上主義の魔王',
    category: '最終決戦',
    narration: [
      narrator('五つの聖域を浄化した{hero}の前に、魔王コンプラ・ブレイカーが現れる。'),
      enemy('結果さえ出せば正義だ! 不祥事など些細な犠牲だ!', '魔王コンプラ・ブレイカー', ENEMY_IMAGE),
      hero('誠実を捨てた成果は王国を滅ぼす。', 'enemy'),
      ally('守護者よ、私たちの誓いを思い出して。', '五賢者の声', NPC_IMAGES.sage),
      hero('五つの聖典の光を合わせ、正義を示す!', 'enemy'),
      enemy('ならば最後の試練だ、守護者!', '魔王コンプラ・ブレイカー', ENEMY_IMAGE),
      narrator('証は黄金に燃え上がり、王国中に光が広がる。'),
      ally('守護者よ、あなたの誠実は未来を守る。', '五賢者の声', NPC_IMAGES.sage),
      hero('この光で、混沌を終わらせる。', 'enemy'),
      narrator('魔王は霧と共に消え、王国に澄んだ空が戻った。'),
    ],
    stage: '王城・玉座の間',
    monster: '魔王コンプラ・ブレイカー',
    scenario: '独善的な正義との対決',
    playerRole: '5つの力を結集し、魔王を討伐',
    cleared: false,
    order: 6,
    quizTriggers: [2, 5, 8],
    ally: {
      name: '五賢者の声',
      image: NPC_IMAGES.sage,
    },
    enemy: {
      name: '魔王コンプラ・ブレイカー',
      image: ENEMY_IMAGE,
    },
  },
  {
    id: 'bonus',
    title: 'ボーナスステージ',
    subtitle: '古の審判所',
    category: '究極の試練',
    narration: [
      narrator('隠し扉の先に、古の審判所が姿を現す。'),
      ally('守護者よ、ここは真の誓いを試す場所。', '古き守護者の幻影', NPC_IMAGES.steward),
      hero('さらなる試練が待っているのか。', 'ally'),
      enemy('全ての不正が混ざり合えば、誠実は崩れる。', '複合不祥事の幻影', ENEMY_IMAGE),
      ally('判断を迷えば霧は戻る。心して進むのだ。', '古き守護者の幻影', NPC_IMAGES.steward),
      hero('ならば全分野の知恵を重ねよう。', 'enemy'),
      enemy('守護者よ、統合された試練に挑め!', '複合不祥事の幻影', ENEMY_IMAGE),
      narrator('審判所に過去の守護者たちの声が響き渡る。'),
      ally('真の守護者として名を刻むのだ。', '古き守護者の幻影', NPC_IMAGES.steward),
      hero('受けて立つ。誠実の最後の証明だ。', 'enemy'),
    ],
    stage: '古の審判所',
    monster: '複合不祥事の幻影',
    scenario: '全分野が融合した究極の試練',
    playerRole: '真の守護者として、完璧な判断を下す',
    cleared: false,
    order: 7,
    quizTriggers: [2, 5, 8],
    ally: {
      name: '古き守護者の幻影',
      image: NPC_IMAGES.steward,
    },
    enemy: {
      name: '複合不祥事の幻影',
      image: ENEMY_IMAGE,
    },
  },
];

/**
 * チャプターIDからチャプター情報を取得
 */
export function getChapter(id: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

/**
 * 全チャプターを取得
 */
export function getAllChapters(): Chapter[] {
  return chapters;
}

/**
 * 次のチャプターを取得
 */
export function getNextChapter(currentId: string): Chapter | undefined {
  const currentChapter = getChapter(currentId);
  if (!currentChapter) return undefined;

  return chapters.find((chapter) => chapter.order === currentChapter.order + 1);
}
