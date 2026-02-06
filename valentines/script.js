document.addEventListener('DOMContentLoaded', function() {

    // --- FEATURE 10: LOCK SCREEN LOGIC ---
    const lockScreen = document.getElementById('lockScreen');
    const loginBtn = document.getElementById('loginBtn');
    const passwordInput = document.getElementById('passwordInput');
    const errorMsg = document.getElementById('errorMsg');
    const togglePassword = document.getElementById('togglePassword');
    const CORRECT_PASS = "170825";

    // Check if already logged in (optional, session storage clears on browser close)
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        lockScreen.style.display = 'none';
    }

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePassword.style.background = '#A52A2A';
        } else {
            passwordInput.type = 'password';
            togglePassword.style.background = '#8B0000';
        }
    });

    function checkPassword() {
        if (passwordInput.value === CORRECT_PASS) {
            lockScreen.classList.add('hidden');
            sessionStorage.setItem('isLoggedIn', 'true');
            // Play music automatically after a short delay
            setTimeout(() => {
                const audioPlayer = document.getElementById('audioPlayer');
                const playBtn = document.getElementById('playBtn');
                audioPlayer.play().then(() => {
                    playBtn.textContent = '⏸';
                    isPlaying = true;
                }).catch(() => {
                    console.log("Autoplay blocked by browser");
                });
            }, 800);
        } else {
            errorMsg.style.display = 'block';
            passwordInput.value = '';
            // Shake effect
            const content = document.querySelector('.lock-content');
            content.style.transform = 'translateX(10px)';
            setTimeout(() => content.style.transform = 'translateX(-10px)', 100);
            setTimeout(() => content.style.transform = 'translateX(0)', 200);
        }
    }

    loginBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkPassword();
    });


    // --- LETTER CONTENT ---
    const letterContent = document.getElementById('letterContent');
    if(letterContent) {
        letterContent.innerHTML = `
            <p>Every moment I've spent with you so far has meant more to me than I could ever fully put into words. Being with you feels safe, warm, and real. You make my heart smile in a way no one else ever has, and I'm endlessly grateful that life brought you into mine.</p>
            <p>Thank you for being exactly who you are. Thank you for your patience, your kindness, your humor, and for somehow always knowing how to make me laugh even on my worst days. Thank you for putting up with my chaos, my overthinking, my bullshittery, and loving me anyway, without trying to change me, without judgment. That kind of love is rare, and I never take it for granted.</p>
            <p>You've given me so many beautiful memories already, and every single one of them lives rent-free in my heart. You make ordinary moments feel special just by being there. You make me feel seen, chosen, and deeply loved, and that means everything to me.</p>
            <p>I will always be grateful for everything you've gone through for me, whether it was emotional, financial, or simply choosing me when things weren't easy. Your sacrifices, your strength, and your loyalty do not go unnoticed. You are the sweetest, most precious soul I have ever known, and I feel incredibly lucky to love you and be loved by you.</p>
            <p>When I think about the future, I don't see it without you. I can't imagine my life, my dreams, or my growth without your hand in mine. I can only hope and pray that you are the person I get to call my husband one day, because loving you feels like home.</p>
            <p>I love you more than words could ever capture, my precious boy. Always have. Always will.</p>
        `;
    }

    // --- CARD FLIP ---
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const card = document.querySelector('.card');

    openBtn.addEventListener('click', function() {
        card.classList.add('flipped');
    });

    closeBtn.addEventListener('click', function() {
        card.classList.remove('flipped');
        // Stop video if it's playing
        const videoPlayer = document.getElementById('videoPlayer');
        const videoContainer = document.getElementById('videoContainer');
        const invitationContainer = document.getElementById('invitationContainer');
        const invitationBtn = document.getElementById('invitationBtn');
        const invitationArrow = document.getElementById('invitationArrow');

        if (videoContainer && videoContainer.classList.contains('active')) {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoContainer.classList.remove('active');
            messageContent.style.display = 'block';
            // Show invitation button and arrow again when leaving video
            if (invitationBtn) invitationBtn.style.display = 'block';
            if (invitationArrow) invitationArrow.style.display = 'block';
            // Resume music when leaving video if it was playing before
            if (wasMusicPlayingBeforeVideo) {
                audioPlayer.play();
                isPlaying = true;
                playBtn.textContent = '⏸';
            }
        }

        // Reset invitation if it's showing
        if (invitationContainer && invitationContainer.classList.contains('active')) {
            invitationContainer.classList.remove('active');
            messageContent.style.display = 'block';
            if (invitationBtn) invitationBtn.style.display = 'block';
            if (invitationArrow) invitationArrow.style.display = 'block';
        }
    });

    // --- MUSIC PLAYER ---
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const volumeBar = document.getElementById('volumeBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');

    const songs = [
        {
            title: "EVERYTHING",
            artist: "The Black Skirts",
            src: "media/songs/The Black Skirts - EVERYTHING 4.mp3",
            startTime: 22
        },
        {
            title: "My Mistakes Were Made For You",
            artist: "The Last Shadow Puppets",
            src: "media/songs/The Last Shadow Puppets - My Mistakes Were Made For You.mp3"
        },
        {
            title: "I Wanna Be Yours",
            artist: "Arctic Monkeys",
            src: "media/songs/Arctic Monkeys - I Wanna Be Yours 0.mp3"
        },
        {
            title: "Here Comes My Baby",
            artist: "Coyle Girelli",
            src: "media/songs/Coyle Girelli - Here Comes My Baby (Official Music Video).mp3"
        },
        {
            title: "Where's My Girl?",
            artist: "Coyle Girelli",
            src: "media/songs/Coyle Girelli - Where's My Girl_ (Official Audio).mp3"
        },
        {
            title: "back to friends",
            artist: "sombr",
            src: "media/songs/sombr - back to friends (official audio) 0.mp3"
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;
    let wasMusicPlayingBeforeVideo = false;

    function loadSong(index) {
        const song = songs[index];
        audioPlayer.src = song.src;
        if (song.startTime) {
            audioPlayer.currentTime = song.startTime;
        }
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
    }

    function togglePlay() {
        if (isPlaying) {
            audioPlayer.pause();
            playBtn.textContent = '▶';
        } else {
            audioPlayer.play();
            playBtn.textContent = '⏸';
        }
        isPlaying = !isPlaying;
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        }
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        }
    }

    function updateProgress() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress || 0;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }

    function seek() {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }

    function setVolume() {
        audioPlayer.volume = volumeBar.value / 100;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    progressBar.addEventListener('input', seek);
    volumeBar.addEventListener('input', setVolume);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', function() {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.addEventListener('ended', nextSong);

    loadSong(currentSongIndex);
    setVolume();

    // --- VIDEO PLAYER ---
    const videoBtn = document.getElementById('videoBtn');
    const videoContainer = document.getElementById('videoContainer');
    const messageContent = document.getElementById('messageContent');
    const videoPlayer = document.getElementById('videoPlayer');

    videoBtn.addEventListener('click', function() {
        messageContent.style.display = 'none';
        videoContainer.classList.add('active');
        videoPlayer.play();
        // Hide invitation button and arrow when video plays
        const invitationBtn = document.getElementById('invitationBtn');
        const invitationArrow = document.getElementById('invitationArrow');
        if (invitationBtn) invitationBtn.style.display = 'none';
        if (invitationArrow) invitationArrow.style.display = 'none';
        // Save music state and pause music when video plays
        wasMusicPlayingBeforeVideo = isPlaying;
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            playBtn.textContent = '▶';
        }
    });

    // --- INVITATION ---
    const invitationBtn = document.getElementById('invitationBtn');
    const invitationContainer = document.getElementById('invitationContainer');

    const invitationArrow = document.getElementById('invitationArrow');

    invitationBtn.addEventListener('click', function() {
        messageContent.style.display = 'none';
        invitationBtn.style.display = 'none';
        if (invitationArrow) invitationArrow.style.display = 'none';
        invitationContainer.classList.add('active');
    });

    // --- ANIMATIONS ---
    const petalsContainers = document.querySelectorAll('#petalsContainer');
    function createPetal() {
        petalsContainers.forEach(petalsContainer => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.top = Math.random() * 100 + '%';
            petal.style.animationDuration = (Math.random() * 4 + 6) + 's';
            petal.style.animationDelay = Math.random() * 2 + 's';
            petalsContainer.appendChild(petal);

            setTimeout(() => {
                petal.remove();
            }, 18000);
        });
    }
    // Create initial hearts
    for(let i = 0; i < 50; i++) {
        createPetal();
    }
    setInterval(createPetal, 350);

    const firefliesContainer = document.getElementById('firefliesContainer');
    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.bottom = Math.random() * 30 + '%';
        firefly.style.animationDuration = (Math.random() * 4 + 6) + 's';
        firefly.style.animationDelay = Math.random() * 3 + 's';
        firefliesContainer.appendChild(firefly);

        setTimeout(() => {
            firefly.remove();
        }, 12000);
    }
    setInterval(createFirefly, 500);

    // --- PHOTO VIEWER ---
    const photoViewer = document.getElementById('photoViewer');
    const viewerImg = document.getElementById('viewerImg');
    const viewerClose = document.getElementById('viewerClose');
    const viewerPrev = document.getElementById('viewerPrev');
    const viewerNext = document.getElementById('viewerNext');
    const polaroids = document.querySelectorAll('.polaroid.clickable');

    const photoSrcs = Array.from(polaroids).map(p => p.getAttribute('data-img'));
    let currentPhotoIndex = 0;

    polaroids.forEach((polaroid, index) => {
        polaroid.addEventListener('click', function() {
            // Only open viewer if NOT dragging
            if (!isDragging) {
                currentPhotoIndex = index;
                viewerImg.src = photoSrcs[currentPhotoIndex];
                photoViewer.classList.add('active');
            }
        });
    });

    viewerClose.addEventListener('click', function() {
        photoViewer.classList.remove('active');
    });

    viewerPrev.addEventListener('click', function() {
        currentPhotoIndex = (currentPhotoIndex - 1 + photoSrcs.length) % photoSrcs.length;
        viewerImg.src = photoSrcs[currentPhotoIndex];
    });

    viewerNext.addEventListener('click', function() {
        currentPhotoIndex = (currentPhotoIndex + 1) % photoSrcs.length;
        viewerImg.src = photoSrcs[currentPhotoIndex];
    });

    photoViewer.addEventListener('click', function(e) {
        if (e.target === photoViewer) {
            photoViewer.classList.remove('active');
        }
    });

    // --- FEATURE 4: DRAGGABLE POLAROIDS ---
    let activeItem = null;
    let initialX, initialY, currentX, currentY;
    let xOffset = 0, yOffset = 0;
    let isDragging = false; // Flag to prevent click event
    let originalTransform = ""; // Store original transform

    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(item => {
        item.addEventListener('mousedown', dragStart);
        item.addEventListener('touchstart', dragStart, {passive: false});
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, {passive: false});
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        // Don't drag if clicking buttons or inputs (mostly useful if items have children)
        if (e.target.closest('.photo-viewer')) return;

        activeItem = this;
        isDragging = false;

        // Store the original transform from inline style
        const styleAttr = activeItem.getAttribute('style');
        const transformMatch = styleAttr ? styleAttr.match(/transform:\s*([^;]+)/) : null;
        originalTransform = transformMatch ? transformMatch[1] : "";

        // Get current position relative to viewport
        const rect = activeItem.getBoundingClientRect();

        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - rect.left;
            initialY = e.touches[0].clientY - rect.top;
        } else {
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
        }

        // Bring to front
        draggables.forEach(d => d.style.zIndex = "1");
        activeItem.style.zIndex = "100";
    }

    function drag(e) {
        if (activeItem) {
            e.preventDefault();
            isDragging = true; // Movement detected, so it's a drag, not a click

            let clientX, clientY;
            if (e.type === "touchmove") {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            activeItem.style.left = (clientX - initialX) + "px";
            activeItem.style.top = (clientY - initialY) + "px";
            // Preserve original transform (rotation) and add scale
            activeItem.style.transform = originalTransform + " scale(1.05)";
        }
    }

    function dragEnd() {
        if (activeItem) {
            // Restore original transform without scale
            activeItem.style.transform = originalTransform;
            activeItem = null;
            // Reset drag flag after short delay to allow click event to filter
            setTimeout(() => { isDragging = false; }, 100);
        }
    }

    // --- COUPONS FEATURE ---
    const couponsBtn = document.getElementById('couponsBtn');
    const couponsModal = document.getElementById('couponsModal');
    const couponsClose = document.getElementById('couponsClose');
    const couponBtns = document.querySelectorAll('.coupon-btn');
    const couponMessage = document.getElementById('couponMessage');

    // Telegram notification
    const TELEGRAM_BOT_TOKEN = '7796361498:AAGM6PFluLkFwdL-_LICXh0LOSCIc-bEV5I';
    const TELEGRAM_CHAT_ID = '5503919300';

    function sendTelegramNotification(couponName) {
        const message = `🎟️ Coupon Acquired\n\nKimi just claimed: "${couponName}"`;
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;

        // Using GET request which works better on localhost
        fetch(url)
            .then(response => response.json())
            .then(data => console.log('Telegram response:', data))
            .catch(err => console.log('Telegram notification failed:', err));
    }

    // Show message helper
    function showCouponMessage(text, duration = 2000) {
        couponMessage.textContent = text;
        couponMessage.classList.add('show');
        setTimeout(() => {
            couponMessage.classList.remove('show');
        }, duration);
    }

    // Open coupons modal
    couponsBtn.addEventListener('click', function() {
        couponsModal.classList.add('active');
    });

    // Close coupons modal
    couponsClose.addEventListener('click', function() {
        couponsModal.classList.remove('active');
    });

    // Close on outside click
    couponsModal.addEventListener('click', function(e) {
        if (e.target === couponsModal) {
            couponsModal.classList.remove('active');
        }
    });

    // Handle coupon clicks
    couponBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const couponName = this.getAttribute('data-name');

            // Show success message
            showCouponMessage("Coupon acquired! The benefits will shortly be provided!", 4000);

            // Send Telegram notification
            sendTelegramNotification(couponName);
        });
    });

    // --- SCRATCH CARD FEATURE ---
    const scratchBtn = document.getElementById('scratchBtn');
    const scratchModal = document.getElementById('scratchModal');
    const scratchClose = document.getElementById('scratchClose');
    const scratchCanvas = document.getElementById('scratchCanvas');
    let scratchCtx = null;
    let isScratching = false;
    let scratchInitialized = false;
    let lastScratchX = null;
    let lastScratchY = null;

    function initScratchCard() {
        if (scratchInitialized) return;

        const heartImg = new Image();
        heartImg.src = 'media/decor/main-page/scratch-heart.png';

        heartImg.onload = function() {
            // Set canvas to heart image size
            scratchCanvas.width = heartImg.width;
            scratchCanvas.height = heartImg.height;

            scratchCtx = scratchCanvas.getContext('2d');
            scratchCtx.drawImage(heartImg, 0, 0);

            scratchInitialized = true;
        };
    }

    function scratch(x, y) {
        if (!scratchCtx) return;

        scratchCtx.globalCompositeOperation = 'destination-out';
        scratchCtx.lineCap = 'round';
        scratchCtx.lineJoin = 'round';
        scratchCtx.lineWidth = 50;

        if (lastScratchX !== null && lastScratchY !== null) {
            // Draw a line from last position to current for smooth path
            scratchCtx.beginPath();
            scratchCtx.moveTo(lastScratchX, lastScratchY);
            scratchCtx.lineTo(x, y);
            scratchCtx.stroke();
        } else {
            // First point - draw a circle
            scratchCtx.beginPath();
            scratchCtx.arc(x, y, 25, 0, Math.PI * 2);
            scratchCtx.fill();
        }

        lastScratchX = x;
        lastScratchY = y;
    }

    function getCanvasCoords(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        const scaleX = scratchCanvas.width / rect.width;
        const scaleY = scratchCanvas.height / rect.height;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        return { x, y };
    }

    // Mouse events
    scratchCanvas.addEventListener('mousedown', (e) => {
        isScratching = true;
        const coords = getCanvasCoords(e);
        scratch(coords.x, coords.y);
    });

    scratchCanvas.addEventListener('mousemove', (e) => {
        if (!isScratching) return;
        const coords = getCanvasCoords(e);
        scratch(coords.x, coords.y);
    });

    scratchCanvas.addEventListener('mouseup', () => { isScratching = false; lastScratchX = null; lastScratchY = null; });
    scratchCanvas.addEventListener('mouseleave', () => { isScratching = false; lastScratchX = null; lastScratchY = null; });

    // Touch events
    scratchCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isScratching = true;
        const coords = getCanvasCoords(e);
        scratch(coords.x, coords.y);
    });

    scratchCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isScratching) return;
        const coords = getCanvasCoords(e);
        scratch(coords.x, coords.y);
    });

    scratchCanvas.addEventListener('touchend', () => { isScratching = false; lastScratchX = null; lastScratchY = null; });

    // Open scratch modal
    scratchBtn.addEventListener('click', function() {
        scratchModal.classList.add('active');
        setTimeout(initScratchCard, 100);
    });

    // Close scratch modal
    scratchClose.addEventListener('click', function() {
        scratchModal.classList.remove('active');
    });

    // Close on outside click
    scratchModal.addEventListener('click', function(e) {
        if (e.target === scratchModal) {
            scratchModal.classList.remove('active');
        }
    });

});