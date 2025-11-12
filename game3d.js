// ===== 3D Rendering Engine using Three.js =====

class Scene3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.controls = null;
        this.interactiveObjects = [];
        this.animationId = null;

        this.setupRenderer();
        this.setupLights();
        this.addEventListeners();
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Directional light (main light source)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for dramatic effect
        const pointLight = new THREE.PointLight(0xffaa00, 0.5, 100);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        // Reset all objects
        this.interactiveObjects.forEach(obj => {
            if (obj.userData.isClue && !obj.userData.found) {
                obj.scale.set(1, 1, 1);
            }
        });

        // Highlight intersected object
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.isClue && !object.userData.found) {
                object.scale.set(1.2, 1.2, 1.2);
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.isClue && !object.userData.found) {
                this.onClueClick(object.userData.clueData);
            } else if (object.userData.isCaseFile) {
                this.onCaseFileClick(object.userData.caseIndex);
            }
        }
    }

    onClueClick(clueData) {
        // This will be overridden by game logic
        console.log('Clue clicked:', clueData);
    }

    onCaseFileClick(caseIndex) {
        // This will be overridden by game logic
        console.log('Case file clicked:', caseIndex);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    clear() {
        // Remove all objects except lights
        const objectsToRemove = [];
        this.scene.children.forEach(child => {
            if (!(child instanceof THREE.Light)) {
                objectsToRemove.push(child);
            }
        });
        objectsToRemove.forEach(obj => this.scene.remove(obj));
        this.interactiveObjects = [];
    }
}

// ===== Police Office Scene =====
class PoliceOfficeScene extends Scene3D {
    constructor(canvasId) {
        super(canvasId);
        this.caseFiles = [];
        this.setupScene();
        this.setupControls();
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupScene() {
        // Set background color (dim office lighting)
        this.scene.background = new THREE.Color(0x2c2416);
        this.scene.fog = new THREE.Fog(0x2c2416, 10, 50);

        // Add office desk
        this.createDesk();

        // Add case files
        this.createCaseFiles();

        // Add office props
        this.createOfficeProps();

        // Position camera
        this.camera.position.set(0, 3, 6);
        this.camera.lookAt(0, 1, 0);
    }

    createDesk() {
        // Desk surface
        const deskGeometry = new THREE.BoxGeometry(8, 0.2, 4);
        const deskMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.8
        });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.y = 1;
        desk.receiveShadow = true;
        this.scene.add(desk);

        // Desk legs
        const legGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3219 });

        const positions = [
            [-3.5, 0.5, -1.5],
            [3.5, 0.5, -1.5],
            [-3.5, 0.5, 1.5],
            [3.5, 0.5, 1.5]
        ];

        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.scene.add(leg);
        });

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1612,
            roughness: 0.9
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    createCaseFiles() {
        const fileLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
        const positions = [
            [-2.5, 1.2, 0.5],
            [0, 1.2, 0.5],
            [2.5, 1.2, 0.5],
            [-2.5, 1.2, -0.5],
            [0, 1.2, -0.5],
            [2.5, 1.2, -0.5]
        ];

        fileLabels.forEach((label, index) => {
            const caseFile = this.createCaseFile(label, positions[index], index);
            this.caseFiles.push(caseFile);
            this.interactiveObjects.push(caseFile);
        });
    }

    createCaseFile(label, position, index) {
        // Create folder
        const group = new THREE.Group();

        // Folder back
        const folderGeometry = new THREE.BoxGeometry(0.6, 0.01, 0.8);
        const folderMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4a574,
            roughness: 0.7
        });
        const folderBack = new THREE.Mesh(folderGeometry, folderMaterial);
        folderBack.castShadow = true;
        group.add(folderBack);

        // Add some papers (visual detail)
        const paperGeometry = new THREE.BoxGeometry(0.55, 0.01, 0.75);
        const paperMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9
        });
        const papers = new THREE.Mesh(paperGeometry, paperMaterial);
        papers.position.y = 0.02;
        group.add(papers);

        // Add label using sprite (text)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        context.fillStyle = '#2c2416';
        context.font = 'Bold 120px Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('File ' + label, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.4, 0.4, 1);
        sprite.position.y = 0.05;
        group.add(sprite);

        group.position.set(...position);
        group.userData.isCaseFile = true;
        group.userData.caseIndex = index;
        group.userData.label = label;

        this.scene.add(group);
        return group;
    }

    createOfficeProps() {
        // Add a lamp
        const lampGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
        const lampMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });
        const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
        lamp.position.set(-3, 1.5, 0);
        this.scene.add(lamp);

        // Add spot light from lamp
        const spotLight = new THREE.SpotLight(0xffaa00, 0.8);
        spotLight.position.set(-3, 2, 0);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;
        this.scene.add(spotLight);
    }

    shuffleFiles() {
        this.caseFiles.forEach((file, index) => {
            // Animate files shuffling
            const randomX = (Math.random() - 0.5) * 2;
            const randomZ = (Math.random() - 0.5) * 2;
            const targetY = file.position.y + 0.5;

            this.animateFile(file,
                { x: file.position.x, y: targetY, z: file.position.z },
                500,
                () => {
                    this.animateFile(file,
                        { x: file.position.x + randomX, y: file.position.y, z: file.position.z + randomZ },
                        300
                    );
                }
            );
        });
    }

    animateFile(file, targetPos, duration, callback) {
        const startPos = { ...file.position };
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeInOutCubic(progress);

            file.position.x = startPos.x + (targetPos.x - startPos.x) * eased;
            file.position.y = startPos.y + (targetPos.y - startPos.y) * eased;
            file.position.z = startPos.z + (targetPos.z - startPos.z) * eased;
            file.rotation.y = Math.sin(progress * Math.PI) * 0.5;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };

        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// ===== Crime Scene =====
