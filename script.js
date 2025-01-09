const canvas = document.getElementById('arcticMap');
const ctx = canvas.getContext('2d');

// Image objects for boat, station, and water texture
const boatImg = new Image();
boatImg.src = "Schiff.png";

const stationImg = new Image();
stationImg.src = "Station.png"; // Berufliche Erfahrung

const demoImg = new Image();
demoImg.src = "Demo.png"; // Ehrenamtliches Engagement

const schuleImg = new Image();
schuleImg.src = "Schule.png"; // Schulische Ausbildung

const riesenradImg = new Image();
riesenradImg.src = "Riesenrad.png"; // Kenntnisse und Interessen

const waterTexture = new Image();
waterTexture.src = "Water.png"; // Updated water texture

// Boat properties
let boatX = canvas.width / 2 - boatDisplayWidth / 2; // Start in der Mitte des Canvas
let boatY = canvas.height / 2 - boatDisplayHeight / 2; // Start in der Mitte des Canvas
const boatDisplayWidth = 80; // Display width of the boat on the canvas
let boatDisplayHeight; // Display height will be calculated based on the image's aspect ratio
let boatVx = 0;
let boatVy = 0;
let boatAngle = Math.PI / 2; // Start facing upwards (90 degrees)
const boatRotationSpeed = 0.03; // Slower rotation speed
const boatAcceleration = 0.04; // Increased acceleration
const boatFriction = 0.98; // Adjusted friction
const boatMaxSpeed = 7; // Increased maximum speed

// Station properties
let stationDisplayWidth = Math.min(canvas.width, canvas.height) * 0.5; // Initial display width of the station on the canvas
let stationDisplayHeight = stationDisplayWidth; // Initial display height of the station on the canvas

// Function to resize canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update station sizes based on canvas size
    stationDisplayWidth = Math.min(canvas.width, canvas.height) * 0.1; // 10% der kleineren Bildschirmdimension
    stationDisplayHeight = stationDisplayWidth;

    // Update station positions
    updateStationPositions();
}

