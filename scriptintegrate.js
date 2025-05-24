import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUljKJMWh1n2n_r3YdzfoC5Fxv0hHyiHI",
    authDomain: "birthdaywish-1bcba.firebaseapp.com",
    projectId: "birthdaywish-1bcba",
    storageBucket: "birthdaywish-1bcba.firebasestorage.app",
    messagingSenderId: "161371802424",
    appId: "1:161371802424:web:c275e4d76f964ee712cfcd",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveWish(wishText) {
    try {
        await addDoc(collection(db, "wishes"), {
            wish: wishText,
            timestamp: new Date()
        });
        document.getElementById("wishMessage").innerText = "Your wish is in the stars!";
        document.getElementById("wishMessage").style.display = "block";
        document.getElementById("wish-input").style.display = "none";
        document.getElementById("wish-btn").style.display = "none";
        createConfetti(document.getElementById("wish-btn"), 100);
    } catch (error) {
        console.error("Error saving wish:", error);
        document.getElementById("wishMessage").innerText = "Oops! Couldn't save your wish. Try again!";
        document.getElementById("wishMessage").style.display = "block";
    }
}

// ✅ Dynamic Sparkles with Canvas
function createSparkles() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Style the canvas
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";

    // Append to body
    document.body.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = ["#ffffff", "#ffb6c1", "#ffdfe6", "#ff8fab"];
    const sparkles = [];

    function createSparkle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4,
            alpha: 1,
            fade: Math.random() * 0.01 + 0.005,
            dx: Math.random() * 0.5 - 0.25 ,
            dy: Math.random() * -0.5 - 0.2,
            phase: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    for (let i = 0; i < 80; i++) {
        sparkles.push(createSparkle());
    }

    function hexToRgb(hex) {
        hex = hex.replace("#", "");
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }

    function drawSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        sparkles.forEach((s, i) => {
            // Move
            s.x += 0; // no sideways motion
            s.y += s.dy;
            s.phase += 0.05;

            s.alpha -= s.fade;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(s.color)}, ${s.alpha})`;
            ctx.fill();

            // Reset if out of bounds or invisible
            if (s.alpha <= 0 || s.y < -10 || s.x < -10 || s.x > canvas.width + 10) {
                sparkles[i] = createSparkle();
            }
        });

        requestAnimationFrame(drawSparkles);
    }

    drawSparkles(); // ✅ Start animation
}


// Intersection Observer
function setupIntersectionObserver() {
    const sections = document.querySelectorAll('.section, header, .note-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Cake
function setupCakeInteractions() {
    const cake = document.getElementById('cake');
    const flame = document.getElementById('flame');
    const lightBtn = document.getElementById('light-btn');
    const cutBtn = document.getElementById('cut-btn');
    let isLit = false;

    lightBtn.addEventListener('click', () => {
        isLit = !isLit;
        if (isLit) {
            flame.classList.add('lit');
            lightBtn.textContent = 'Blow Out Candle';
            createConfetti(cake);
        } else {
            flame.classList.remove('lit');
            lightBtn.textContent = 'Light the Candle';
        }
    });

    cutBtn.addEventListener('click', () => {
        cake.style.transform = 'scale(0.9)';
        setTimeout(() => {
            cake.style.transform = 'scale(1)';
            createConfetti(cake, 50);
        }, 300);
    });
}

// Wish
function setupWishInteraction() {
    const showWishBtn = document.getElementById('show-wish-btn');
    const wishContainer = document.getElementById('wish-container');
    const wishBtn = document.getElementById('wish-btn');
    const wishInput = document.getElementById('wish-input');

    showWishBtn.addEventListener('click', () => {
        wishContainer.style.display = 'block';
        showWishBtn.style.display = 'none';
    });

    wishBtn.addEventListener('click', () => {
        const wishText = wishInput.value.trim();
        if (wishText) {
            saveWish(wishText);
        } else {
            document.getElementById("wishMessage").innerText = "Please write your wish first!";
            document.getElementById("wishMessage").style.display = "block";
        }
    });
}

// Music Player
function setupMusicPlayer() {
    const songs = document.querySelectorAll('.song');
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const volUpBtn = document.getElementById('vol-up-btn');
    const volDownBtn = document.getElementById('vol-down-btn');

    const lyricsBox = document.getElementById('lyrics-box');
    const lyricsText = document.getElementById('lyrics-text');

    let lyricsData = [];
    let lyricsActive = false;

    songs.forEach(song => {
        song.addEventListener('click', async () => {
            const src = song.getAttribute('data-src');
            const lyricsFile = song.getAttribute('data-lyrics');

            audioPlayer.src = src;
            audioPlayer.play();

            songs.forEach(s => s.classList.remove('active'));
            song.classList.add('active');

            lyricsBox.classList.remove('hidden');
            lyricsText.textContent = 'Loading lyrics...';

            try {
                const response = await fetch(lyricsFile);
                if (!response.ok) throw new Error("Lyrics file not found.");
                const text = await response.text();
                lyricsData = parseTimestampedLyrics(text);
                lyricsText.textContent = '';
                lyricsActive = true;
            } catch (err) {
                lyricsText.textContent = 'Could not load lyrics 😢';
                lyricsActive = false;
                console.error(err);
            }
        });
    });

    audioPlayer.ontimeupdate = () => {
        if (!lyricsActive || !lyricsData.length) return;

        const currentTime = audioPlayer.currentTime;
        for (let i = lyricsData.length - 1; i >= 0; i--) {
            if (currentTime >= lyricsData[i].time) {
                if (lyricsData[i].hide) {
                    lyricsBox.classList.add('hidden');
                    lyricsText.textContent = '';
                } else {
                    lyricsBox.classList.remove('hidden');
                    lyricsText.textContent = lyricsData[i].line;
                }
                break;
            }
        }

        if (audioPlayer.duration && currentTime >= audioPlayer.duration) {
            lyricsActive = false;
            lyricsBox.classList.add('hidden');
            lyricsText.textContent = '';
        }
    };

    audioPlayer.addEventListener('ended', () => {
        lyricsActive = false;
        lyricsBox.classList.add('hidden');
        lyricsText.textContent = '';
    });

    playBtn.addEventListener('click', () => audioPlayer.play());
    pauseBtn.addEventListener('click', () => audioPlayer.pause());
    stopBtn.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        lyricsActive = false;
        lyricsBox.classList.add('hidden');
        lyricsText.textContent = '';
    });

    volUpBtn.addEventListener('click', () => {
        if (audioPlayer.volume < 1) audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
    });

    volDownBtn.addEventListener('click', () => {
        if (audioPlayer.volume > 0) audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
    });
}

function parseTimestampedLyrics(text) {
    const lines = text.split('\n');
    return lines.map(line => {
        const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/);
        if (!match) return null;

        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0;
        const content = match[4].trim();

        return {
            time: minutes * 60 + seconds + milliseconds / 1000,
            line: content,
            hide: content === '[HIDE]'
        };
    }).filter(Boolean);
}

function createConfetti(element, count = 30) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ['#ffb6c1', '#ff8fab', '#ffdfe6', '#ffffff', '#ff9a9e', '#fad0c4', '#ffef62'];

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 5;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;

        let posX = centerX;
        let posY = centerY;
        let opacity = 1;
        let rotation = 0;

        const animate = () => {
            posX += x;
            posY += y - 0.1;
            opacity -= 0.01;
            rotation += 2;

            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity;
            confetti.style.transform = `rotate(${rotation}deg)`;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        setTimeout(() => {
            requestAnimationFrame(animate);
        }, i * 20);
    }
}

// Countdown
const countdownTarget = new Date("May 24, " + new Date().getFullYear() + " 23:07:00").getTime();
const timerElement = document.getElementById("timer");
const mainContent = document.getElementById("mainContent");

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownTarget - now;

    if (distance <= 0) {
        document.getElementById('timer').classList.add('hidden');
        mainContent.classList.remove("hidden");
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerElement.innerText = `Countdown to Birthday!!!\n${days}d ${hours}h ${minutes}m ${seconds}s left`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createSparkles();
    setupIntersectionObserver();
    setupCakeInteractions();
    setupWishInteraction();
    setupMusicPlayer();
});
