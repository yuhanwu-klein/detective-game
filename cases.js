// Cases data structure - All in English
const CASES = [
    {
        id: 'jewelry',
        type: 'Jewelry Store Theft',
        title: 'Moonlight Jewelry Store Heist',
        description: 'A high-end jewelry store was robbed late at night. Diamonds worth millions vanished without a trace.',
        sceneClass: 'scene-jewelry',
        sceneColor: 0x654321,
        clues: [
            {
                id: 'fingerprint',
                name: 'Fingerprint',
                description: 'Suspicious fingerprint found on the display case',
                icon: '👆',
                position: { x: 2, y: 1, z: 1 },
                tool: 'magnifier',
                hidden: false
            },
            {
                id: 'footprint',
                name: 'Footprint',
                description: 'Special shoe print left on the floor',
                icon: '👟',
                position: { x: -1, y: 0.1, z: 2 },
                tool: 'flashlight',
                hidden: true
            },
            {
                id: 'glass',
                name: 'Glass Shards',
                description: 'Shattered display glass with clean cuts',
                icon: '💎',
                position: { x: 0, y: 1.2, z: 0 },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'hair',
                name: 'Hair Sample',
                description: 'Black hair, possibly belongs to the thief',
                icon: '🧬',
                position: { x: 1.5, y: 0.5, z: -1 },
                tool: 'testube',
                hidden: true
            },
            {
                id: 'camera',
                name: 'Security Footage',
                description: 'Store surveillance shows a masked figure',
                icon: '📹',
                position: { x: -2, y: 2.5, z: -2 },
                tool: 'camera',
                hidden: false
            }
        ],
        solution: {
            culprit: 'Store Employee',
            motive: 'Inside job, familiar with store layout and surveillance',
            keywords: ['employee', 'inside', 'familiar', 'staff']
        }
    },
    {
        id: 'apartment',
        type: 'Apartment Murder',
        title: 'Maple Apartments Unit 304 Murder',
        description: 'An elderly resident was found dead in their home. No signs of struggle were present.',
        sceneClass: 'scene-apartment',
        sceneColor: 0x463020,
        clues: [
            {
                id: 'coffee',
                name: 'Coffee Cups',
                description: 'Two coffee cups on the table, one with lipstick mark',
                icon: '☕',
                position: { x: 0.5, y: 1, z: 0.5 },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'note',
                name: 'Note',
                description: 'Paper reading "8 PM tonight, usual place"',
                icon: '📝',
                position: { x: 0.3, y: 1.05, z: 0.3 },
                tool: 'magnifier',
                hidden: false
            },
            {
                id: 'poison',
                name: 'Suspicious Powder',
                description: 'White powder residue at bottom of coffee cup',
                icon: '💊',
                position: { x: 0.5, y: 1.02, z: 0.5 },
                tool: 'testube',
                hidden: true
            },
            {
                id: 'window',
                name: 'Window',
                description: 'Window locked from inside, no external entry',
                icon: '🪟',
                position: { x: -3, y: 1.5, z: -2 },
                tool: 'flashlight',
                hidden: false
            },
            {
                id: 'photo',
                name: 'Photograph',
                description: 'Photo of elderly victim with young woman',
                icon: '🖼️',
                position: { x: -2, y: 1.6, z: 1 },
                tool: 'camera',
                hidden: false
            }
        ],
        solution: {
            culprit: 'Niece',
            motive: 'Inheritance, murdered with poison',
            keywords: ['niece', 'inheritance', 'poison', 'lipstick', 'relative']
        }
    },
    {
        id: 'museum',
        type: 'Museum Robbery',
        title: 'National Museum Artifact Theft',
        description: 'A priceless ancient jade artifact mysteriously disappeared after closing hours.',
        sceneClass: 'scene-museum',
        sceneColor: 0x2c2c2c,
        clues: [
            {
                id: 'display',
                name: 'Display Case',
                description: 'Glass case intact but artifact missing',
                icon: '🏺',
                position: { x: 0, y: 1.2, z: 0 },
                tool: 'magnifier',
                hidden: false
            },
            {
                id: 'blueprint',
                name: 'Blueprint',
                description: 'Museum architectural plans scattered on floor',
                icon: '📐',
                position: { x: -1.5, y: 0.1, z: 1.5 },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'keycard',
                name: 'Access Card',
                description: 'Employee access card found dropped',
                icon: '💳',
                position: { x: 1, y: 0.1, z: 1 },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'tool',
                name: 'Tool Marks',
                description: 'Pry marks found at base of display case',
                icon: '🔧',
                position: { x: 0.2, y: 0.8, z: 0.2 },
                tool: 'flashlight',
                hidden: true
            },
            {
                id: 'dust',
                name: 'Footprint Soil',
                description: 'Footprints with unique soil composition',
                icon: '🥾',
                position: { x: -0.5, y: 0.1, z: 2 },
                tool: 'testube',
                hidden: true
            }
        ],
        solution: {
            culprit: 'Museum Security Guard',
            motive: 'Inside-outside collusion using job privileges',
            keywords: ['security', 'guard', 'inside', 'access', 'employee']
        }
    },
    {
        id: 'dock',
        type: 'Dock Shooting',
        title: 'West District Dock Shooting',
        description: 'A late-night shooting occurred at the docks. Victim identity unknown.',
        sceneClass: 'scene-dock',
        sceneColor: 0x001a33,
        clues: [
            {
                id: 'bullet',
                name: 'Bullet Casing',
                description: '9mm handgun casing, professional military grade',
                icon: '🔫',
                position: { x: 0.5, y: 0.1, z: 1.5 },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'blood',
                name: 'Blood Trail',
                description: 'Blood trail leading toward the water',
                icon: '🩸',
                position: { x: 1, y: 0.1, z: 0.5 },
                tool: 'flashlight',
                hidden: false
            },
            {
                id: 'cigarette',
                name: 'Cigarette Butt',
                description: 'Rare brand cigarette butt',
                icon: '🚬',
                position: { x: -1, y: 0.1, z: 1 },
                tool: 'testube',
                hidden: true
            },
            {
                id: 'phone',
                name: 'Cell Phone',
                description: 'Smashed phone with visible call history',
                icon: '📱',
                position: { x: 0, y: 0.1, z: 2 },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'tire',
                name: 'Tire Tracks',
                description: 'Escape vehicle tire marks',
                icon: '🚗',
                position: { x: 2, y: 0.1, z: 3 },
                tool: 'magnifier',
                hidden: false
            }
        ],
        solution: {
            culprit: 'Gang Member',
            motive: 'Gang vendetta, professional hit',
            keywords: ['gang', 'vendetta', 'military', 'professional', 'organized']
        }
    },
    {
        id: 'mansion',
        type: 'Mansion Arson',
        title: 'Willow Manor Arson Case',
        description: 'A century-old mansion caught fire. Suspected arson.',
        sceneClass: 'scene-mansion',
        sceneColor: 0x1a0f00,
        clues: [
            {
                id: 'gasoline',
                name: 'Gasoline Smell',
                description: 'Strong gasoline odor lingers in the air',
                icon: '⛽',
                position: { x: 0, y: 0.5, z: 0 },
                tool: 'testube',
                hidden: false
            },
            {
                id: 'match',
                name: 'Matches',
                description: 'Partially burned matchstick',
                icon: '🔥',
                position: { x: 0.5, y: 0.1, z: 1 },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'will',
                name: 'Will Document',
                description: 'Half-burned last will and testament',
                icon: '📜',
                position: { x: -1, y: 0.5, z: 0.5 },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'shoe',
                name: 'Shoe Print',
                description: 'Clear shoe print in the ashes',
                icon: '👞',
                position: { x: 1.5, y: 0.1, z: 1.5 },
                tool: 'flashlight',
                hidden: true
            },
            {
                id: 'fabric',
                name: 'Fabric Fragment',
                description: 'Cloth fragment caught on door handle',
                icon: '🧵',
                position: { x: -2, y: 1, z: -1 },
                tool: 'magnifier',
                hidden: true
            }
        ],
        solution: {
            culprit: 'Heir',
            motive: 'Destroy will to claim inheritance',
            keywords: ['heir', 'inheritance', 'will', 'destroy', 'beneficiary']
        }
    },
    {
        id: 'bank',
        type: 'Bank Robbery',
        title: 'Central Bank Heist',
        description: 'Armed robbers struck the bank in broad daylight and escaped.',
        sceneClass: 'scene-apartment',
        sceneColor: 0x463020,
        clues: [
            {
                id: 'mask',
                name: 'Mask',
                description: 'Black ski mask left behind by robber',
                icon: '🎭',
                position: { x: 0, y: 0.5, z: 1 },
                tool: 'gloves',
                hidden: false
            },
            {
                id: 'money',
                name: 'Bills',
                description: 'Scattered bills with special tracking marks',
                icon: '💰',
                position: { x: -0.5, y: 0.1, z: 0.5 },
                tool: 'magnifier',
                hidden: false
            },
            {
                id: 'security',
                name: 'Security Recording',
                description: 'Surveillance footage of escape route',
                icon: '📹',
                position: { x: 2, y: 2.5, z: -1 },
                tool: 'camera',
                hidden: false
            },
            {
                id: 'note-threat',
                name: 'Threatening Note',
                description: 'Note left by robbers',
                icon: '✉️',
                position: { x: 0.8, y: 1, z: 0.3 },
                tool: 'flashlight',
                hidden: true
            },
            {
                id: 'dye',
                name: 'Dye Residue',
                description: 'Security dye pack explosion traces',
                icon: '🎨',
                position: { x: 1, y: 0.1, z: 1.5 },
                tool: 'testube',
                hidden: true
            }
        ],
        solution: {
            culprit: 'Former Bank Employee',
            motive: 'Knows internal layout, revenge against company',
            keywords: ['former', 'employee', 'revenge', 'familiar', 'insider', 'ex-worker']
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
