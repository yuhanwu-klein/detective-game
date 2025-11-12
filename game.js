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

// ===== Page Management =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// ===== Police Office (Page 1) =====
function initializePoliceOffice() {
    const caseFiles = document.querySelectorAll('.case-file');
    const startBtn = document.getElementById('start-investigation');

    // Reset available cases
    GAME_STATE.availableCases = CASES.filter(c => !GAME_STATE.solvedCases.includes(c.id));

    // Hover sound effects
    caseFiles.forEach(file => {
        file.addEventListener('mouseenter', () => {
            soundSystem.paperSound();
        });
    });

    startBtn.addEventListener('click', () => {
        soundSystem.clickSound();
        shuffleCases();
    });
}

function shuffleCases() {
    const caseFiles = document.querySelectorAll('.case-file');

    // Add shuffling animation
    caseFiles.forEach(file => {
        file.classList.add('shuffling');
    });

    setTimeout(() => {
        caseFiles.forEach(file => {
            file.classList.remove('shuffling');
            file.classList.add('selectable');
        });

        // Make files clickable
        caseFiles.forEach(file => {
            file.addEventListener('click', selectCase);
        });
    }, 1000);
}

function selectCase(event) {
    const caseFile = event.currentTarget;
    const caseFiles = document.querySelectorAll('.case-file');

    // Remove click listeners
    caseFiles.forEach(file => {
        file.removeEventListener('click', selectCase);
        file.classList.remove('selectable');
    });

    // Select random case from available cases
    if (GAME_STATE.availableCases.length === 0) {
        // All cases solved - show ending
        showEnding();
        return;
    }

    const randomIndex = Math.floor(Math.random() * GAME_STATE.availableCases.length);
    const selectedCase = GAME_STATE.availableCases[randomIndex];

    // Show case type hint
    caseFile.classList.add('selected');
    const detailsDiv = caseFile.querySelector('.file-details');
    detailsDiv.textContent = selectedCase.type;
    detailsDiv.style.display = 'block';

    soundSystem.paperSound();

    setTimeout(() => {
        caseFile.classList.add('opened');
        setTimeout(() => {
            startCase(selectedCase);
        }, 500);
    }, 1000);
}

// ===== Crime Scene (Page 2) =====
function startCase(caseData) {
    GAME_STATE.currentCase = caseData;
    GAME_STATE.foundClues = [];
    GAME_STATE.currentTool = null;

    // Update UI
    document.getElementById('case-title').textContent = caseData.title;
    updateProgress();

    // Set scene background
    const sceneBackground = document.getElementById('scene-background');
    sceneBackground.className = 'scene-background ' + caseData.sceneClass;

    // Clear previous hotspots
    sceneBackground.innerHTML = '';

    // Create hotspots for clues
    caseData.clues.forEach(clue => {
        const hotspot = document.createElement('div');
        hotspot.className = 'hotspot' + (clue.hidden ? ' hidden' : '');
        hotspot.dataset.clueId = clue.id;
        hotspot.style.left = clue.position.left;
        hotspot.style.top = clue.position.top;
        hotspot.innerHTML = `<span style="font-size: 40px; opacity: 0.7;">${clue.icon}</span>`;

        hotspot.addEventListener('click', () => {
            handleClueClick(clue, hotspot);
        });

        sceneBackground.appendChild(hotspot);
    });

    showPage('crime-scene');
}

function handleClueClick(clue, hotspot) {
    // Check if correct tool is selected
    if (GAME_STATE.currentTool !== clue.tool && !GAME_STATE.foundClues.includes(clue.id)) {
        // Tool not selected or wrong tool
        soundSystem.errorSound();
        showToolHint(clue.tool);
        return;
    }

    if (GAME_STATE.foundClues.includes(clue.id)) {
        // Already found
        return;
    }

    // Found new clue!
    soundSystem.successSound();
    GAME_STATE.foundClues.push(clue.id);
    hotspot.classList.add('found');

    // Add to evidence board
    addEvidence(clue);

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
    hint.textContent = `需要使用工具: ${toolIcons[toolName]}`;

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
    document.getElementById('progress-text').textContent = `线索: ${found}/${total}`;
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
        // Deactivate if clicking same tool
        deactivateTool();
        return;
    }

    GAME_STATE.currentTool = toolType;
    toolElement.classList.add('active');

    // Remove previous tool effects
    removeToolEffects();

    // Apply tool-specific effects
    switch(toolType) {
        case 'flashlight':
            activateFlashlight();
            soundSystem.flashlightSound();
            break;
        case 'magnifier':
            activateMagnifier();
            soundSystem.clickSound();
            break;
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
    removeToolEffects();
}

