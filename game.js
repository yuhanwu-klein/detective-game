// ===== Sound Effects System =====
class SoundSystem {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playTone(frequency, duration, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    paperSound() {
        this.playTone(200, 0.1, 'square');
        setTimeout(() => this.playTone(150, 0.1, 'square'), 50);
    }

    clickSound() {
        this.playTone(800, 0.05, 'sine');
    }

    successSound() {
        this.playTone(523, 0.2, 'sine');
        setTimeout(() => this.playTone(659, 0.2, 'sine'), 100);
        setTimeout(() => this.playTone(784, 0.3, 'sine'), 200);
    }

    errorSound() {
        this.playTone(200, 0.3, 'sawtooth');
    }

    cameraSound() {
        this.playTone(1000, 0.05, 'square');
        setTimeout(() => this.playTone(800, 0.05, 'square'), 50);
    }

    flashlightSound() {
        this.playTone(400, 0.1, 'square');
    }
}

const soundSystem = new SoundSystem();

// ===== 3D Scene Management =====
let officeScene = null;
let crimeScene3D = null;

// ===== Page Management =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    // Start appropriate 3D scene
    if (pageId === 'police-office' && officeScene) {
        officeScene.start();
        if (crimeScene3D) crimeScene3D.stop();
    } else if (pageId === 'crime-scene' && crimeScene3D) {
        crimeScene3D.start();
        if (officeScene) officeScene.stop();
    }
}

// ===== Police Office (Page 1) =====
function initializePoliceOffice() {
    // Create 3D office scene
    officeScene = new PoliceOfficeScene('office-canvas');
    officeScene.onCaseFileClick = selectCaseFrom3D;

    const startBtn = document.getElementById('start-investigation');

    // Reset available cases
    GAME_STATE.availableCases = CASES.filter(c => !GAME_STATE.solvedCases.includes(c.id));

    startBtn.addEventListener('click', () => {
        soundSystem.clickSound();
        shuffleCases();
    });

    officeScene.start();
}

function shuffleCases() {
    officeScene.shuffleFiles();

    setTimeout(() => {
        // Enable clicking on files after shuffle
        soundSystem.paperSound();
    }, 1000);
}

function selectCaseFrom3D(caseIndex) {
    soundSystem.paperSound();

    // Select random case from available cases
    if (GAME_STATE.availableCases.length === 0) {
        showEnding();
        return;
    }

    const randomIndex = Math.floor(Math.random() * GAME_STATE.availableCases.length);
    const selectedCase = GAME_STATE.availableCases[randomIndex];

    setTimeout(() => {
        startCase(selectedCase);
    }, 500);
}

// ===== Crime Scene (Page 2) =====
function startCase(caseData) {
    GAME_STATE.currentCase = caseData;
    GAME_STATE.foundClues = [];
    GAME_STATE.currentTool = null;

    // Update UI
    document.getElementById('case-title').textContent = caseData.title;
    updateProgress();

    // Create or update 3D crime scene
    if (!crimeScene3D) {
        crimeScene3D = new CrimeScene('scene-canvas');
        crimeScene3D.onClueClick = handleClueClick;
    }

    crimeScene3D.setupCrimeScene(caseData);

    // Clear evidence grid
    document.getElementById('evidence-grid').innerHTML = '';

    showPage('crime-scene');
}

function handleClueClick(clueData) {
    // Check if correct tool is selected
    if (GAME_STATE.currentTool !== clueData.tool && !GAME_STATE.foundClues.includes(clueData.id)) {
        soundSystem.errorSound();
        showToolHint(clueData.tool);
        return;
    }

    if (GAME_STATE.foundClues.includes(clueData.id)) {
        return;
    }

    // Found new clue!
    soundSystem.successSound();
    GAME_STATE.foundClues.push(clueData.id);

    // Mark clue as found in 3D scene
    crimeScene3D.markClueAsFound(clueData.id);

    // Add to evidence board
    addEvidence(clueData);

    updateProgress();

    // Check if all clues found
    if (GAME_STATE.foundClues.length >= GAME_STATE.currentCase.clues.length) {
        setTimeout(() => {
            showDeductionBoard();
        }, 1000);
    }

    // Deactivate tool
    deactivateTool();
}

