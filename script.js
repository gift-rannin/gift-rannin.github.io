// Inisialisasi variabel global
let yesBtn, noBtn, startGameBtn, restartBtn;
let currentStep = 1;
let gameScore = 0;
let gameTimer = 10;
let timerInterval;
let gameActive = false;
let yesBtnSize = 1;
let noBtnSize = 1;
let noBtnClickCount = 0;
let giftOpened = false;

// Fungsi inisialisasi setelah halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log("Website Valentine dimuat!");
    console.log("💖 Fitur: Tombol Tidak mengecil, Tombol Ya membesar");
    
    // Inisialisasi elemen
    yesBtn = document.getElementById('yesBtn');
    noBtn = document.getElementById('noBtn');
    startGameBtn = document.getElementById('startGameBtn');
    restartBtn = document.getElementById('restartBtn');
    
    // Atur event listener
    setupEventListeners();
    
    // Tampilkan step pertama
    showStep(1);
    
    // Buat dekorasi hati berjatuhan secara berkala
    createFallingHearts();
});

// Atur semua event listener
function setupEventListeners() {
    // Tombol Ya
    yesBtn.addEventListener('click', function() {
        console.log("Tombol Ya diklik!");
        
        // Reset ukuran tombol
        resetButtonSizes();
        
        // Lanjut ke step berikutnya
        nextStep();
    });
    
    // Tombol Tidak - FIXED: tombol tidak mengecil, tombol ya membesar
    noBtn.addEventListener('click', handleNoButton);
    
    // Tombol mulai game
    startGameBtn.addEventListener('click', startGame);
    
    // Tombol restart
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            // Reset semua ke awal
            resetToFirstStep();
        });
    }
    
    // Gift box click
    const giftBox = document.getElementById('giftBox');
    if (giftBox) {
        giftBox.addEventListener('click', openGiftBox);
    }
}

// Fungsi untuk menangani tombol Tidak
function handleNoButton() {
    console.log("Tombol Tidak diklik! Hitung: " + (noBtnClickCount + 1));
    noBtnClickCount++;
    
    // Tombol Tidak mengecil
    noBtnSize = Math.max(0.5, noBtnSize - 0.1); // Minimal 0.5
    noBtn.style.transform = `scale(${noBtnSize})`;
    noBtn.classList.add('shrinking');
    
    // Tombol Ya membesar
    yesBtnSize = Math.min(2.0, yesBtnSize + 0.15); // Maksimal 2.0
    yesBtn.style.transform = `scale(${yesBtnSize})`;
    yesBtn.classList.add('growing');
    
    // Ubah teks tombol tidak
    changeNoButtonText();
    
    // Reset animasi setelah beberapa saat
    setTimeout(() => {
        noBtn.classList.remove('shrinking');
        yesBtn.classList.remove('growing');
    }, 300);
    
    // Jika tombol Tidak sudah terlalu kecil, sembunyikan
    if (noBtnSize <= 0.5) {
        setTimeout(() => {
            noBtn.style.display = 'none';
            // Paksa pilih Ya setelah tombol Tidak hilang
            setTimeout(() => {
                alert("Kamu harus memilih Ya! ❤️");
                nextStep();
            }, 500);
        }, 300);
    }
}

// Fungsi untuk mengubah teks tombol Tidak
function changeNoButtonText() {
    const noTexts = [
        "Yakin?",
        "Benarann nihh?",
        "Pikir-pikir lagi dehh!",
        "Jangan gituu!",
        "Aku sedih nih 😢",
        "Sayang...",
        "Tolong pilih Ya",
        "Aku akan menangis 😭",
        "Terakhir, pilih Ya ya?",
        "OK, kamu menang... pilih Ya ❤️"
    ];
    
    const index = Math.min(noBtnClickCount - 1, noTexts.length - 1);
    noBtn.textContent = noTexts[index] || "Tidak";
}

// Fungsi untuk reset ukuran tombol
function resetButtonSizes() {
    yesBtnSize = 1;
    noBtnSize = 1;
    yesBtn.style.transform = 'scale(1)';
    noBtn.style.transform = 'scale(1)';
    noBtn.style.display = 'block';
    noBtnClickCount = 0;
    noBtn.textContent = "Tidak";
    yesBtn.classList.remove('growing');
    noBtn.classList.remove('shrinking');
}