function removeToolEffects() {
    // Remove flashlight
    document.querySelector('.scene-container')?.classList.remove('flashlight-active');
    document.querySelector('.flashlight-beam')?.remove();

    // Remove magnifier
    document.querySelector('.magnifier')?.remove();
}

function activateFlashlight() {
    const sceneContainer = document.querySelector('.scene-container');
    sceneContainer.classList.add('flashlight-active');

    const beam = document.createElement('div');
    beam.className = 'flashlight-beam';
    document.body.appendChild(beam);

    sceneContainer.addEventListener('mousemove', handleFlashlightMove);

    // Reveal hidden clues
    const hiddenHotspots = document.querySelectorAll('.hotspot.hidden');
    hiddenHotspots.forEach(hotspot => {
        hotspot.classList.add('flashlight-visible');
    });
}

function handleFlashlightMove(e) {
    const beam = document.querySelector('.flashlight-beam');
    if (beam) {
        beam.style.left = e.clientX + 'px';
        beam.style.top = e.clientY + 'px';
    }
}

function activateMagnifier() {
    const magnifier = document.createElement('div');
    magnifier.className = 'magnifier';
    document.body.appendChild(magnifier);

    document.addEventListener('mousemove', handleMagnifierMove);
}

function handleMagnifierMove(e) {
    const magnifier = document.querySelector('.magnifier');
    if (magnifier) {
        magnifier.style.left = e.clientX + 'px';
        magnifier.style.top = e.clientY + 'px';
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
        resultTitle.textContent = '案件已结！';
        resultTitle.style.color = '#00ff00';
        resultMessage.textContent = `破案成功！凶手是${GAME_STATE.currentCase.solution.culprit}，动机：${GAME_STATE.currentCase.solution.motive}`;

        // Mark case as solved
        GAME_STATE.solvedCases.push(GAME_STATE.currentCase.id);
    } else {
        soundSystem.errorSound();
        resultIcon.textContent = '❌';
        resultTitle.textContent = '推理有误';
        resultTitle.style.color = '#ff4444';
        resultMessage.textContent = '你的推理还不够完整，再仔细查看线索吧！';
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
    const caseFiles = document.querySelectorAll('.case-file');
    caseFiles.forEach(file => {
        file.classList.remove('selected', 'opened', 'selectable', 'shuffling');
        const details = file.querySelector('.file-details');
        details.style.display = 'none';
        details.textContent = '';
    });

    initializePoliceOffice();
}

// ===== Back to Office Button =====
function initializeBackButton() {
    const backBtn = document.getElementById('back-to-office');
    backBtn.addEventListener('click', () => {
        soundSystem.clickSound();

        if (confirm('确定要返回办公室吗？当前进度将丢失。')) {
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
    resultTitle.textContent = '全部案件已破！';
    resultTitle.style.color = '#d4af37';
    resultMessage.innerHTML = `
        <strong>恭喜你，神探！</strong><br><br>
        你成功破解了所有6个案件！<br>
        这些看似独立的案件，背后或许隐藏着更大的阴谋...<br><br>
        <em>感谢游玩！</em>
    `;

    continueBtn.textContent = '重新开始';
    continueBtn.onclick = () => {
        // Reset game
        GAME_STATE.solvedCases = [];
        GAME_STATE.availableCases = [...CASES];
        resultModal.classList.remove('active');
        returnToOffice();
        continueBtn.textContent = '继续调查';
    };

    resultModal.classList.add('active');
}

// ===== Initialize Game =====
function initializeGame() {
    // Initialize available cases
    GAME_STATE.availableCases = [...CASES];

    // Initialize all systems
    initializePoliceOffice();
    initializeTools();
    initializeEvidenceBoard();
    initializeDeductionBoard();
    initializeResultModal();
    initializeBackButton();

    console.log('🔍 侦探游戏已启动！');
    console.log(`📁 可调查案件数: ${CASES.length}`);
}

// Start game when page loads
document.addEventListener('DOMContentLoaded', initializeGame);
