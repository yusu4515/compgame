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
        topic: '景品表示法',
        scenario: '誇大表示の恐れがある表現を使用した',
        correct: '表示の根拠となる事実と証拠を確認し、誤認を避ける',
        wrongs: [
          '競合がやっているので問題ないと判断する',
          '上司の指示なのでそのまま掲載する',
          '数値を丸めて有利に見えるよう調整する',
        ],
        explanation: '景品表示法では、根拠のない優良・有利誇大表示を禁止している。',
      },
      {
        topic: '下請法',
        scenario: '委託先への発注書の交付が遅れていた',
        correct: '取引条件を書面で明示し、期限内に交付する',
        wrongs: [
          '口頭合意だけで進める',
          '納品後に条件を調整する',
          '相手が慣れているので省略する',
        ],
        explanation: '下請法では取引条件の書面交付が義務付けられている。',
      },
      {
        topic: '契約管理',
        scenario: '契約書の重要条項が未確認のまま進行した',
        correct: '必須条項の確認とレビューを行い、リスクを明確化する',
        wrongs: [
          '取引先を信頼しているので確認しない',
          '後から修正できる前提で締結する',
          '担当者が忙しいので承認を省略する',
        ],
        explanation: '契約はリスク配分を定めるため、レビューが必須。',
      },
      {
        topic: '知的財産',
        scenario: '他社の資料を許諾なく引用した',
        correct: '利用許諾や引用要件を確認し適法に使用する',
        wrongs: [
          '社内資料なので問題ないと判断する',
          '引用元を削除して使用する',
          '利用後に許諾を取る',
        ],
        explanation: '著作権は許諾または引用要件の遵守が必要。',
      },
      {
        topic: '個人情報保護',
        scenario: '取得目的を示さずに顧客情報を収集した',
        correct: '利用目的を明示し、必要最小限の情報を取得する',
        wrongs: [
          '後で目的を説明すれば良い',
          '将来のために広く取得する',
          '委託先に任せるので説明不要',
        ],
        explanation: '個人情報は目的の明示と必要最小限が原則。',
      },
      {
        topic: '独占禁止法',
        scenario: '競合と価格情報を共有する話が出た',
        correct: '価格協定など競争制限につながる情報共有を避ける',
        wrongs: [
          '非公式なら問題ない',
          '業界慣習だから問題ない',
          '一度だけなら許容される',
        ],
        explanation: '価格や取引条件の協定は独禁法違反の恐れがある。',
      },
      {
        topic: '輸出管理',
        scenario: '海外取引で規制対象品の確認を省略した',
        correct: '該非判定と輸出管理手続きを確認する',
        wrongs: [
          '急ぎなので後回しにする',
          '少量だから問題ないと判断する',
          '取引先に任せる',
        ],
        explanation: '輸出管理は量に関わらず確認が必要。',
      },
      {
        topic: '贈収賄防止',
        scenario: '取引先から高額な接待の提案があった',
        correct: '会社規程に従い、贈答・接待の上限を確認する',
        wrongs: [
          '関係強化のために受け入れる',
          '個人負担なら問題ない',
          '事後報告で済ませる',
        ],
        explanation: '贈収賄防止のため、規程に基づく判断が必要。',
      },
      {
        topic: 'インサイダー取引',
        scenario: '未公表情報を知ったまま自社株の購入を検討した',
        correct: '未公表情報に基づく取引は行わず、情報管理を徹底する',
        wrongs: [
          '家族名義なら問題ない',
          '公開前に少額なら問題ない',
          '社内共有のみだから問題ない',
        ],
        explanation: '未公表重要事実に基づく取引は法令違反。',
      },
      {
        topic: '反社会的勢力排除',
        scenario: '取引先の背景調査が未実施だった',
        correct: '反社チェックを行い、疑義があれば取引を停止する',
        wrongs: [
          '紹介なので調査は不要',
          '契約後に調査する',
          '売上が重要なので無視する',
        ],
        explanation: '反社チェックは取引前に実施が必要。',
      },
    ],
  },
  {
    domain: 'finance',
    tribe: '強欲族',
    baseDifficulty: 1,
    topics: [
      {
        topic: '経費不正',
        scenario: '私的な出費を経費として申請した',
        correct: '業務関連性の確認と証憑の保存を徹底する',
        wrongs: [
          '少額なら問題ないと判断する',
          '他の経費と混ぜて処理する',
          '後で調整すれば良い',
        ],
        explanation: '経費は業務関連性と証憑が必要。',
      },
      {
        topic: '公私混同',
        scenario: '会社の資産を私的に使用した',
        correct: '会社資産は業務目的でのみ使用する',
        wrongs: [
          '短時間なら問題ない',
          '上司が許可したので自由に使う',
          '返却すれば問題ない',
        ],
        explanation: '会社資産の私的利用は不正行為に該当する。',
      },
      {
        topic: '税務',
        scenario: '領収書の記載内容が不十分だった',
        correct: '税務要件に合った証憑を取得・保管する',
        wrongs: [
          '内容が曖昧でも処理する',
          '同僚の領収書で代用する',
          '明細がなくても経費化する',
        ],
        explanation: '税務上の要件を満たす証憑の保存が必要。',
      },
      {
        topic: '収賄防止',
        scenario: '業者から金品の提供を受けた',
        correct: '社内規程に従い受領を拒否・報告する',
        wrongs: [
          '後で返せば問題ない',
          '少額なら受け取る',
          '個人間のやり取りだから問題ない',
        ],
        explanation: '金品受領は収賄に該当する恐れがある。',
      },
      {
        topic: '会計処理',
        scenario: '売上の計上時期を意図的に調整した',
        correct: '正しい期間に計上し、透明性を確保する',
        wrongs: [
          '目標達成のため調整する',
          '来期にまとめて計上する',
          '上司の指示で調整する',
        ],
        explanation: '適正な期間配分は会計の基本。',
      },
      {
        topic: '資金管理',
        scenario: '入金確認を行わずに出金処理した',
        correct: '入出金の整合を確認し二重チェックを行う',
        wrongs: [
          '忙しいので省略する',
          '担当者に任せる',
          '後から修正すれば良い',
        ],
        explanation: '資金管理は確認プロセスが重要。',
      },
      {
        topic: '棚卸',
        scenario: '実在庫と帳簿の差異を放置した',
        correct: '差異を分析し、原因を是正する',
        wrongs: [
          '次回にまとめて調整する',
          '差異を隠して報告する',
          '小さい差異なので無視する',
        ],
        explanation: '棚卸差異は原因特定と是正が必要。',
      },
      {
        topic: '内部統制',
        scenario: '承認プロセスを省略して支払処理した',
        correct: '権限ルールに従い承認を取得する',
        wrongs: [
          '緊急なので省略する',
          '後で承認を取る',
          '少額なら省略する',
        ],
        explanation: '内部統制は承認プロセスが要。',
      },
      {
        topic: '資産管理',
        scenario: '固定資産の廃棄記録がない',
        correct: '廃棄・除却の記録を残し監査可能にする',
        wrongs: [
          '口頭で済ませる',
          '保管期限が過ぎているので不要',
          '担当者の判断に任せる',
        ],
        explanation: '資産管理は記録と証跡が重要。',
      },
      {
        topic: '不正防止',
        scenario: '同一人物が申請と承認を担当していた',
        correct: '職務分掌を見直し牽制を確保する',
        wrongs: [
          '効率優先で続ける',
          '繁忙期だから仕方ない',
          '問題が起きてから対応する',
        ],
        explanation: '職務分掌は不正防止の基本。',
      },
    ],
  },
  {
    domain: 'hr',
    tribe: '毒霧族',
    baseDifficulty: 1,
    topics: [
      {
        topic: 'パワーハラスメント',
        scenario: '人格を否定する発言があった',
        correct: '言動を改め、相談窓口に共有する',
        wrongs: [
          '指導の一環なので問題ない',
          '当事者に我慢させる',
          '雰囲気を壊さないため黙認する',
        ],
        explanation: '人格否定はパワハラに該当する。',
      },
      {
        topic: 'セクシュアルハラスメント',
        scenario: '性的な冗談が業務中に行われた',
        correct: '不快な言動は禁止し、教育を徹底する',
        wrongs: [
          '場が盛り上がるので許容する',
          '個人間の問題として放置する',
          '当事者が笑っていたので問題ない',
        ],
        explanation: '性的な言動は職場環境を害する。',
      },
      {
        topic: '差別防止',
        scenario: '属性による評価の偏りがあった',
        correct: '職務能力に基づく評価基準を徹底する',
        wrongs: [
          '慣習なので続ける',
          '本人のためになると主張する',
          '上司の判断で決める',
        ],
        explanation: '公正な評価は差別防止の基本。',
      },
      {
        topic: '採用倫理',
        scenario: '採用面接で私生活を詮索した',
        correct: '業務上必要な質問に限定する',
        wrongs: [
          '人柄を知るために必要',
          '雑談だから問題ない',
          '回答が任意なら問題ない',
        ],
        explanation: '面接では適法・適正な質問が必要。',
      },
      {
        topic: 'メンタルヘルス',
        scenario: 'ストレス兆候を放置した',
        correct: '相談窓口の案内と早期フォローを行う',
        wrongs: [
          '本人の自己責任とする',
          '休暇を取らせず様子を見る',
          '成果が出るまで黙認する',
        ],
        explanation: '早期対応が職場の安全に繋がる。',
      },
      {
        topic: '労務相談',
        scenario: '相談内容を上司が軽視した',
        correct: '相談者保護と事実確認を行う',
        wrongs: [
          '本人が弱いだけと判断する',
          '忙しいので後回しにする',
          '第三者への相談を禁止する',
        ],
        explanation: '相談窓口は公正な対応が必要。',
      },
      {
        topic: '評価面談',
        scenario: '曖昧な基準で評価した',
        correct: '評価基準と根拠を明示する',
        wrongs: [
          '好き嫌いで判断する',
          '一部の成果だけで決める',
          '前例に合わせるだけで決める',
        ],
        explanation: '評価は透明性と説明責任が必要。',
      },
      {
        topic: '人材育成',
        scenario: '成長機会が偏っていた',
        correct: '公平な育成機会を提供する',
        wrongs: [
          '成果が出る人だけ優先する',
          '忙しいので育成しない',
          '自己学習に任せる',
        ],
        explanation: '育成機会の公平性は重要。',
      },
      {
        topic: '職場環境',
        scenario: '心理的安全性が低下していた',
        correct: '対話を促進し安心して意見できる環境を作る',
        wrongs: [
          '厳しい方が成果が出る',
          '意見を控えるよう指導する',
          '問題が起きてから対処する',
        ],
        explanation: '心理的安全性は生産性に直結する。',
      },
      {
        topic: '倫理',
        scenario: '社内規範に反する言動があった',
        correct: '企業倫理に基づき指導・是正する',
        wrongs: [
          '結果が出ているので許容する',
          '本人の裁量に任せる',
          '明文化されていないので無視する',
        ],
        explanation: '倫理違反は組織信頼を損なう。',
      },
    ],
  },
  {
    domain: 'labor',
    tribe: '怠惰族',
    baseDifficulty: 1,
    topics: [
      {
        topic: '勤怠管理',
        scenario: '実際の労働時間と申請が一致していない',
        correct: '実態に即した勤怠を記録し是正する',
        wrongs: [
          '残業申請を減らすよう指示する',
          '自己申告なので問題ない',
          '繁忙期だけ黙認する',
        ],
        explanation: '勤怠の正確な記録は労基法上必須。',
      },
      {
        topic: 'サービス残業',
        scenario: '業務量が多く残業申請が抑制された',
        correct: '残業を正しく申請し適正に管理する',
        wrongs: [
          '暗黙の了解として残業を認める',
          '申請がなければ払わない',
          '成果が出るまで我慢させる',
        ],
        explanation: 'サービス残業は法令違反となる。',
      },
      {
        topic: '休暇取得',
        scenario: '有給取得を妨げる発言があった',
        correct: '有給取得は権利として尊重する',
        wrongs: [
          '忙しい時期は取得禁止',
          '評価に影響すると伝える',
          '理由を細かく聞き出す',
        ],
        explanation: '有給休暇の取得は法的権利。',
      },
      {
        topic: '労働時間',
        scenario: '長時間労働が常態化していた',
        correct: '労働時間の管理と是正措置を行う',
        wrongs: [
          '自己管理として放置する',
          '成果が出れば問題ない',
          '健康管理は本人任せ',
        ],
        explanation: '過重労働は健康障害リスクが高い。',
      },
      {
        topic: '労災',
        scenario: '業務中の怪我を報告しなかった',
        correct: '速やかに報告し労災手続きを行う',
        wrongs: [
          '軽傷なので放置する',
          '評価が下がるので隠す',
          '自己負担で治療する',
        ],
        explanation: '労災は報告と適切な手続きが必要。',
      },
      {
        topic: 'シフト管理',
        scenario: '急なシフト変更が続いた',
        correct: '事前通知と労働者の合意を重視する',
        wrongs: [
          '会社都合で決める',
          '通知は口頭で済ませる',
          '繁忙期は強制する',
        ],
        explanation: 'シフト変更には適切な手続きが必要。',
      },
      {
        topic: '就業規則',
        scenario: '規程と違う運用が常態化した',
        correct: '就業規則を遵守し改定が必要なら手続きを行う',
        wrongs: [
          '慣習だから問題ない',
          '上司の指示に従う',
          '周知しないまま進める',
        ],
        explanation: '就業規則は労使のルールである。',
      },
      {
        topic: '健康管理',
        scenario: '健康診断の受診が未実施だった',
        correct: '法定健診を確実に受診させる',
        wrongs: [
          '自己申告で済ませる',
          '繁忙期は後回しにする',
          '希望者のみ受診させる',
        ],
        explanation: '法定健診の実施は事業者の義務。',
      },
      {
        topic: '安全配慮',
        scenario: '危険作業の手順が共有されていない',
        correct: '安全手順を整備し教育を行う',
        wrongs: [
          '経験者に任せる',
          '問題が起きてから対応する',
          '作業効率を優先する',
        ],
        explanation: '安全配慮義務は企業の責任。',
      },
      {
        topic: '勤務間インターバル',
        scenario: '連続勤務で休息時間が確保されていない',
        correct: '休息時間を確保し勤務計画を見直す',
        wrongs: [
          '本人が望むなら問題ない',
          '成果が出れば問題ない',
          '一時的なので容認する',
        ],
        explanation: '十分な休息確保は健康維持に必要。',
      },
    ],
  },
  {
    domain: 'infosec',
    tribe: '密偵族',
    baseDifficulty: 1,
    topics: [
      {
        topic: '情報漏洩',
        scenario: '機密情報を社外で閲覧できる状態にした',
        correct: 'アクセス権限と暗号化を徹底する',
        wrongs: [
          '短時間なら問題ない',
          '共有が便利なのでそのままにする',
          '後で消せば問題ない',
        ],
        explanation: '機密情報はアクセス制御が必須。',
      },
      {
        topic: 'パスワード管理',
        scenario: '同一パスワードの使い回しをしていた',
        correct: '強固なパスワードと多要素認証を使う',
        wrongs: [
          '覚えやすさを優先する',
          'チームで共有する',
          '頻繁に変えない',
        ],
        explanation: 'パスワード使い回しは重大リスク。',
      },
      {
        topic: 'フィッシング対策',
        scenario: '不審なメールのリンクを開こうとした',
        correct: '送信元とURLを確認し、怪しい場合は報告する',
        wrongs: [
          '急ぎなので開く',
          '添付ファイルだけ開く',
          '同僚に転送する',
        ],
        explanation: 'フィッシングは確認と報告が重要。',
      },
      {
        topic: '端末管理',
        scenario: '業務端末を無施錠で放置した',
        correct: '画面ロックを徹底し端末を管理する',
        wrongs: [
          '短時間なら問題ない',
          'パスワードを貼り付ける',
          '同僚に任せる',
        ],
        explanation: '端末放置は情報漏洩リスク。',
      },
      {
        topic: 'クラウド利用',
        scenario: '許可されていないクラウドにファイルを保存した',
        correct: '社内ルールに沿ったサービスのみ使用する',
        wrongs: [
          '便利なので使う',
          '後で移す',
          '個人アカウントなら問題ない',
        ],
        explanation: '未許可クラウド利用は管理外リスク。',
      },
      {
        topic: 'アクセス権',
        scenario: '退職者のアカウントが残っていた',
        correct: '権限を迅速に剥奪し管理台帳を更新する',
        wrongs: [
          '後でまとめて処理する',
          '念のため残す',
          'パスワード変更だけ行う',
        ],
        explanation: '不要アカウントは侵入経路になる。',
      },
      {
        topic: 'ログ管理',
        scenario: 'アクセスログの確認が行われていない',
        correct: 'ログを定期確認し異常を検知する',
        wrongs: [
          '問題が起きたときだけ見る',
          'ログは不要と判断する',
          '個人で保管する',
        ],
        explanation: 'ログ監視は早期検知に必要。',
      },
      {
        topic: 'ソフトウェア更新',
        scenario: 'セキュリティパッチが未適用だった',
        correct: '脆弱性対策として更新を適用する',
        wrongs: [
          '安定稼働のため更新しない',
          '利用者任せにする',
          '必要がある時だけ更新する',
        ],
        explanation: 'パッチ適用は脆弱性対策の基本。',
      },
      {
        topic: '持ち出し管理',
        scenario: 'USBに機密データを保存した',
        correct: '持ち出し申請と暗号化を徹底する',
        wrongs: [
          '私物USBで持ち出す',
          'パスワードを付けない',
          '社内に戻れば問題ない',
        ],
        explanation: '持ち出しは手続きと暗号化が必須。',
      },
      {
        topic: '委託先管理',
        scenario: '委託先のセキュリティ評価が未実施だった',
        correct: '委託先の管理体制を確認し契約に反映する',
        wrongs: [
          '信頼しているので確認しない',
          '価格が安いので問題ない',
          '事故が起きてから考える',
        ],
        explanation: '委託先管理は情報保護の要。',
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

  // 混合問題（ボーナスステージ向け）
  for (let i = 0; i < 30; i += 1) {
    const legalTopic = domainSeeds[0].topics[i % domainSeeds[0].topics.length];
    const hrTopic = domainSeeds[2].topics[(i + 3) % domainSeeds[2].topics.length];
    const infosecTopic = domainSeeds[4].topics[(i + 5) % domainSeeds[4].topics.length];
    questions.push({
      domain: 'mixed',
      tribe: '混沌の霧',
      difficulty: 5,
      questionText: `複合案件として、${legalTopic.scenario}と${hrTopic.scenario}が同時に発生し、さらに${infosecTopic.scenario}の兆候がある。最優先で行うべき対応はどれか。`,
      choices: [
        '緊急対応として事実確認と関係者の保護を同時に進め、報告体制を整える',
        '問題が落ち着くまで情報共有を止める',
        '担当者に任せて様子を見る',
        '社内に知られないように処理する',
      ],
      correctIndex: 0,
      explanation: '複合リスクでは事実確認・保護・報告の同時進行が必須。',
    });
  }

  return questions;
}