function showToolHint(toolName) {
    const toolIcons = {
        'magnifier': '🔍',
        'flashlight': '🔦',
        'camera': '📸',
        'gloves': '🧤',
        'testube': '🧪',
        'notebook': '📄'
    };

    const toolNames = {
        'magnifier': 'Magnifying Glass',
        'flashlight': 'Flashlight',
        'camera': 'Camera',
        'gloves': 'Gloves',
        'testube': 'Test Tube',
        'notebook': 'Notebook'
    };

    const hint = document.createElement('div');
    hint.style.position = 'fixed';
    hint.style.top = '50%';
    hint.style.left = '50%';
    hint.style.transform = 'translate(-50%, -50%)';
    hint.style.background = 'rgba(0, 0, 0, 0.9)';
    hint.style.color = '#d4af37';
    hint.style.padding = '30px 50px';
    hint.style.borderRadius = '15px';
    hint.style.fontSize = '24px';
    hint.style.zIndex = '9999';
    hint.style.border = '2px solid #d4af37';
    hint.textContent = `Need tool: ${toolIcons[toolName]} ${toolNames[toolName]}`;

    document.body.appendChild(hint);

    setTimeout(() => {
        hint.remove();
    }, 2000);
}

function updateProgress() {
    const total = GAME_STATE.currentCase.clues.length;
    const found = GAME_STATE.foundClues.length;
    const percentage = (found / total) * 100;

    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = `Clues: ${found}/${total}`;
}

// ===== Tool System =====
function initializeTools() {
    const toolboxIcon = document.getElementById('toggle-toolbox');
    const toolsPanel = document.getElementById('tools-panel');
    const tools = document.querySelectorAll('.tool');

    toolboxIcon.addEventListener('click', () => {
        soundSystem.clickSound();
        toolsPanel.classList.toggle('active');
    });

    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            const toolType = tool.dataset.tool;
            soundSystem.clickSound();
            activateTool(toolType, tool);
        });
    });
}

function activateTool(toolType, toolElement) {
    // Deactivate previous tool
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));

    if (GAME_STATE.currentTool === toolType) {
        deactivateTool();
        return;
    }

    GAME_STATE.currentTool = toolType;
    toolElement.classList.add('active');

    // Apply tool-specific effects
    switch(toolType) {
        case 'flashlight':
            if (crimeScene3D) {
                crimeScene3D.toggleFlashlight(true);
            }
            soundSystem.flashlightSound();
            break;
        case 'magnifier':
        case 'camera':
            soundSystem.cameraSound();
            break;
        case 'gloves':
        case 'testube':
        case 'notebook':
            soundSystem.clickSound();
            break;
    }
}

function deactivateTool() {
    GAME_STATE.currentTool = null;
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));

    // Turn off flashlight
    if (crimeScene3D) {
        crimeScene3D.toggleFlashlight(false);
    }
}

// ===== Evidence Board =====
function addEvidence(clue) {
    const evidenceGrid = document.getElementById('evidence-grid');

    const evidenceItem = document.createElement('div');
    evidenceItem.className = 'evidence-item';
    evidenceItem.innerHTML = `
        <div class="evidence-icon">${clue.icon}</div>
        <div class="evidence-name">${clue.name}</div>
        <div class="evidence-desc">${clue.description}</div>
    `;

    evidenceGrid.appendChild(evidenceItem);
}

function initializeEvidenceBoard() {
    const showEvidenceBtn = document.getElementById('show-evidence');
    const evidenceModal = document.getElementById('evidence-modal');
    const closeEvidenceBtn = document.getElementById('close-evidence');

    showEvidenceBtn.addEventListener('click', () => {
        soundSystem.clickSound();
        evidenceModal.classList.add('active');
    });

    closeEvidenceBtn.addEventListener('click', () => {
        soundSystem.clickSound();
        evidenceModal.classList.remove('active');
    });

    evidenceModal.addEventListener('click', (e) => {
        if (e.target === evidenceModal) {
            evidenceModal.classList.remove('active');
        }
    });
}

// ===== Deduction Board =====
function showDeductionBoard() {
    const deductionModal = document.getElementById('deduction-modal');
    const cluesContainer = document.getElementById('clues-container');

    // Clear previous clues
    cluesContainer.innerHTML = '';

    // Add found clues
    const currentCase = GAME_STATE.currentCase;
    GAME_STATE.foundClues.forEach(clueId => {
        const clue = currentCase.clues.find(c => c.id === clueId);

        const clueItem = document.createElement('div');
        clueItem.className = 'clue-item';
        clueItem.textContent = `${clue.icon} ${clue.name}: ${clue.description}`;

        cluesContainer.appendChild(clueItem);
    });

    deductionModal.classList.add('active');
}

