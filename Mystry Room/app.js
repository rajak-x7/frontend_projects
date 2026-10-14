// ==========================================
// 🕵️ MYSTERY ROOM - ADVANCED ESCAPE GAME
// ==========================================


// ==========================================
// GAME SETTINGS
// ==========================================

const GAME_TIME = 10 * 60;

const correctLockerCode = "2743";
const correctLaptopPassword = "SHADOW";


// ==========================================
// GAME STATE
// ==========================================

let game = {
    time: GAME_TIME,

    lives: 3,

    pictureFound: false,
    bookshelfFound: false,
    laptopUnlocked: false,
    lockerUnlocked: false,
    hasKey: false,

    hintsUsed: 0,

    escaped: false,
    gameOver: false
};


// ==========================================
// SELECT HTML ELEMENTS
// ==========================================

const picture = document.querySelector(".picture");
const bookshelf = document.querySelector(".bookshelf");
const laptop = document.querySelector(".laptop");
const locker = document.querySelector(".locker");
const exit = document.querySelector(".exit");

const detectiveLog = document.querySelector(".detective-log p");

const inventory = document.querySelector(".inventory-items");


// ==========================================
// START MESSAGE
// ==========================================

updateLog(
    "🕵️ You are trapped inside the room. Find the clues, unlock the locker and escape."
);


// ==========================================
// TIMER
// ==========================================

const timer = setInterval(function () {

    if (game.gameOver || game.escaped) {
        clearInterval(timer);
        return;
    }

    game.time--;

    updateTimer();

    if (game.time <= 0) {

        game.time = 0;

        updateTimer();

        gameOver("⏰ TIME'S UP!");
    }

}, 1000);


// ==========================================
// UPDATE TIMER
// ==========================================

function updateTimer() {

    const minutes = Math.floor(game.time / 60);

    const seconds = game.time % 60;

    const formattedSeconds =
        seconds < 10 ? "0" + seconds : seconds;


    const timerElement =
        document.querySelector(".timer");


    if (timerElement) {

        timerElement.textContent =
            `${minutes}:${formattedSeconds}`;

    }
}


// ==========================================
// PICTURE PUZZLE
// ==========================================

picture.addEventListener("click", function () {

    if (game.gameOver || game.escaped) return;


    if (game.pictureFound) {

        updateLog(
            "🖼️ You already searched the picture."
        );

        return;
    }


    game.pictureFound = true;


    updateLog(
        "🖼️ You moved the picture. Behind it you found a strange number: 27."
    );


    alert(
        "🔎 CLUE FOUND!\n\n" +
        "A strange number is written behind the picture:\n\n" +
        "27"
    );


    checkProgress();
});


// ==========================================
// BOOKSHELF PUZZLE
// ==========================================

bookshelf.addEventListener("click", function () {

    if (game.gameOver || game.escaped) return;


    if (!game.pictureFound) {

        loseLife();

        updateLog(
            "📚 The bookshelf looks suspicious, but you haven't found the first clue yet."
        );

        return;
    }


    if (game.bookshelfFound) {

        updateLog(
            "📚 You already searched the bookshelf."
        );

        return;
    }


    game.bookshelfFound = true;


    updateLog(
        "📚 You found an old book. Behind it is another number: 43."
    );


    alert(
        "📚 SECRET CLUE!\n\n" +
        "Behind an old book you found:\n\n" +
        "43"
    );


    checkProgress();
});


// ==========================================
// LAPTOP PUZZLE
// ==========================================

laptop.addEventListener("click", function () {

    if (game.gameOver || game.escaped) return;


    if (!game.bookshelfFound) {

        updateLog(
            "💻 The laptop is locked. Maybe another clue will help."
        );

        return;
    }


    if (game.laptopUnlocked) {

        updateLog(
            "💻 The laptop is already unlocked."
        );

        return;
    }


    const password = prompt(
        "💻 LAPTOP LOCK\n\n" +
        "Hint: What is the room hiding?"
    );


    if (password === null) return;


    if (password.toUpperCase() === correctLaptopPassword) {

        game.laptopUnlocked = true;


        updateLog(
            "💻 Laptop unlocked! You found information about the locker."
        );


        alert(
            "💻 ACCESS GRANTED!\n\n" +
            "The screen says:\n\n" +
            "LOCKER CODE = 27 + 43"
        );


        checkProgress();

    } else {

        loseLife();


        updateLog(
            "❌ Wrong laptop password."
        );

        alert(
            "❌ WRONG PASSWORD!"
        );
    }
});


// ==========================================
// LOCKER PUZZLE
// ==========================================

locker.addEventListener("click", function () {

    if (game.gameOver || game.escaped) return;


    if (!game.pictureFound || !game.bookshelfFound) {

        updateLog(
            "🔐 The locker is locked. You need to investigate the room first."
        );

        return;
    }


    if (!game.laptopUnlocked) {

        updateLog(
            "🔐 You have the numbers, but something is still missing."
        );

        return;
    }


    if (game.lockerUnlocked) {

        updateLog(
            "🔐 The locker is already open."
        );

        return;
    }


    const code = prompt(
        "🔐 LOCKER\n\n" +
        "Enter the 4-digit code:"
    );


    if (code === null) return;


    if (code === correctLockerCode) {

        game.lockerUnlocked = true;

        game.hasKey = true;


        addInventoryItem(
            "🔑",
            "Room Key"
        );


        updateLog(
            "🔓 LOCKER OPENED! You found the room key."
        );


        alert(
            "🔓 CORRECT CODE!\n\n" +
            "You found the 🔑 ROOM KEY!"
        );


        checkProgress();

    } else {

        loseLife();


        updateLog(
            "❌ Wrong locker code."
        );


        alert(
            "❌ WRONG CODE!\n\n" +
            "You lost one life."
        );
    }
});


