import type { QuestionData } from './types';

type DomainSeed = {
  domain: string;
  tribe: string;
  baseDifficulty: number;
  topics: {
    topic: string;
    scenario: string;
    correct: string;
    wrongs: string[];
    explanation: string;
  }[];
};

const departments = [
  '営業部',
  '経理部',
  '人事部',
  '法務部',
  '情シス部',
  '購買部',
  '開発部',
  'マーケ部',
  'カスタマーサポート',
  '経営企画',
];

const subjects = [
  '広告キャンペーン',
  '委託契約',
  '請求処理',
  '採用面接',
  '勤怠申請',
  '顧客データ',
  '社内規程',
  '外部ベンダー',
  '業務端末',
  '取引先の提案',
];

const situations = [
  '急ぎの対応が求められた',
  '上司から強い要請があった',
  '成果が求められる局面だった',
  '繁忙期で時間に追われていた',
  '担当者が不在だった',
  '手順が曖昧だった',
  '先例が少ない案件だった',
  '予算が限られていた',
  '社内の理解が不足していた',
  '緊急度が高い案件だった',
];

const domainSeeds: DomainSeed[] = [
  {
    domain: 'legal',
    tribe: '幻影族',
    baseDifficulty: 1,
    topics: [
      {
        topic: '不当表示（広告の基本）',
        scenario: '「伝説の聖水」など根拠のない広告表現を掲げた',
        correct: '表示の根拠となる事実と証拠を確認し修正する',
        wrongs: [
          '話題になっているのでそのまま掲載する',
          '競合も似た表現をしているので続ける',
          '売上が伸びるまで様子を見る',
        ],
        explanation: '広告表示は根拠が必要で、誤認を招く表現は禁止。',
      },
      {
        topic: '優良誤認の禁止',
        scenario: '「万病に効く」と効果を断定した宣伝を行った',
        correct: '客観的根拠のない効果表示を削除し検証する',
        wrongs: [
          '少数の成功例があるので問題ないと判断する',
          '注釈で小さく補足すれば許される',
          '担当者の判断に任せる',
        ],
        explanation: '優良誤認は根拠のない断定的表示を禁じている。',
      },
      {
        topic: '有利誤認・おとり広告',
        scenario: '「今だけ無料」を繰り返し、実際は常時同条件だった',
        correct: '実際の条件に合わせた表示に改め、誤認を防ぐ',
        wrongs: [
          '購入を促すために継続する',
          '期間を明示せず曖昧にする',
          '表示の文言だけを変えて続ける',
        ],
        explanation: '有利誤認やおとり広告は消費者の判断を誤らせる。',
      },
      {
        topic: '契約内容確認義務',
        scenario: '友好の証として署名を求められた契約に危険な条項があった',
        correct: '契約内容を精査し、不当な条項は修正・拒否する',
        wrongs: [
          '信頼関係があるので確認しない',
          '署名してから確認する',
          '相手に任せて進める',
        ],
        explanation: '契約締結前の内容確認は重要な法務責任。',
      },
      {
        topic: '独占禁止法（不当な拘束条件）',
        scenario: '他社からの購入禁止を小さな文字で契約に入れた',
        correct: '不当な拘束条件は除外し、公正な取引を維持する',
        wrongs: [
          '取引拡大のためなら許容する',
          '相手が気づかなければ問題ない',
          '口頭で伝えなければ良い',
        ],
        explanation: '不当な拘束条件は独占禁止法違反の恐れがある。',
      },
      {
        topic: '商標権・不正競争防止法',
        scenario: '王室御用達を偽る紋章を使用した',
        correct: '商標やブランドの正当な使用許諾を確認する',
        wrongs: [
          '目立つのでそのまま利用する',
          'デザインを少し変えれば良い',
          '指摘されたら止める',
        ],
        explanation: '偽装表示や商標侵害は不正競争に該当する。',
      },
      {
        topic: '贈収賄・不適切な利益供与',
        scenario: '高級な贈り物で村役人に便宜を依頼した',
        correct: '贈答や接待は規程に従い、透明性を確保する',
        wrongs: [
          '慣習なので問題ない',
          '個人のやり取りだから許容する',
          '後で帳消しにすれば良い',
        ],
        explanation: '贈収賄は公正な競争を壊す重大な違反。',
      },
      {
        topic: '景品制限',
        scenario: '水1杯に過大な景品を付与する販促を企画した',
        correct: '景品規制に沿った上限を守る',
        wrongs: [
          '話題性があれば許される',
          'キャンペーンだから例外にする',
          '景品の価値を隠す',
        ],
        explanation: '景表法では景品類の提供に上限がある。',
      },
      {
        topic: '公正な競争',
        scenario: '虚偽表示で競合を排除する戦略が提案された',
        correct: '誠実な取引と公正な競争を優先する',
        wrongs: [
          '短期利益のために実行する',
          '相手が黙認するなら問題ない',
          '外部にバレなければ良い',
        ],
        explanation: '公正な競争は市場の信頼を守る基本。',
      },
      {
        topic: '消費者の権利と企業の責任',
        scenario: '消費者からの苦情対応が後回しにされていた',
        correct: '消費者の権利を尊重し誠実に対応する',
        wrongs: [
          'クレームは無視して売上を優先する',
          '責任を取引先に押し付ける',
          '対応は最小限にとどめる',
        ],
        explanation: '消費者の信頼は企業の責任で支えられる。',
      },
    ],
  },
  {
    domain: 'finance',
    tribe: '強欲族',
    baseDifficulty: 1,
    topics: [
      {
        topic: '資産の保全と会計の役割',
        scenario: '税金の使途が不明で公共事業が停止した',
        correct: '資産の所在を確認し、適正な会計処理を行う',
        wrongs: [
          '経営判断として黙認する',
          '記録がなければ諦める',
          '後からまとめて処理する',
        ],
        explanation: '会計は資産の保全と透明性を担う。',
      },
      {
        topic: '内部統制の基本',
        scenario: '国の予算で私邸が建てられていた',
        correct: '統制ルールを整え、権限を明確にする',
        wrongs: [
          '成果が出ているので許す',
          '特例として容認する',
          '記録を残さない',
        ],
        explanation: '内部統制は不正抑止と透明性の基盤。',
      },
      {
        topic: '職務分掌',
        scenario: '承認印を一人で管理し支出を進めた',
        correct: '承認と実行を分ける仕組みを導入する',
        wrongs: [
          '効率優先で続ける',
          '責任者がいれば問題ない',
          '後で監査すればよい',
        ],
        explanation: '職務分掌は不正防止の要。',
      },
      {
        topic: '稟議フローと決裁',
        scenario: '支出の記録がなく事後承認で済ませていた',
        correct: '稟議フローを守り、事前決裁を徹底する',
        wrongs: [
          'スピード優先で事後承認にする',
          '責任者の口頭承認で済ませる',
          '担当者に任せる',
        ],
        explanation: '稟議は正当な支出を証明する手続き。',
      },
      {
        topic: '公私混同の禁止',
        scenario: '公費で購入した備品を私用で持ち帰った',
        correct: '資産は業務目的でのみ使用する',
        wrongs: [
          '短期間なら問題ない',
          '返却すれば良い',
          '上司が許可したので使う',
        ],
        explanation: '公私混同は組織の信頼を失う。',
      },
      {
        topic: '不正会計・帳簿管理',
        scenario: '表帳簿と裏帳簿の内容が一致しない',
        correct: '帳簿を一元管理し、不正会計を是正する',
        wrongs: [
          '調整すれば問題ない',
          '外部に出さなければ大丈夫',
          '担当者の裁量で運用する',
        ],
        explanation: '帳簿の二重管理は不正会計に直結する。',
      },
      {
        topic: 'インサイダー取引',
        scenario: '未公表の政策情報を知り土地購入を検討した',
        correct: '未公表情報での取引を禁止し情報管理を徹底する',
        wrongs: [
          '家族名義なら問題ない',
          '少額なら許容する',
          '取引先に任せる',
        ],
        explanation: 'インサイダー取引は厳しく禁止されている。',
      },
      {
        topic: '架空経費・不正請求防止',
        scenario: '実在しない遠征報告で領収書を作成した',
        correct: '実態と証憑を照合し不正請求を防ぐ',
        wrongs: [
          '後から辻褄を合わせる',
          '少額なら問題ない',
          '監査が来るまで放置する',
        ],
        explanation: '架空経費は重大な不正。',
      },
      {
        topic: '経営の透明性と相互牽制',
        scenario: 'スピード優先を理由にガバナンスを軽視した',
        correct: '透明性と牽制を重視し意思決定を行う',
        wrongs: [
          '結果が出れば良い',
          '上層部の判断に従う',
          '不都合な情報は伏せる',
        ],
        explanation: '透明性と牽制は健全な経営に必須。',
      },
      {
        topic: '社会的信用の維持',
        scenario: '監査結果を隠し信用を損ねそうになった',
        correct: '事実を開示し改善することで信用を守る',
        wrongs: [
          '問題が大きくなるまで伏せる',
          '責任を部下に押し付ける',
          '外部への説明を避ける',
        ],
        explanation: '信用は正しい会計と誠実な説明で維持される。',
      },
    ],
  },
  {
    domain: 'hr',
    tribe: '毒霧族',
    baseDifficulty: 1,
    topics: [
      {
        topic: '組織風土とコンプライアンス',
        scenario: '命令は絶対という空気で相談ができない',
        correct: '風土を見直し意見を言える環境をつくる',
        wrongs: [
          '厳しい方が成果が出ると放置する',
          '相談を禁止する',
          '問題が起きるまで待つ',
        ],
        explanation: '健全な風土はコンプライアンスの土台。',
      },
      {
        topic: '言葉による暴力の影響',
        scenario: '人格否定の言葉で部下の心を傷つけた',
        correct: '尊重ある言葉を使いハラスメントを防止する',
        wrongs: [
          '指導なので問題ない',
          '本人が我慢すべき',
          '冗談として片付ける',
        ],
        explanation: '言葉の暴力は組織の信頼を壊す。',
      },
      {
        topic: 'パワーハラスメント',
        scenario: '人格否定を「厳しい教育」として続けた',
        correct: 'パワハラの定義を理解し是正する',
        wrongs: [
          '成果が出るなら許容する',
          '上司の権限だから問題ない',
          '被害者が弱いだけと判断する',
        ],
        explanation: 'パワハラは人格否定や過度な叱責を含む。',
      },
      {
        topic: '差別禁止・不当な評価',
        scenario: '出自を理由に重要任務から外した',
        correct: '能力と実績に基づく公平な評価を行う',
        wrongs: [
          '慣習なので続ける',
          '本人のためと主張する',
          '評価基準を曖昧にする',
        ],
        explanation: '差別的な扱いは法令と倫理に反する。',
      },
      {
        topic: '心理的安全性',
        scenario: 'ミスを報告できない雰囲気が広がった',
        correct: '相談できる環境を整え安心感を確保する',
        wrongs: [
          '問題が起きたら処罰する',
          '成果だけを重視する',
          '報告を控えるよう指示する',
        ],
        explanation: '心理的安全性はチーム力を高める。',
      },
      {
        topic: 'チームワークと倫理',
        scenario: '同僚を貶めて評価を上げようとした',
        correct: '協力と誠実さを重視して行動する',
        wrongs: [
          '競争だから仕方ない',
          'バレなければ問題ない',
          '他者の責任にする',
        ],
        explanation: '倫理的行動は組織全体の成果につながる。',
      },
      {
        topic: 'アンコンシャス・バイアス',
        scenario: '「新人だから」と固定観念で扱った',
        correct: '無意識の偏見に気づき公平に接する',
        wrongs: [
          '悪意がないので続ける',
          '経験則として正しいと主張する',
          '本人の努力不足とする',
        ],
        explanation: 'アンコンシャス・バイアスは多様性を阻害する。',
      },
      {
        topic: '内部通報制度',
        scenario: '被害者が声を上げられず問題が放置された',
        correct: '通報制度を整備し相談者を保護する',
        wrongs: [
          '匿名通報を禁止する',
          '上司だけに報告させる',
          '問題が表面化するまで待つ',
        ],
        explanation: '内部通報は早期是正のために必要。',
      },
      {
        topic: '人権の尊重',
        scenario: '恐怖で従わせる指導方針が続いた',
        correct: '人権と人格を尊重した指導に切り替える',
        wrongs: [
          '恐怖で統制する',
          '結果が出れば良い',
          '反論を封じる',
        ],
        explanation: '人権尊重は職場の基本原則。',
      },
      {
        topic: '多様性（D&I）',
        scenario: '多様な意見が無視される文化があった',
        correct: '多様性を尊重しチームの強みとして活かす',
        wrongs: [
          '多数派の意見だけを採用する',
          '異なる意見を排除する',
          '文化の違いを無視する',
        ],
        explanation: '多様性の尊重は組織の強さを生む。',
      },
    ],
  },
  {
    domain: 'infosec',
    tribe: '密偵族',
    baseDifficulty: 1,
    topics: [
      {
        topic: '情報資産の重要性',
        scenario: '作戦計画が外部に漏れていた',
        correct: '情報資産の重要性を共有し管理を徹底する',
        wrongs: [
          '一部なら問題ないと判断する',
          '口頭共有なので安心する',
          '気づかなければ放置する',
        ],
        explanation: '情報資産は組織の生命線。',
      },
      {
        topic: '物理的・環境的セキュリティ',
        scenario: '書類と端末を無施錠で放置した',
        correct: '施錠と持ち出し管理を徹底する',
        wrongs: [
          '短時間なら問題ない',
          '誰も見ないから大丈夫',
          '後で片付ける',
        ],
        explanation: '物理的管理は情報漏洩防止の基本。',
      },
      {
        topic: '外部媒体の禁止',
        scenario: '拾った魔道具を業務端末に接続した',
        correct: '不明な媒体は接続せず報告する',
        wrongs: [
          '動作確認だけ行う',
          '持ち主を探してから接続する',
          '社内だから問題ない',
        ],
        explanation: '外部媒体はウイルス感染の原因となる。',
      },
      {
        topic: 'フィッシング対策',
        scenario: '偽メールに誘導され合言葉を伝えそうになった',
        correct: '送信元やURLを確認し怪しい場合は報告する',
        wrongs: [
          '急ぎなので応じる',
          '一度だけなら大丈夫',
          '同僚に転送する',
        ],
        explanation: 'フィッシングは確認と報告が重要。',
      },
      {
        topic: '情報の格付け管理',
        scenario: '機密と公開情報の区別が曖昧だった',
        correct: '情報の格付けを明確にし取り扱いを徹底する',
        wrongs: [
          '全て公開してしまう',
          '個人の判断に任せる',
          '重要度を決めない',
        ],
        explanation: '格付け管理は漏洩リスクを下げる。',
      },
      {
        topic: 'SNS・社外発言の注意',
        scenario: '酒場での愚痴が敵に聞かれた',
        correct: '社外発言の影響を理解し慎重に行動する',
        wrongs: [
          '非公式だから問題ない',
          '匿名なら安心する',
          '冗談だから許される',
        ],
        explanation: '不用意な発言が情報漏洩につながる。',
      },
      {
        topic: 'パスワード管理',
        scenario: '古い結界（パスワード）が長年更新されていない',
        correct: '強固なパスワードと定期的な更新を行う',
        wrongs: [
          '覚えやすさを優先する',
          '共有して管理する',
          '更新は不要と判断する',
        ],
        explanation: '古いパスワードは侵入経路になる。',
      },
      {
        topic: '貸与機器の私的利用禁止',
        scenario: '公務用端末を私用に使い危険を招いた',
        correct: '貸与機器は業務目的に限定する',
        wrongs: [
          '少しなら使って良い',
          '業務と私用を混ぜる',
          'バレなければ使う',
        ],
        explanation: '私的利用は情報漏洩の原因になる。',
      },
      {
        topic: '手順遵守（標準化）',
        scenario: '決められた手順を省略して対応した',
        correct: '標準手順を守り再発防止に努める',
        wrongs: [
          '効率のため省略する',
          '自己判断で対応する',
          '問題が起きてから対応する',
        ],
        explanation: '手順遵守は安全と品質を守る。',
      },
      {
        topic: '情報漏洩防止の組織的徹底',
        scenario: 'ルールの徹底が不十分で情報が流出した',
        correct: '組織全体でルールを徹底し再発を防ぐ',
        wrongs: [
          '個人の注意に任せる',
          '問題が起きたら対応する',
          '最低限の対策で済ませる',
        ],
        explanation: '情報漏洩防止は全員で取り組む必要がある。',
      },
    ],
  },
  {
    domain: 'labor',
    tribe: '怠惰族',
    baseDifficulty: 1,
    topics: [
      {
        topic: '労働時間と健康の関係',
        scenario: '長時間労働で職人が疲弊していた',
        correct: '労働時間を管理し健康を守る',
        wrongs: [
          '成果が出れば問題ない',
          '本人の自己責任とする',
          '繁忙期だから放置する',
        ],
        explanation: '長時間労働は健康障害リスクが高い。',
      },
      {
        topic: '36協定・過重労働防止',
        scenario: '深夜まで働くことが美徳とされていた',
        correct: '36協定を遵守し過重労働を防止する',
        wrongs: [
          '暗黙の了解で続ける',
          '残業申請を控えさせる',
          '体力のある人に任せる',
        ],
        explanation: '過重労働は法令違反につながる。',
      },
      {
        topic: '属人化のリスク',
        scenario: '熟練者が倒れ業務が停止した',
        correct: '業務を分散し、引き継ぎ体制を整える',
        wrongs: [
          '一人に任せ続ける',
          '後で対応する',
          '成果が出ているので維持する',
        ],
        explanation: '属人化は組織の継続性を損なう。',
      },
      {
        topic: 'メンタルヘルス・セルフケア',
        scenario: '休息を取ることが罪悪とされていた',
        correct: '休息を尊重しセルフケアを促す',
        wrongs: [
          '休むと評価が下がると伝える',
          '忍耐を強要する',
          '相談を禁止する',
        ],
        explanation: 'メンタルヘルスの配慮は職場の責任。',
      },
      {
        topic: '安全配慮義務・監督責任',
        scenario: '上層部が現場の疲弊を無視した',
        correct: '管理者が安全配慮義務を果たす',
        wrongs: [
          '納期優先で進める',
          '現場任せにする',
          '問題が起きるまで放置する',
        ],
        explanation: '監督責任は労働者の安全を守る。',
      },
      {
        topic: '労働安全衛生法の遵守',
        scenario: '残業時間が限界を超えていた',
        correct: '労働安全衛生法を守り是正する',
        wrongs: [
          '成果が出ているので容認する',
          '黙って続けさせる',
          '上司の判断に任せる',
        ],
        explanation: '安全衛生法は健康を守る最低条件。',
      },
      {
        topic: 'ワークシェアリング',
        scenario: '特定の英雄に業務が集中していた',
        correct: '業務を分担し全員で支える',
        wrongs: [
          '一人に任せ続ける',
          '他の人材育成を後回しにする',
          '負担を無視する',
        ],
        explanation: 'ワークシェアリングで組織が強くなる。',
      },
      {
        topic: '労働生産性の向上',
        scenario: '長時間労働で成果が上がらない',
        correct: '効率化で短時間に成果を出す',
        wrongs: [
          'さらに残業を増やす',
          '休憩を削る',
          '人手不足を放置する',
        ],
        explanation: '生産性向上は持続的な成果につながる。',
      },
      {
        topic: '時間搾取の否定・人権尊重',
        scenario: '他人の時間を吸い取るような働かせ方があった',
        correct: '人権を尊重し時間搾取を否定する',
        wrongs: [
          '成果が出れば問題ない',
          '努力が足りないと責める',
          '時間管理を無視する',
        ],
        explanation: '人の時間は尊重されるべき権利。',
      },
      {
        topic: 'ワークライフバランスの実現',
        scenario: '休息を取らず働くことが当たり前になった',
        correct: '適切な休息と働き方のバランスを整える',
        wrongs: [
          '休むと評価が下がると伝える',
          '働き続けることを推奨する',
          '休暇を制限する',
        ],
        explanation: 'ワークライフバランスは持続的な成長に必須。',
      },
    ],
  },
  {
    domain: 'mixed',
    tribe: '魔王軍',
    baseDifficulty: 3,
    topics: [
      {
        topic: '短期利益と長期的価値',
        scenario: '短期利益を優先し長期的な信頼を犠牲にしようとした',
        correct: '長期的な価値と信頼を守る判断をする',
        wrongs: [
          '短期利益だけを追求する',
          '数値目標だけで判断する',
          '将来の問題を無視する',
        ],
        explanation: '長期的価値を守ることが持続的な成長につながる。',
      },
      {
        topic: 'コンプライアンスの誘惑と罠',
        scenario: 'ルールを捨てれば早く成果が出ると誘われた',
        correct: '誘惑に乗らずルール遵守を貫く',
        wrongs: [
          '一度だけなら許容する',
          '成果優先で進める',
          '周囲に秘密にする',
        ],
        explanation: 'コンプライアンス違反は後に大きな損失となる。',
      },
      {
        topic: '誠実さ（インテグリティ）',
        scenario: '小さな嘘を積み重ねた結果、信頼を失った',
        correct: '誠実さを守り事実に基づいて行動する',
        wrongs: [
          '成果が出れば嘘は許される',
          '小さな嘘は問題ない',
          '指摘されたら認める',
        ],
        explanation: 'インテグリティは組織の信用基盤。',
      },
      {
        topic: '倫理的ジレンマの解消',
        scenario: 'ルールを守ると目標達成が難しい状況に直面した',
        correct: '倫理的観点から最善策を検討し選択する',
        wrongs: [
          'ルールを無視して達成を優先する',
          '上司に責任を押し付ける',
          '結果が出れば良いと割り切る',
        ],
        explanation: '倫理的判断は長期的な信頼を守る。',
      },
      {
        topic: 'ステークホルダーとの協調',
        scenario: '関係者の意見を無視して意思決定した',
        correct: 'ステークホルダーと協調し透明性を確保する',
        wrongs: [
          '自社都合で進める',
          '反対意見を排除する',
          '短期の利益だけを見る',
        ],
        explanation: '協調は持続的な価値創出に不可欠。',
      },
      {
        topic: '企業の社会的責任（CSR）',
        scenario: '結果だけを重視し社会的影響を無視した',
        correct: '社会的責任を果たす行動を優先する',
        wrongs: [
          '利益が出れば良い',
          '社会的影響は後回しにする',
          '外部に責任を押し付ける',
        ],
        explanation: 'CSRは企業の信頼を支える柱。',
      },
      {
        topic: '継続的な学びの成果',
        scenario: '学びを止め、過去の成功に頼ってしまった',
        correct: '継続的に学び改善し続ける',
        wrongs: [
          '過去の成功に頼る',
          '学びを後回しにする',
          '失敗を隠す',
        ],
        explanation: '継続的な学びが変化への適応力を高める。',
      },
      {
        topic: '目的と手段の履き違え防止',
        scenario: '効率を優先し本来の目的を見失った',
        correct: '目的と手段を整理し、本質的な価値を守る',
        wrongs: [
          '手段を正当化する',
          '結果が出れば良いと考える',
          '目的を曖昧にする',
        ],
        explanation: '目的と手段を取り違えると倫理が崩れる。',
      },
      {
        topic: '総合的な判断力・リーダーシップ',
        scenario: '複合不祥事に対して判断が迷走した',
        correct: '総合的に状況を分析し適切に判断する',
        wrongs: [
          '一部の情報だけで判断する',
          '責任を回避する',
          '対処を先延ばしにする',
        ],
        explanation: 'リーダーシップは複合課題で真価を発揮する。',
      },
      {
        topic: '持続可能な社会（ESG）への貢献',
        scenario: '環境や社会への配慮を無視した施策を進めた',
        correct: 'ESGを意識し持続可能な取り組みを進める',
        wrongs: [
          'コスト優先で進める',
          '環境負荷を無視する',
          '短期利益に集中する',
        ],
        explanation: 'ESGへの貢献は企業の未来を守る。',
      },
    ],
  },
];

function createQuestion(
  seed: DomainSeed,
  topicIndex: number,
  variationIndex: number
): QuestionData {
  const topic = seed.topics[topicIndex];
  const department = departments[(topicIndex + variationIndex) % departments.length];
  const subject = subjects[(variationIndex + seed.baseDifficulty) % subjects.length];
  const situation = situations[(topicIndex + variationIndex * 2) % situations.length];
  const difficulty = Math.min(5, seed.baseDifficulty + (variationIndex % 5));

  const questionText = `${department}で${subject}に関する業務中、${topic.scenario}。${situation}が続く中で最も適切な対応はどれか。`;
  const choices = [topic.correct, ...topic.wrongs];

  return {
    domain: seed.domain,
    tribe: seed.tribe,
    difficulty,
    questionText,
    choices,
    correctIndex: 0,
    explanation: topic.explanation,
  };
}

export function generateQuestions(): QuestionData[] {
  const questions: QuestionData[] = [];

  domainSeeds.forEach((seed) => {
    seed.topics.forEach((topic, topicIndex) => {
      for (let variationIndex = 0; variationIndex < 10; variationIndex += 1) {
        questions.push(createQuestion(seed, topicIndex, variationIndex));
      }
    });
  });

  return questions;
}