// Stations with placeholders for different sections
const stations = [
    {
        x: 0, // Will be updated dynamically
        y: 0, // Will be updated dynamically
        width: stationDisplayWidth,
        height: stationDisplayHeight,
        image: stationImg, // Berufliche Erfahrung
        section: 'Berufspraktische Erfahrung',
        content: `
            <table class="infoTable">
                <tr>
                    <td style="width: 40%;"> <!-- Wider left column -->
                        <h3>KPMG Deutschland AG</h3>
                        <p><strong>Standort:</strong> München</p>
                        <p><strong>Zeitraum:</strong> 04/2024 – 08/2024</p>
                    </td>
                    <td style="width: 60%;"> <!-- Narrower right column -->
                        <h3>Praktikum Beratung Nachhaltigkeit</h3>
                        <ul>
                            <li>3 Monate im Bereich Value Creation ESG: ESG Reporting & Datengetriebene Identifizierung von Value Creation Opps.</li>
                            <li>2 Monate im Bereich Data Analytics ESG Financial Service: Erstellung von CO2 (Fach-)Konzepten & Begleitung CSRD Reporting</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>accilium GmbH</h3>
                        <p><strong>Standort:</strong> München</p>
                        <p><strong>Zeitraum:</strong> 03/2023 – 05/2023</p>
                    </td>
                    <td>
                        <h3>Praktikum in der Management-Beratung</h3>
                        <ul>
                            <li>Wissensträger und selbstständige Recherche zur Nachhaltigkeitsberichterstattung (CSRD) und -strategie</li>
                            <li>Management einer staatl. Mobilitäts-Transformationsplattform (https://aatp.at/)</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>iac-Würzburg e.V.</h3>
                        <p><strong>Standort:</strong> Würzburg</p>
                        <p><strong>Zeitraum:</strong> 03/2022 – aktuell</p>
                    </td>
                    <td>
                        <h3>Wissensmanager, Director IT & 2. Vorstandsvorsitzender</h3>
                        <ul>
                            <li>Lead von IT-Strategie Entwicklung bei externem Projekt mit >30.000€ Volumen</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>anevis solutions GmbH</h3> <!-- Corrected name -->
                        <p><strong>Standort:</strong> Würzburg</p>
                        <p><strong>Zeitraum:</strong> 09/2022 – 12/2022</p>
                    </td>
                    <td>
                        <h3>Praktikum als Projektmanager</h3>
                        <ul>
                            <li>Wissensträger im Bereich SFRD sowie Risiko- & Performancebewertung</li>
                            <li>Direkte Kundenbetreuung für Marketing- und regulatorische Dokumente</li>
                        </ul>
                    </td>
                </tr>
            </table>
        `
    },
    {
        x: 0, // Will be updated dynamically
        y: 0, // Will be updated dynamically
        width: stationDisplayWidth,
        height: stationDisplayHeight,
        image: schuleImg, // Schulische Ausbildung
        section: 'Schul- und Hochschulbildung',
        content: `
            <table class="infoTable">
                <tr>
                    <td style="width: 40%;"> <!-- Wider left column -->
                        <h3>Tbilisi State University</h3>
                        <p><strong>Zeitraum:</strong> 09/2023 – 02/2024</p>
                    </td>
                    <td style="width: 60%;"> <!-- Narrower right column -->
                        <h3>Auslandssemester in Georgien</h3>
                        <ul>
                            <li>Belegte Kurse in Climate Change Economics, Machine Learning & Leadership</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Julius-Maximilians-Universität</h3>
                        <p><strong>Zeitraum:</strong> 08/2021 – aktuell</p>
                    </td>
                    <td>
                        <h3>Bachelor Studium Wirtschaftsinformatik</h3>
                        <ul>
                            <li>Vorläufiger Durchschnitt: 1,1 (Dean’s List, Deutschlandstipendium)</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Johann-Schöner-Gymnasium</h3>
                        <p><strong>Zeitraum:</strong> 09/2017 – 06/2021</p>
                    </td>
                    <td>
                        <h3>Allgemeine Hochschulreife</h3>
                        <ul>
                            <li>Durchschnitt: 1,3</li>
                        </ul>
                    </td>
                </tr>
            </table>
        `
    },
    {
        x: 0, // Will be updated dynamically
        y: 0, // Will be updated dynamically
        width: stationDisplayWidth,
        height: stationDisplayHeight,
        image: demoImg, // Ehrenamtliches Engagement
        section: 'Ehrenamtliches Engagement',
        content: `
            <table class="infoTable">
                <tr>
                    <td style="width: 40%;"> <!-- Wider left column -->
                        <h3>Junge Liberale Main-Spessart & LHG Würzburg</h3>
                        <p><strong>Zeitraum:</strong> 01/2022 – 10/2024</p>
                    </td>
                    <td style="width: 60%;"> <!-- Narrower right column -->
                        <h3>Mitglied des Vorstands als Programmatiker & Beisitzer</h3>
                        <ul>
                            <li>Entwicklung und Diskussion von Anträgen (u.A. im Themenbereich Smart Grids)</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Tennisverein Laudenbach</h3>
                        <p><strong>Zeitraum:</strong> 08/2020 – aktuell</p>
                    </td>
                    <td>
                        <h3>Unterstützung beim Kindertraining</h3>
                        <ul>
                            <li>Unterstützung beim Training von Kindern im Tennisverein</li>
                        </ul>
                    </td>
                </tr>
            </table>
        `
    },
    {
        x: 0, // Will be updated dynamically
        y: 0, // Will be updated dynamically
        width: stationDisplayWidth,
        height: stationDisplayHeight,
        image: riesenradImg, // Kenntnisse und Interessen
        section: 'Kenntnisse und Interessen',
        content: `
            <table class="infoTable">
                <tr>
                    <th>Kenntnisse</th>
                    <th>Sprachen</th>
                    <th>Interessen</th>
                </tr>
                <tr>
                    <td>
                        MS Office (insb. Excel)<br>
                        Power BI<br>
                        Java & Python
                    </td>
                    <td>
                        Deutsch (Muttersprache)<br>
                        Englisch (B2/C1)<br>
                        Französisch (A2)
                    </td>
                    <td>
                        Rennrad-Fahren<br>
                        Nachhaltigkeit<br>
                        Technologie
                    </td>
                </tr>
            </table>
        `
    }
];

// Key event listeners
const keys = {};

document.addEventListener('keydown', function(event) {
    keys[event.code] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

// Mobile Controls
const mobileControls = document.getElementById('mobileControls');
const upButton = document.getElementById('upButton');
const leftButton = document.getElementById('leftButton');
const downButton = document.getElementById('downButton');
const rightButton = document.getElementById('rightButton');

// Touch-Events für mobile Steuerung
upButton.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Verhindert Standardverhalten (z.B. Scrollen)
    keys['ArrowUp'] = true;
});
upButton.addEventListener('touchend', () => keys['ArrowUp'] = false);

leftButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowLeft'] = true;
});
leftButton.addEventListener('touchend', () => keys['ArrowLeft'] = false);

downButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowDown'] = true;
});
downButton.addEventListener('touchend', () => keys['ArrowDown'] = false);

rightButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowRight'] = true;
});
rightButton.addEventListener('touchend', () => keys['ArrowRight'] = false);

// Zeige mobile Steuerung nur auf mobilen Geräten
if (/Mobi|Android/i.test(navigator.userAgent)) {
    mobileControls.classList.remove('hidden');
}