function initializeDeductionBoard() {
    const deductionModal = document.getElementById('deduction-modal');
    const closeDeductionBtn = document.getElementById('close-deduction');
    const submitBtn = document.getElementById('submit-conclusion');

    closeDeductionBtn.addEventListener('click', () => {
        soundSystem.clickSound();
        deductionModal.classList.remove('active');
    });

    submitBtn.addEventListener('click', () => {
        soundSystem.clickSound();
        checkConclusion();
    });
}

function checkConclusion() {
    const conclusionText = document.getElementById('conclusion-text').value.toLowerCase();
    const solution = GAME_STATE.currentCase.solution;

    // Check if conclusion contains key words
    const isCorrect = solution.keywords.some(keyword =>
        conclusionText.includes(keyword.toLowerCase())
    );

    // Close deduction board
    document.getElementById('deduction-modal').classList.remove('active');

    // Show result
    showResult(isCorrect);
}

function showResult(isCorrect) {
    const resultModal = document.getElementById('result-modal');
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');

    if (isCorrect) {
        soundSystem.successSound();
        resultIcon.textContent = '✅';
        resultTitle.textContent = 'Case Solved!';
        resultTitle.style.color = '#00ff00';
        resultMessage.textContent = `Success! The culprit is ${GAME_STATE.currentCase.solution.culprit}. Motive: ${GAME_STATE.currentCase.solution.motive}`;

        // Mark case as solved
        GAME_STATE.solvedCases.push(GAME_STATE.currentCase.id);
    } else {
        soundSystem.errorSound();
        resultIcon.textContent = '❌';
        resultTitle.textContent = 'Inconclusive';
        resultTitle.style.color = '#ff4444';
        resultMessage.textContent = 'Your deduction is incomplete. Review the evidence carefully!';
    }

    resultModal.classList.add('active');
}

function initializeResultModal() {
    const resultModal = document.getElementById('result-modal');
    const continueBtn = document.getElementById('continue-btn');

    continueBtn.addEventListener('click', () => {
        soundSystem.clickSound();
        resultModal.classList.remove('active');
        returnToOffice();
    });
}

function returnToOffice() {
    // Clear evidence grid
    document.getElementById('evidence-grid').innerHTML = '';
    document.getElementById('conclusion-text').value = '';

    // Reset tools
    deactivateTool();

    // Return to office
    showPage('police-office');

    // Reinitialize office
    GAME_STATE.availableCases = CASES.filter(c => !GAME_STATE.solvedCases.includes(c.id));
}

// ===== Back to Office Button =====
function initializeBackButton() {
    const backBtn = document.getElementById('back-to-office');
    backBtn.addEventListener('click', () => {
        soundSystem.clickSound();

        if (confirm('Return to office? Current progress will be lost.')) {
            returnToOffice();
        }
    });
}

// ===== Ending =====
function showEnding() {
    const resultModal = document.getElementById('result-modal');
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const continueBtn = document.getElementById('continue-btn');

    soundSystem.successSound();
    setTimeout(() => soundSystem.successSound(), 300);
    setTimeout(() => soundSystem.successSound(), 600);

    resultIcon.textContent = '🏆';
    resultTitle.textContent = 'All Cases Solved!';
    resultTitle.style.color = '#d4af37';
    resultMessage.innerHTML = `
        <strong>Congratulations, Detective!</strong><br><br>
        You've successfully solved all 6 cases!<br>
        These seemingly unrelated cases may hide a larger conspiracy...<br><br>
        <em>Thanks for playing!</em>
    `;

    continueBtn.textContent = 'Restart Game';
    continueBtn.onclick = () => {
        // Reset game
        GAME_STATE.solvedCases = [];
        GAME_STATE.availableCases = [...CASES];
        resultModal.classList.remove('active');
        returnToOffice();
        continueBtn.textContent = 'Continue Investigation';
    };

    resultModal.classList.add('active');
}

// ===== Initialize Game =====
function initializeGame() {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 1500);

    // Initialize available cases
    GAME_STATE.availableCases = [...CASES];

    // Initialize all systems
    initializePoliceOffice();
    initializeTools();
    initializeEvidenceBoard();
    initializeDeductionBoard();
    initializeResultModal();
    initializeBackButton();

    console.log('🔍 3D Detective Game initialized!');
    console.log(`📁 Cases available: ${CASES.length}`);
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', initializeGame);