// ==========================================
// EXIT DOOR
// ==========================================

exit.addEventListener("click", function () {

    if (game.gameOver || game.escaped) return;


    if (!game.hasKey) {

        updateLog(
            "🚪 The exit door is locked. You need the room key."
        );


        alert(
            "🚪 LOCKED!\n\n" +
            "You need the 🔑 Room Key."
        );


        return;
    }


    game.escaped = true;


    clearInterval(timer);


    updateLog(
        "🎉 You unlocked the door and escaped the Mystery Room!"
    );


    exit.innerHTML = `
        🚪
        <span>ESCAPED!</span>
    `;


    showWinScreen();
});


// ==========================================
// INVENTORY
// ==========================================

function addInventoryItem(icon, name) {

    inventory.innerHTML = "";


    const item = document.createElement("div");

    item.classList.add("item");


    item.innerHTML = `
        <span style="font-size: 25px;">
            ${icon}
        </span>

        <span>
            ${name}
        </span>
    `;


    inventory.appendChild(item);
}


// ==========================================
// LOSE LIFE
// ==========================================

function loseLife() {

    if (game.lives <= 0) return;


    game.lives--;


    updateLives();


    if (game.lives <= 0) {

        gameOver(
            "💀 YOU RAN OUT OF LIVES!"
        );
    }
}


// ==========================================
// UPDATE LIVES
// ==========================================

function updateLives() {

    const livesElement =
        document.querySelector(".lives");


    if (!livesElement) return;


    livesElement.textContent =
        "❤️".repeat(game.lives) +
        "🖤".repeat(3 - game.lives);
}


// ==========================================
// PROGRESS
// ==========================================

function checkProgress() {

    let progress = 0;


    if (game.pictureFound)
        progress++;

    if (game.bookshelfFound)
        progress++;

    if (game.laptopUnlocked)
        progress++;

    if (game.lockerUnlocked)
        progress++;

    if (game.hasKey)
        progress++;


    const progressElement =
        document.querySelector(".progress");


    if (progressElement) {

        progressElement.textContent =
            `${progress}/5`;
    }
}


// ==========================================
// DETECTIVE LOG
// ==========================================

function updateLog(message) {

    if (!detectiveLog) return;


    detectiveLog.textContent = message;
}


// ==========================================
// HINT SYSTEM
// ==========================================

function getHint() {

    if (game.gameOver || game.escaped) return;


    game.hintsUsed++;


    if (!game.pictureFound) {

        updateLog(
            "💡 HINT: Something about the picture looks suspicious."
        );

        return;
    }


    if (!game.bookshelfFound) {

        updateLog(
            "💡 HINT: Where do people usually hide secrets among knowledge?"
        );

        return;
    }


    if (!game.laptopUnlocked) {

        updateLog(
            "💡 HINT: The laptop may be looking for a word, not a number."
        );

        return;
    }


    if (!game.lockerUnlocked) {

        updateLog(
            "💡 HINT: Combine the two numbers you discovered."
        );

        return;
    }


    if (!game.hasKey) {

        updateLog(
            "💡 HINT: The key is waiting inside the locker."
        );
    }
}


// ==========================================
// GAME OVER
// ==========================================

function gameOver(message) {

    game.gameOver = true;


    clearInterval(timer);


    updateLog(message);


    setTimeout(function () {

        alert(
            message +
            "\n\n🔄 Refresh the page to try again."
        );

    }, 200);
}


// ==========================================
// WIN SCREEN
// ==========================================

function showWinScreen() {

    const timeTaken =
        GAME_TIME - game.time;


    const minutes =
        Math.floor(timeTaken / 60);


    const seconds =
        timeTaken % 60;


    const score =
        calculateScore();


    setTimeout(function () {

        alert(
            "🎉 CONGRATULATIONS!\n\n" +

            "You escaped the Mystery Room!\n\n" +

            `⏱️ Time: ${minutes}m ${seconds}s\n` +

            `❤️ Lives: ${game.lives}/3\n` +

            `💡 Hints: ${game.hintsUsed}\n\n` +

            `🏆 Score: ${score}`
        );


        saveBestScore(score);

    }, 300);
}


// ==========================================
// SCORE
// ==========================================

function calculateScore() {

    let score = 1000;


    // Time bonus
    score += game.time * 2;


    // Life bonus
    score += game.lives * 200;


    // Hint penalty
    score -= game.hintsUsed * 100;


    if (score < 0) {
        score = 0;
    }


    return score;
}


// ==========================================
// BEST SCORE
// ==========================================

function saveBestScore(score) {

    const oldScore =
        localStorage.getItem("mysteryBestScore");


    if (!oldScore || score > Number(oldScore)) {

        localStorage.setItem(
            "mysteryBestScore",
            score
        );


        alert(
            `🏆 NEW BEST SCORE!\n\n${score}`
        );
    }
}


// ==========================================
// INITIAL UI
// ==========================================

updateTimer();

updateLives();

checkProgress();


// ==========================================
// KEYBOARD SHORTCUT
// ==========================================

document.addEventListener("keydown", function (event) {

    // H = Hint

    if (
        event.key.toLowerCase() === "h"
    ) {

        getHint();
    }
});