import { DiagnosisArchetype } from '../types/arcana';

export const diagnosisArchetypes: DiagnosisArchetype[] = [
  {
    id: 1,
    title: '外発 × 個人（純粋な成果志向）',
    axisCharacteristics: '外的報酬・評価に強く反応し、個人の達成を重視',
    explanation: '給与・昇進・ノルマなどの報酬が行動の原動力。成果主義環境で力を発揮しやすいが、報酬がなくなると動機が失われやすい。',
    typicalExamples: 'ボーナス目当てで営業成績を上げる／昇進のために資格を取る'
  },
  {
    id: 2,
    title: '外発 × 個人＝集団中間（競争的チームプレイヤー）',
    axisCharacteristics: '外的評価を求めつつ、チーム目標も意識',
    explanation: '「チームで勝ちたい」「上司や仲間に認められたい」という社会的承認への欲求が強い。協働意識と野心のバランス型。',
    typicalExamples: 'プロジェクト成功でチーム表彰を狙う／周囲の称賛をモチベに努力'
  },
  {
    id: 3,
    title: '外発 × 集団（承認・名誉志向）',
    axisCharacteristics: '組織全体やチームの外的評価を重視',
    explanation: '組織表彰・顧客評価・社会的地位など「外からの称賛」でモチベーションが高まる。名誉・ブランド志向。',
    typicalExamples: '部署全体で表彰される／顧客満足度の向上を目標に掲げる'
  },
  {
    id: 4,
    title: '内発＝外発中間 × 個人（自己実現型）',
    axisCharacteristics: '外的報酬も大事だが、内面の成長や達成も重視',
    explanation: '給与や評価も意識しつつ、「自分が納得できる成果」を追求。成果主義と職人気質の中間。',
    typicalExamples: 'スキルを磨いて評価も得たい／高い完成度を目指す'
  },
  {
    id: 5,
    title: '内発＝外発中間 × 個人＝集団中間（均衡・協働型）',
    axisCharacteristics: '外発・内発、個人・集団すべてがほどよくバランス',
    explanation: '「やりがいも報酬も」「自分もチームも」両立した理想形。リーダー職やマネジャーに多い。',
    typicalExamples: 'チーム成果を自分の成長と重ねて考える／部下育成で達成感'
  },
  {
    id: 6,
    title: '内発＝外発中間 × 集団（理念貢献型）',
    axisCharacteristics: '組織の理念や社会的使命に共感しつつ、外的承認も活力源',
    explanation: '「社会的に意味のある仕事をしている」と感じることが強い動機。組織価値の体現者。',
    typicalExamples: 'CSR活動や地域貢献プロジェクト／理念浸透活動'
  },
  {
    id: 7,
    title: '内発 × 個人（探究・成長志向）',
    axisCharacteristics: '純粋に自分の興味・成長欲求で動く',
    explanation: 'やりたいからやる。報酬や評価がなくても努力できる。学習・研究・開発職に多い。',
    typicalExamples: '新技術を自発的に学ぶ／難題を解決する喜び'
  },
  {
    id: 8,
    title: '内発 × 個人＝集団中間（共創志向）',
    axisCharacteristics: '自分の成長とチームの発展が重なっている',
    explanation: '個人の向上がチームへの貢献につながることに喜びを感じる。協調的な高スキル人材に多い。',
    typicalExamples: '仲間と新しい仕組みを作り上げる／共同研究'
  },
  {
    id: 9,
    title: '内発 × 集団（共感・奉仕志向）',
    axisCharacteristics: 'チームや社会への共感、支援、貢献が中心',
    explanation: '他者や社会の幸福・成長を願って動く。共感性・献身性が高い。心理的安全性の高い組織を支えるタイプ。',
    typicalExamples: '同僚を助ける／社会貢献事業に情熱を注ぐ'
  }
];