# 🔍 3D Detective Game

An immersive 3D interactive detective game where players investigate 6 different mysterious cases using Three.js rendering.

## 🎮 Game Features

### 📋 Page 1: Police Office (3D Case Selection)
- Fully 3D rendered police office environment
- Interactive 3D case file folders on desk
- Ambient lighting with dim office atmosphere
- Rotating camera controls with mouse
- Realistic desk and office props
- Random case selection system

### 🔍 Page 2: Crime Scene (3D Investigation)
- 6 different types of crime scenes in 3D:
  - 💎 Jewelry Store Theft
  - 🏠 Apartment Murder
  - 🏛️ Museum Robbery
  - ⛵ Dock Shooting
  - 🏰 Mansion Arson
  - 🏦 Bank Heist

### 🧰 Tool System
Players can use professional detective tools:

| Tool | Function |
|------|----------|
| 🔍 Magnifying Glass | Zoom in on details, find fingerprints and scratches |
| 🔦 Flashlight | Illuminate dark areas, reveal hidden clues |
| 📸 Camera | Photograph evidence, add to evidence board |
| 🧤 Gloves | Collect physical evidence without contamination |
| 🧪 Test Tube | Analyze liquid or powder samples |
| 📄 Notebook | Organize discovered clues and deductions |

### 🎧 Atmosphere Design
- Dynamic sound effects system (AC, keyboard typing, distant sirens)
- Case-specific ambient sound effects
- Tool usage sounds (magnifier click, camera shutter, flashlight switch)
- Web Audio API powered audio system

### 🧠 Deduction System
- Clue collection progress tracking
- Evidence board system to record all findings
- Case analysis board for organizing deductions
- Submit conclusions to solve cases

### 🎨 3D Graphics
- Three.js powered 3D rendering
- Real-time lighting and shadows
- Interactive 3D objects with raycasting
- Orbit controls for camera movement
- Dynamic clue markers in 3D space

## 🚀 Getting Started

### Method 1: Direct Open
1. Download all files to the same folder
2. Open `index.html` in a modern web browser
3. Start your detective journey!

### Method 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server
```

Then visit `http://localhost:8000` in your browser

## 🎯 How to Play

### Step 1: Select a Case
1. Click "START INVESTIGATION" button
2. Case files will be shuffled
3. Click on any 3D file folder
4. System randomly selects a case and enters crime scene

### Step 2: Collect Clues
1. Click the 🧰 toolbox icon (bottom right)
2. Select the appropriate tool
3. Look for interactive hotspots in the 3D scene (glowing spheres)
4. Use the correct tool to collect each clue
5. Some clues are hidden and need flashlight to reveal

### Step 3: Analyze and Deduce
1. After collecting enough clues, the "Case Analysis Board" appears
2. Review all collected evidence
3. Enter your deduction in the text box
4. Submit your conclusion

### Step 4: View Results
- ✅ **Case Solved**: File marked as "Closed", proceed to next case
- ❌ **Inconclusive**: Continue collecting evidence or re-analyze

### Step 5: Continue Investigation
- Return to office and select the next case
- Complete all 6 cases to unlock the final ending

## 🕹️ Controls

### Police Office
- **Mouse**: Look around the office
- **Scroll**: Zoom in/out
- **Left Click**: Select case file

### Crime Scene
- **Mouse Drag**: Rotate camera view
- **Scroll**: Zoom in/out
- **Left Click**: Interact with clues
- **Toolbox Button**: Open tool selection

## 🎨 Technical Stack

- **HTML5** - Game structure
- **CSS3** - Visual effects and animations
- **Vanilla JavaScript** - Game logic
- **Three.js** - 3D rendering engine
- **Web Audio API** - Sound system

## 🎮 Game Mechanics

### Case System
- 6 independent cases, each with 5 clues
- Each clue requires a specific tool to collect
- Some clues are hidden by default and need flashlight to reveal
- 3D clue objects positioned in the scene

### Deduction Validation
Conclusions must contain keywords to solve the case. For example:
- "Jewelry Store Theft" requires identifying "inside employee"
- "Apartment Murder" needs to discover "niece" used "poison" for "inheritance"

### Progress Tracking
- Real-time clue collection progress (e.g., 3/5)
- Evidence board saves all collected evidence
- Solved cases are marked and won't reappear

## 📱 Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Requires WebGL support
- ✅ Desktop and tablet devices
- ⚠️ Requires JavaScript and Web Audio API enabled

## 🎯 Game Tips

1. **Observe Carefully**: Each scene has 5 clue hotspots in 3D space
2. **Tool Matching**: Pay attention to which tool each clue requires
3. **Flashlight is Key**: Some clues are hidden in dark areas
4. **Look for Keywords**: Note key information (relationships, motives, methods)
5. **Evidence Board**: Review collected evidence anytime
6. **Camera Controls**: Use mouse to rotate and zoom for better views

## 🔧 File Structure

```
detective-game/
├── index.html          # Main HTML file with 3D canvas
├── styles.css          # Stylesheet with 3D UI overlays
├── game3d.js          # Three.js 3D rendering engine
├── game.js            # Game main logic
├── cases.js           # Case data
└── README.md          # Documentation
```

## 🎨 Expandable Features (Future Plans)

- 🔒 Hidden easter eggs: Common suspects across cases
- 🧩 Time limit: Timed investigation mode
- 🗝️ Object interaction: Clues appear in multiple cases
- 📜 Master truth: Final revelation after solving all cases
- 💾 Save progress: Support for game progress saving
- 🌐 Multiplayer: Cooperative investigation mode
- 🎵 Background music: Richer audio system
- 🏆 Achievement system: Unlock badges and rewards

## 📝 Development Notes

### Adding New Cases

Add a new case object in `cases.js`:

```javascript
{
    id: 'your-case-id',
    type: 'Case Type',
    title: 'Case Title',
    description: 'Case description',
    sceneClass: 'scene-classname',
    sceneColor: 0x123456,
    clues: [
        {
            id: 'clue-id',
            name: 'Clue Name',
            description: 'Clue description',
            icon: '🔍',
            position: { x: 0, y: 1, z: 0 },
            tool: 'magnifier',
            hidden: false
        }
    ],
    solution: {
        culprit: 'Perpetrator',
        motive: 'Motive',
        keywords: ['keyword1', 'keyword2']
    }
}
```

### Customizing 3D Scenes

Modify the `createRoom()` and `addRoomProps()` methods in `game3d.js` to add custom 3D objects and lighting.

### Performance Optimization

- Adjust shadow quality in `game3d.js`
- Reduce polygon count for complex scenes
- Use texture compression for larger projects

## 🐛 Known Issues

- Sound effects may require user interaction before playing in some browsers
- Mobile touch controls need optimization
- Performance may vary on older devices

## 📄 License

This project is for educational and entertainment purposes only.

## 👨‍💻 Technology

**3D Detective Game** - Built with Three.js

**Key Technologies:**
- Three.js r128 - 3D rendering
- OrbitControls - Camera controls
- Raycaster - 3D object interaction
- Web Audio API - Sound system

---

**Enjoy solving the cases, Detective! 🕵️‍♂️**

*Drag to look around, click to investigate, and solve the mystery!*
