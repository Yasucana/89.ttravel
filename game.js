// Game state
let moments = [
    { time: 1, artifact: "none", door: "locked" },
    { time: 2, artifact: "none", door: "locked" },
    { time: 3, artifact: "none", door: "locked" },
    { time: 4, artifact: "none", door: "locked" },
    { time: 5, artifact: "none", door: "locked" }
];
let currentMoment = 0;

// DOM elements
const gameArea = document.getElementById("game-area");
const narrative = document.getElementById("narrative");
const timelineNodes = document.querySelectorAll(".timeline-node");
const resetButton = document.getElementById("reset");

// Render game state
function render() {
    const moment = moments[currentMoment];
    gameArea.innerHTML = `Artifact: ${moment.artifact} | Door: ${moment.door}`;
    narrative.textContent = `Moment ${currentMoment + 1}: ${moment.artifact === "held" ? "You hold the artifact!" : "Find the artifact."}`;
    timelineNodes.forEach((node, index) => {
        node.classList.toggle("active", index === currentMoment);
    });
    checkParadox();
    checkWin();
}

// Handle timeline clicks
timelineNodes.forEach(node => {
    node.addEventListener("click", () => {
        currentMoment = parseInt(node.dataset.moment);
        render();
    });
});

// Action: Pick up artifact
gameArea.addEventListener("click", () => {
    if (moments[currentMoment].door === "unlocked") {
        moments[currentMoment].artifact = "held";
        render();
    } else {
        narrative.textContent = "The door is locked! Find a way to unlock it.";
    }
});

// Action: Unlock door (e.g., in moment 2)
function unlockDoor() {
    if (currentMoment === 1) {
        moments[currentMoment].door = "unlocked";
        for (let i = currentMoment; i < moments.length; i++) {
            moments[i].door = "unlocked"; // Persist change forward
        }
        render();
    }
}

// Paradox check: Artifact can't be in two places
function checkParadox() {
    let artifactHeld = false;
    for (let moment of moments) {
        if (moment.artifact === "held") {
            if (artifactHeld) {
                narrative.textContent = "Paradox! The artifact can't be held twice!";
                return true;
            }
            artifactHeld = true;
        }
    }
    return false;
}

// Win condition: Artifact held in final moment, door unlocked, no paradox
function checkWin() {
    const finalMoment = moments[moments.length - 1];
    if (finalMoment.artifact === "held" && finalMoment.door === "unlocked" && !checkParadox()) {
        narrative.textContent = "Success! You retrieved the artifact!";
    }
}

// Reset game
resetButton.addEventListener("click", () => {
    moments = moments.map(() => ({ artifact: "none", door: "locked" }));
    currentMoment = 0;
    render();
});

// Initial render
render();