class CrimeScene extends Scene3D {
    constructor(canvasId) {
        super(canvasId);
        this.clueObjects = [];
        this.flashlightOn = false;
        this.setupControls();
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 15;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupCrimeScene(caseData) {
        this.clear();
        this.clueObjects = [];

        // Set scene background based on case type
        this.scene.background = new THREE.Color(caseData.sceneColor);
        this.scene.fog = new THREE.Fog(caseData.sceneColor, 5, 20);

        // Create room/environment
        this.createRoom(caseData);

        // Create clue objects
        this.createClues(caseData.clues);

        // Position camera
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 1, 0);
    }

    createRoom(caseData) {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(15, 15);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: caseData.sceneColor,
            roughness: 0.9
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Walls
        const wallHeight = 4;
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: this.adjustBrightness(caseData.sceneColor, 1.2),
            roughness: 0.8,
            side: THREE.DoubleSide
        });

        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(15, wallHeight),
            wallMaterial
        );
        backWall.position.set(0, wallHeight / 2, -7.5);
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(15, wallHeight),
            wallMaterial
        );
        leftWall.position.set(-7.5, wallHeight / 2, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Add some room props based on case type
        this.addRoomProps(caseData);
    }

    addRoomProps(caseData) {
        // Add a table in the center
        const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const tableMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.7
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.set(0, 1, 0);
        table.castShadow = true;
        table.receiveShadow = true;
        this.scene.add(table);

        // Table legs
        const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
        const positions = [
            [-0.9, 0.5, -0.4],
            [0.9, 0.5, -0.4],
            [-0.9, 0.5, 0.4],
            [0.9, 0.5, 0.4]
        ];

        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, tableMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.scene.add(leg);
        });

        // Add display case for jewelry/museum scenes
        if (caseData.id === 'jewelry' || caseData.id === 'museum') {
            const caseGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
            const caseMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3,
                roughness: 0.1,
                transmission: 0.9
            });
            const displayCase = new THREE.Mesh(caseGeometry, caseMaterial);
            displayCase.position.set(0, 1.5, 0);
            this.scene.add(displayCase);
        }
    }

    createClues(clues) {
        clues.forEach(clueData => {
            const clueObject = this.createClueObject(clueData);
            this.clueObjects.push(clueObject);
            this.interactiveObjects.push(clueObject);
        });
    }

    createClueObject(clueData) {
        const group = new THREE.Group();

        // Create a sphere for the clue marker
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: clueData.hidden ? 0x333333 : 0xffaa00,
            emissive: clueData.hidden ? 0x000000 : 0xffaa00,
            emissiveIntensity: clueData.hidden ? 0 : 0.3,
            transparent: clueData.hidden,
            opacity: clueData.hidden ? 0.1 : 1
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        group.add(sphere);

        // Add icon sprite
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.font = '80px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(clueData.icon, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: clueData.hidden ? 0.2 : 1
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.5, 0.5, 1);
        sprite.position.y = 0.4;
        group.add(sprite);

        // Position clue
        group.position.set(clueData.position.x, clueData.position.y, clueData.position.z);
        group.userData.isClue = true;
        group.userData.clueData = clueData;
        group.userData.found = false;
        group.userData.hidden = clueData.hidden;

        this.scene.add(group);
        return group;
    }

    toggleFlashlight(enabled) {
        this.flashlightOn = enabled;

        this.clueObjects.forEach(obj => {
            if (obj.userData.hidden && enabled) {
                // Make hidden clues more visible with flashlight
                obj.children[0].material.opacity = 0.8;
                obj.children[0].material.emissiveIntensity = 0.5;
                obj.children[1].material.opacity = 0.8;
            } else if (obj.userData.hidden && !enabled) {
                // Hide again
                obj.children[0].material.opacity = 0.1;
                obj.children[0].material.emissiveIntensity = 0;
                obj.children[1].material.opacity = 0.2;
            }
        });
    }

    markClueAsFound(clueId) {
        const clueObject = this.clueObjects.find(obj => obj.userData.clueData.id === clueId);
        if (clueObject) {
            clueObject.userData.found = true;
            clueObject.children[0].material.color.setHex(0x00ff00);
            clueObject.children[0].material.emissive.setHex(0x00ff00);
        }
    }

    adjustBrightness(color, factor) {
        const r = ((color >> 16) & 255) * factor;
        const g = ((color >> 8) & 255) * factor;
        const b = (color & 255) * factor;
        return (Math.min(r, 255) << 16) | (Math.min(g, 255) << 8) | Math.min(b, 255);
    }
}

// Export for use in game.js
window.PoliceOfficeScene = PoliceOfficeScene;
window.CrimeScene = CrimeScene;
