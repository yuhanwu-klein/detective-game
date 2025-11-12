// Cases data structure
const CASES = [
    {
        id: 'jewelry',
        type: '珠宝店失窃案',
        title: '月光珠宝店失窃案',
        description: '一家高档珠宝店在深夜被盗，价值数百万的钻石不翼而飞。',
        sceneClass: 'scene-jewelry',
        clues: [
            {
                id: 'fingerprint',
                name: '指纹',
                description: '在展柜上发现的可疑指纹',
                icon: '👆',
                position: { left: '45%', top: '60%' },
                tool: 'magnifier',
                hidden: false
            },
            {
                id: 'footprint',
                name: '脚印',
                description: '地板上留下的特殊鞋印',
                icon: '👟',
                position: { left: '30%', top: '75%' },
                tool: 'flashlight',
                hidden: true
            },
            {
                id: 'glass',
                name: '玻璃碎片',
                description: '展柜破碎的玻璃，切口整齐',
                icon: '💎',
                position: { left: '60%', top: '55%' },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'hair',
                name: '毛发',
                description: '黑色毛发，可能属于窃贼',
                icon: '🧬',
                position: { left: '50%', top: '45%' },
                tool: 'testube',
                hidden: true
            },
            {
                id: 'camera',
                name: '监控录像',
                description: '店内监控显示一个戴口罩的身影',
                icon: '📹',
                position: { left: '80%', top: '30%' },
                tool: 'camera',
                hidden: false
            }
        ],
        solution: {
            culprit: '珠宝店员工',
            motive: '内部作案，熟悉店内布局和监控',
            keywords: ['员工', '内部', '熟悉']
        }
    },
    {
        id: 'apartment',
        type: '公寓凶杀案',
        title: '枫林公寓304号凶杀案',
        description: '一位独居老人在家中被害，现场没有打斗痕迹。',
        sceneClass: 'scene-apartment',
        clues: [
            {
                id: 'coffee',
                name: '咖啡杯',
                description: '桌上有两个咖啡杯，其中一个有口红印',
                icon: '☕',
                position: { left: '40%', top: '50%' },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'note',
                name: '纸条',
                description: '写着"今晚8点，老地方"的纸条',
                icon: '📝',
                position: { left: '55%', top: '40%' },
                tool: 'magnifier',
                hidden: false
            },
            {
                id: 'poison',
                name: '可疑粉末',
                description: '咖啡杯底部有白色粉末残留',
                icon: '💊',
                position: { left: '42%', top: '52%' },
                tool: 'testube',
                hidden: true
            },
            {
                id: 'window',
                name: '窗户',
                description: '窗户从内侧反锁，无外来痕迹',
                icon: '🪟',
                position: { left: '75%', top: '35%' },
                tool: 'flashlight',
                hidden: false
            },
            {
                id: 'photo',
                name: '照片',
                description: '一张老人和年轻女子的合影',
                icon: '🖼️',
                position: { left: '25%', top: '40%' },
                tool: 'camera',
                hidden: false
            }
        ],
        solution: {
            culprit: '侄女',
            motive: '遗产继承，用毒药谋杀',
            keywords: ['侄女', '遗产', '毒药', '口红']
        }
    },
    {
        id: 'museum',
        type: '博物馆抢劫案',
        title: '国家博物馆文物失窃案',
        description: '价值连城的古代玉器在闭馆后神秘失踪。',
        sceneClass: 'scene-museum',
        clues: [
            {
                id: 'display',
                name: '展示柜',
                description: '玻璃柜完好无损，但文物已经不见',
                icon: '🏺',
                position: { left: '50%', top: '55%' },
                tool: 'magnifier',
                hidden: false
            },
            {
                id: 'blueprint',
                name: '设计图纸',
                description: '地上散落的博物馆建筑图纸',
                icon: '📐',
                position: { left: '35%', top: '70%' },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'keycard',
                name: '门禁卡',
                description: '遗落的员工门禁卡',
                icon: '💳',
                position: { left: '60%', top: '65%' },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'tool',
                name: '工具痕迹',
                description: '展柜底部有撬动的痕迹',
                icon: '🔧',
                position: { left: '48%', top: '60%' },
                tool: 'flashlight',
                hidden: true
            },
            {
                id: 'dust',
                name: '脚印尘土',
                description: '地上的脚印带有特殊泥土',
                icon: '🥾',
                position: { left: '40%', top: '75%' },
                tool: 'testube',
                hidden: true
            }
        ],
        solution: {
            culprit: '博物馆保安',
            motive: '利用职务便利，内外勾结',
            keywords: ['保安', '内部', '门禁', '职务']
        }
    },
    {
        id: 'dock',
        type: '码头枪击案',
        title: '西区码头枪击案',
        description: '深夜码头发生枪击事件，受害者身份不明。',
        sceneClass: 'scene-dock',
        clues: [
            {
                id: 'bullet',
                name: '弹壳',
                description: '9mm手枪弹壳，专业军用',
                icon: '🔫',
                position: { left: '45%', top: '70%' },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'blood',
                name: '血迹',
                description: '地面上的血迹延伸向水边',
                icon: '🩸',
                position: { left: '55%', top: '65%' },
                tool: 'flashlight',
                hidden: false
            },
            {
                id: 'cigarette',
                name: '烟蒂',
                description: '一个特殊品牌的烟蒂',
                icon: '🚬',
                position: { left: '35%', top: '60%' },
                tool: 'testube',
                hidden: true
            },
            {
                id: 'phone',
                name: '手机',
                description: '摔碎的手机，最后通话记录可见',
                icon: '📱',
                position: { left: '50%', top: '75%' },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'tire',
                name: '轮胎痕迹',
                description: '逃跑车辆留下的轮胎印',
                icon: '🚗',
                position: { left: '70%', top: '80%' },
                tool: 'magnifier',
                hidden: false
            }
        ],
        solution: {
            culprit: '黑帮成员',
            motive: '帮派仇杀，专业作案',
            keywords: ['黑帮', '仇杀', '军用', '专业']
        }
    },
    {
        id: 'mansion',
        type: '古宅纵火案',
        title: '柳园古宅纵火案',
        description: '百年老宅突发大火，疑似人为纵火。',
        sceneClass: 'scene-mansion',
        clues: [
            {
                id: 'gasoline',
                name: '汽油味',
                description: '空气中残留浓重的汽油味',
                icon: '⛽',
                position: { left: '40%', top: '60%' },
                tool: 'testube',
                hidden: false
            },
            {
                id: 'match',
                name: '火柴',
                description: '未燃尽的火柴梗',
                icon: '🔥',
                position: { left: '50%', top: '70%' },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'will',
                name: '遗嘱',
                description: '半烧毁的遗嘱文件',
                icon: '📜',
                position: { left: '30%', top: '50%' },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'shoe',
                name: '鞋印',
                description: '灰烬中清晰的鞋印',
                icon: '👞',
                position: { left: '60%', top: '75%' },
                tool: 'flashlight',
                hidden: true
            },
            {
                id: 'fabric',
                name: '布料碎片',
                description: '门把手上挂着的布料碎片',
                icon: '🧵',
                position: { left: '75%', top: '50%' },
                tool: 'magnifier',
                hidden: true
            }
        ],
        solution: {
            culprit: '继承人',
            motive: '为了遗产，销毁遗嘱',
            keywords: ['继承', '遗产', '遗嘱', '销毁']
        }
    },
    {
        id: 'bank',
        type: '银行抢劫案',
        title: '中央银行抢劫案',
        description: '光天化日之下，歹徒抢劫银行后逃之夭夭。',
        sceneClass: 'scene-apartment', // 复用场景样式
        clues: [
            {
                id: 'mask',
                name: '面具',
                description: '歹徒遗落的黑色面具',
                icon: '🎭',
                position: { left: '45%', top: '55%' },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'money',
                name: '钞票',
                description: '散落的钞票上有特殊标记',
                icon: '💰',
                position: { left: '35%', top: '65%' },
                tool: 'magnifier',
                hidden: false
            },
            {
                id: 'security',
                name: '监控记录',
                description: '歹徒逃跑路线的监控录像',
                icon: '📹',
                position: { left: '70%', top: '35%' },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'note-threat',
                name: '威胁纸条',
                description: '歹徒留下的威胁字条',
                icon: '✉️',
                position: { left: '50%', top: '45%' },
                tool: 'flashlight',
                hidden: true
            },
            {
                id: 'dye',
                name: '染料痕迹',
                description: '防盗染料包爆炸的痕迹',
                icon: '🎨',
                position: { left: '55%', top: '70%' },
                tool: 'testube',
                hidden: true
            }
        ],
        solution: {
            culprit: '前银行员工',
            motive: '熟悉内部，报复公司',
            keywords: ['前员工', '报复', '熟悉', '内部']
        }
    }
];

// Game state
const GAME_STATE = {
    currentCase: null,
    foundClues: [],
    availableCases: [],
    solvedCases: [],
    currentTool: null
};