// Fungsi untuk pindah ke step berikutnya
function nextStep() {
    if (currentStep < 3) {
        currentStep++;
        showStep(currentStep);
    }
}

// Fungsi untuk menampilkan step tertentu
function showStep(stepNumber) {
    console.log(`Pindah ke step ${stepNumber}`);
    
    // Sembunyikan semua step
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Tampilkan step yang dipilih
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }
    
    // Update step saat ini
    currentStep = stepNumber;
    
    // Jika step 3, reset gift box dan auto play musik
    if (stepNumber === 3) {
        resetGiftBox();
        autoPlayMusic();
    }
}

// Fungsi untuk auto play musik setelah game selesai
function autoPlayMusic() {
    const music = document.getElementById('valentineMusic');
    if (music) {
        music.volume = 0.5; // Set volume 50%
        music.play().then(() => {
            console.log("🎵 Musik mulai diputar");
        }).catch(error => {
            console.log("Musik tidak bisa diputar otomatis:", error);
        });
    }
}

// Fungsi untuk memulai game
function startGame() {
    if (gameActive) return;
    
    console.log("Game dimulai!");
    gameActive = true;
    gameScore = 0;
    gameTimer = 10;
    
    // Reset tampilan game
    const gameResult = document.getElementById('gameResult');
    if (gameResult) gameResult.style.display = 'none';
    
    // Update tampilan
    document.getElementById('score').textContent = gameScore;
    document.getElementById('timer').textContent = gameTimer;
    
    // Nonaktifkan tombol mulai
    startGameBtn.disabled = true;
    startGameBtn.textContent = "Game Berlangsung!";
    
    // Kosongkan area game
    const gameArea = document.getElementById('gameArea');
    if (gameArea) gameArea.innerHTML = '';
    
    // Mulai timer
    startTimer();
    
    // Buat hati pertama
    createGameHeart();
    
    // Buat hati baru setiap detik
    const heartInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(heartInterval);
            return;
        }
        createGameHeart();
    }, 800);
}

// Fungsi untuk memulai timer game
function startTimer() {
    clearInterval(timerInterval); // Bersihkan interval sebelumnya
    
    timerInterval = setInterval(() => {
        gameTimer--;
        document.getElementById('timer').textContent = gameTimer;
        
        if (gameTimer <= 0) {
            endGame();
        }
    }, 1000);
}

// Fungsi untuk membuat hati di game
function createGameHeart() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('gameArea');
    if (!gameArea) return;
    
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    // Buat elemen hati
    const heart = document.createElement('div');
    heart.className = 'game-heart';
    heart.textContent = '❤️';
    heart.style.color = getRandomHeartColor();
    
    // Posisi acak dalam area game
    const maxX = gameAreaRect.width - 40;
    const maxY = gameAreaRect.height - 40;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    heart.style.left = `${randomX}px`;
    heart.style.top = `${randomY}px`;
    
    // Atur event listener untuk hati
    heart.addEventListener('click', function() {
        if (!gameActive) return;
        
        // Tambah skor
        gameScore++;
        document.getElementById('score').textContent = gameScore;
        
        // Animasi saat diklik
        this.style.transform = 'scale(1.5)';
        this.style.opacity = '0.7';
        
        // Hapus hati setelah diklik
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 200);
    });
    
    // Tambahkan hati ke area game
    gameArea.appendChild(heart);
}