// Update boat position and angle
function updateBoat() {
    if (keys['ArrowUp']) {
        boatVx += Math.cos(boatAngle) * boatAcceleration;
        boatVy += Math.sin(boatAngle) * boatAcceleration;
    }
    if (keys['ArrowDown']) {
        boatVx -= Math.cos(boatAngle) * boatAcceleration;
        boatVy -= Math.sin(boatAngle) * boatAcceleration;
    }
    if (keys['ArrowLeft']) {
        boatAngle -= boatRotationSpeed;
    }
    if (keys['ArrowRight']) {
        boatAngle += boatRotationSpeed;
    }

    // Apply friction (less friction for longer drifting)
    boatVx *= boatFriction;
    boatVy *= boatFriction;

    // Limit the boat's speed
    const speed = Math.sqrt(boatVx * boatVx + boatVy * boatVy);
    if (speed > boatMaxSpeed) {
        boatVx = (boatVx / speed) * boatMaxSpeed;
        boatVy = (boatVy / speed) * boatMaxSpeed;
    }

    // Update position
    boatX += boatVx;
    boatY += boatVy;

    // Keep boat within canvas boundaries
    if (boatX < 0) boatX = 0;
    if (boatX > canvas.width - boatDisplayWidth) boatX = canvas.width - boatDisplayWidth;
    if (boatY < 0) boatY = 0;
    if (boatY > canvas.height - boatDisplayHeight) boatY = canvas.height - boatDisplayHeight;
}

// Draw water texture as background
function drawWaterTexture() {
    // Draw the water texture, repeating it to cover the entire canvas
    const pattern = ctx.createPattern(waterTexture, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the boat rotated according to its angle
function drawBoat() {
    // Calculate display height based on the image's aspect ratio
    const aspectRatio = boatImg.naturalHeight / boatImg.naturalWidth;
    boatDisplayHeight = boatDisplayWidth * aspectRatio;

    ctx.save();
    ctx.translate(boatX + boatDisplayWidth / 2, boatY + boatDisplayHeight / 2);
    ctx.rotate(boatAngle);
    ctx.drawImage(boatImg, -boatDisplayWidth / 2, -boatDisplayHeight / 2, boatDisplayWidth, boatDisplayHeight);
    ctx.restore();
}

// Draw stations on the canvas
function drawStations() {
    stations.forEach(station => {
        ctx.drawImage(station.image, station.x, station.y, station.width, station.height);
    });
}

// Check for collision between rotated boat and stations
function checkCollisions() {
    // Get the corners of the rotated boat
    const boatCenterX = boatX + boatDisplayWidth / 2;
    const boatCenterY = boatY + boatDisplayHeight / 2;

    const cos = Math.cos(boatAngle);
    const sin = Math.sin(boatAngle);

    // Calculate the corners of the rotated boat
    const boatCorners = [
        { x: -boatDisplayWidth / 2, y: -boatDisplayHeight / 2 },
        { x: boatDisplayWidth / 2, y: -boatDisplayHeight / 2 },
        { x: boatDisplayWidth / 2, y: boatDisplayHeight / 2 },
        { x: -boatDisplayWidth / 2, y: boatDisplayHeight / 2 }
    ].map(corner => {
        return {
            x: boatCenterX + (corner.x * cos - corner.y * sin),
            y: boatCenterY + (corner.x * sin + corner.y * cos)
        };
    });

    // Check for collision with each station
    stations.forEach(station => {
        const stationLeft = station.x;
        const stationRight = station.x + station.width;
        const stationTop = station.y;
        const stationBottom = station.y + station.height;

        // Check if any corner of the boat is inside the station
        let collision = false;
        for (const corner of boatCorners) {
            if (
                corner.x >= stationLeft &&
                corner.x <= stationRight &&
                corner.y >= stationTop &&
                corner.y <= stationBottom
            ) {
                collision = true;
                break;
            }
        }

        if (collision) {
            // Bounce the boat with increased bounciness
            boatVx *= -0.8; // Increased bounce factor
            boatVy *= -0.8; // Increased bounce factor

            // Show information for 2 seconds
            document.getElementById('infoPopup').classList.remove('hidden');
            document.getElementById('infoPopup').innerHTML = `
                <h2>${station.section}</h2>
                <div style="font-size: 14px; width: 650px;">${station.content}</div>
            `;
            setTimeout(() => {
                document.getElementById('infoPopup').classList.add('hidden');
            }, 2000); // Hide after 2 seconds
        }
    });
}

// Function to update station positions based on canvas size
function updateStationPositions() {
    stations[0].x = 0.2 * canvas.width; // Berufliche Erfahrung
    stations[0].y = 0.1 * canvas.height;
    stations[1].x = 0.7 * canvas.width; // Schulische Ausbildung
    stations[1].y = 0.1 * canvas.height;
    stations[2].x = 0.2 * canvas.width; // Ehrenamtliches Engagement
    stations[2].y = 0.6 * canvas.height;
    stations[3].x = 0.7 * canvas.width; // Kenntnisse und Interessen
    stations[3].y = 0.6 * canvas.height;
}

// Main game loop
function gameLoop() {
    updateBoat();
    drawWaterTexture(); // Draw the water texture as background
    drawStations();
    drawBoat();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
    resizeCanvas();
});

// Start the game loop once images are loaded
Promise.all([
    new Promise((resolve) => { boatImg.onload = resolve; }),
    new Promise((resolve) => { stationImg.onload = resolve; }),
    new Promise((resolve) => { demoImg.onload = resolve; }),
    new Promise((resolve) => { schuleImg.onload = resolve; }),
    new Promise((resolve) => { riesenradImg.onload = resolve; }),
    new Promise((resolve) => { waterTexture.onload = resolve; })
]).then(() => {
    resizeCanvas(); // Initial resize
    gameLoop();
});