// Fungsi untuk mendapatkan warna hati acak
function getRandomHeartColor() {
    const colors = [
        '#ff6b9d', '#ff8e53', '#ff4d7e', '#ff2d55', '#ff1493',
        '#ff69b4', '#ff1493', '#db7093', '#c71585', '#ff1493'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Fungsi untuk mengakhiri game
function endGame() {
    console.log("Game selesai!");
    gameActive = false;
    clearInterval(timerInterval);
    
    // Sembunyikan tombol mulai game
    startGameBtn.style.display = 'none';
    
    // Tampilkan hasil game
    const gameResult = document.getElementById('gameResult');
    const finalScoreElement = document.getElementById('finalScore');
    const resultComment = document.getElementById('resultComment');
    const resultTitle = document.getElementById('resultTitle');
    
    if (finalScoreElement) finalScoreElement.textContent = gameScore;
    
    // Tentukan pesan berdasarkan skor
    let comment = "";
    let title = "Game Selesai!";
    
    if (gameScore >= 20) {
        comment = "Luar biasa! Kamu benar-benar sangat mencintaiku! ❤️❤️❤️";
        title = "Wow! Kamu Hebat!";
    } else if (gameScore >= 15) {
        comment = "Bagus sekali! Kamu pasti sangat mencintaiku! 💖💖";
        title = "Keren!";
    } else if (gameScore >= 10) {
        comment = "Lumayan! Tapi aku tahu kamu bisa lebih baik 😉";
        title = "Game Selesai!";
    } else if (gameScore >= 5) {
        comment = "Coba lagi lain waktu ya, sayang! 💕";
        title = "Game Selesai!";
    } else {
        comment = "Hmm... kamu kurang semangat nih! 😢";
        title = "Game Selesai!";
    }
    
    if (resultComment) resultComment.textContent = comment;
    if (resultTitle) resultTitle.textContent = title;
    
    // Tampilkan hasil game
    if (gameResult) gameResult.style.display = 'block';
    
    // Mulai countdown untuk lanjut ke step berikutnya
    startAutoProceedCountdown();
}

// Fungsi untuk memulai countdown otomatis ke step berikutnya
function startAutoProceedCountdown() {
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    
    // Update countdown setiap detik
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            // Lanjut ke step 3 (gift/hadiah)
            showStep(3);
        }
    }, 1000);
}

// Fungsi untuk membuka gift box
function openGiftBox() {
    if (giftOpened) return;
    
    console.log("Membuka gift box!");
    giftOpened = true;
    
    const giftBox = document.getElementById('giftBox');
    const giftContent = document.getElementById('giftContent');
    
    // Animasi membuka gift box
    giftBox.classList.add('open');
    
    // Tampilkan konten hadiah setelah delay
    setTimeout(() => {
        if (giftContent) {
            giftContent.style.display = 'block';
            giftBox.style.display = 'none';
        }
    }, 1000);
}

// Fungsi untuk reset gift box
function resetGiftBox() {
    giftOpened = false;
    const giftBox = document.getElementById('giftBox');
    const giftContent = document.getElementById('giftContent');
    
    if (giftBox) {
        giftBox.classList.remove('open');
        giftBox.style.display = 'block';
    }
    
    if (giftContent) {
        giftContent.style.display = 'none';
    }
}

// Fungsi untuk reset ke step pertama
function resetToFirstStep() {
    console.log("Reset ke awal!");
    
    // Reset game
    if (gameActive) {
        gameActive = false;
        clearInterval(timerInterval);
    }
    
    // Hentikan musik
    const music = document.getElementById('valentineMusic');
    if (music) {
        music.pause();
        music.currentTime = 0;
    }
    
    // Reset tombol Ya dan Tidak
    resetButtonSizes();
    
    // Reset game display
    gameScore = 0;
    gameTimer = 10;
    document.getElementById('score').textContent = gameScore;
    document.getElementById('timer').textContent = gameTimer;
    
    if (startGameBtn) {
        startGameBtn.disabled = false;
        startGameBtn.textContent = "Mulai Game!";
        startGameBtn.style.display = "block";
    }
    
    const gameResult = document.getElementById('gameResult');
    if (gameResult) gameResult.style.display = 'none';
    
    const gameArea = document.getElementById('gameArea');
    if (gameArea) gameArea.innerHTML = '';
    
    // Reset gift box
    resetGiftBox();
    
    // Kembali ke step 1
    showStep(1);
}

// Fungsi untuk membuat hati berjatuhan
function createFallingHearts() {
    setInterval(() => {
        // Hanya buat hati berjatuhan di step 1
        if (currentStep !== 1) return;
        
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.color = getRandomHeartColor();
        heart.style.fontSize = Math.floor(Math.random() * 20 + 15) + 'px';
        heart.style.top = '-50px';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.opacity = '0.7';
        heart.style.zIndex = '0';
        heart.style.pointerEvents = 'none';
        heart.style.userSelect = 'none';
        
        document.body.appendChild(heart);
        
        // Animasi jatuh
        const animation = heart.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 4000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Hapus elemen setelah animasi selesai
        animation.onfinish = () => {
            if (heart.parentNode) {
                document.body.removeChild(heart);
            }
        };
    }, 800);
}