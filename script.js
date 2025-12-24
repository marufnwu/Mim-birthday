/* ============================================
   THE AROBI MIM STORY - ULTRA PREMIUM
   User-Friendly Timing - Readable Speed
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============ ELEMENTS ============
    const startScreen = document.getElementById('startScreen');
    const startBtn = document.getElementById('startBtn');
    const experience = document.getElementById('experience'); // Main content container
    const pageLoader = document.getElementById('pageLoader');
    const startContent = document.getElementById('startContent');

    // ... (other element refs) ...
    const ambientCanvas = document.getElementById('ambientCanvas');
    const particleCanvas = document.getElementById('particleCanvas');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cursorGlow = document.getElementById('cursorGlow');
    const aCtx = ambientCanvas.getContext('2d');
    const pCtx = particleCanvas.getContext('2d');
    const cCtx = confettiCanvas.getContext('2d');

    // ============ PAGE LOAD HANDLING ============
    function onPageLoaded() {
        if (pageLoader) {
            // Fade out loader
            pageLoader.style.transition = 'opacity 0.5s ease';
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';

                // Show start content
                if (startContent) {
                    startContent.style.display = 'block';
                    // Trigger reflow
                    void startContent.offsetWidth;
                    startContent.classList.remove('hidden');
                }
            }, 500);
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(onPageLoaded, 1000); // Minimum 1s load time for effect
    } else {
        window.addEventListener('load', () => setTimeout(onPageLoaded, 1000));
    }

    // Sounds
    const sounds = {
        start: document.getElementById('startSound'),
        title: document.getElementById('titleSound'),
        slide: document.getElementById('slideSound'),
        envelope: document.getElementById('envelopeSound'),
        letter: document.getElementById('letterSound'),
        type: document.getElementById('typeSound'),
        blow: document.getElementById('blowSound'),
        chime: document.getElementById('chimeSound'),
        pop: document.getElementById('popSound'),
        wish: document.getElementById('wishSound'),
        heart: document.getElementById('heartSound'),
        countdown: document.getElementById('countdownSound'),
        birthday: document.getElementById('birthdaySound'),
        magic: document.getElementById('magicSound'),
        celebrate: document.getElementById('celebrateSound')
    };

    function playSound(soundName, volume = 0.3) {
        const audio = sounds[soundName];
        if (audio) {
            try {
                audio.volume = Math.min(volume, 1);
                audio.currentTime = 0;
                audio.play().catch(() => { });
            } catch (e) { }
        }
    }

    // ============ FIREBASE ANALYTICS HELPER ============
    function logAnalytics(eventName, params = {}) {
        // Add timestamp to all events
        params.timestamp = new Date().toISOString();

        if (window.logFirebaseEvent) {
            window.logFirebaseEvent(eventName, params);
        } else {
            // Retry after a short delay (Firebase might not be loaded yet)
            setTimeout(() => {
                if (window.logFirebaseEvent) {
                    window.logFirebaseEvent(eventName, params);
                }
            }, 1000);
        }
    }

    // ============ USER-FRIENDLY TIMING ============
    // CALCULATED: text_length × typing_speed + read_time
    const scenes = [
        { id: 'introScene', duration: 5000, sound: 'start' },           // 5 sec
        { id: 'countdownScene', duration: 5500, sound: 'countdown' },   // 5.5 sec
        { id: 'titleScene', duration: 6000, sound: 'title' },           // 6 sec
        { id: 'quoteScene', duration: 32000, sound: 'chime' },          // 300 chars × 80ms + 8s read = 32 sec
        { id: 'storyScene', duration: 18000, sound: 'pop' },            // 5 events × 2.5s + 5.5s = 18 sec
        { id: 'qualitiesScene', duration: 12000, sound: 'slide' },      // 6 cards × 500ms + 9s stay = 12 sec
        { id: 'jokesScene', duration: 18000, sound: 'pop' },            // Inside jokes carousel
        { id: 'galleryScene', duration: 20000, sound: 'slide' },        // 5 photos × 3.5s + 2.5s = 20 sec
        { id: 'reasonsScene', duration: 28000, sound: 'chime' },        // 3 reasons × 5s gap + typing = 28 sec
        { id: 'letterScene', duration: 38000, sound: 'envelope' },      // envelope 2.5s + 3 paras typing = 38 sec
        { id: 'birthdayScene', duration: 25000, sound: 'birthday' },    // Birthday fanfare!
        { id: 'wishScene', duration: 16000, sound: 'magic' },           // Magical moment
        { id: 'wishesScene', duration: 16000, sound: 'heart' },         // 4 wishes × 3s + 4s = 16 sec
        { id: 'finaleScene', duration: 60000, sound: 'celebrate' }      // Celebration!
    ];

    let currentSceneIndex = -1;
    let galleryInterval = null;
    let wishesInterval = null;
    let jokesInterval = null;

    // ============ CANVAS SETUP ============
    const shootingStarCanvas = document.getElementById('shootingStarCanvas');
    const ssCtx = shootingStarCanvas.getContext('2d');

    function resizeCanvases() {
        [ambientCanvas, particleCanvas, confettiCanvas, shootingStarCanvas].forEach(canvas => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    // ============ CURSOR GLOW ============
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // ============ AMBIENT BACKGROUND ============
    let ambientTime = 0;
    const ambientColors = [
        { x: 0.3, y: 0.3, r: 0.4, color: [212, 168, 83], alpha: 0.06 },
        { x: 0.7, y: 0.7, r: 0.35, color: [139, 77, 92], alpha: 0.04 },
        { x: 0.5, y: 0.5, r: 0.5, color: [201, 165, 165], alpha: 0.03 }
    ];

    function drawAmbient() {
        aCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
        ambientTime += 0.003;

        ambientColors.forEach((c, i) => {
            const x = (c.x + Math.sin(ambientTime + i) * 0.08) * ambientCanvas.width;
            const y = (c.y + Math.cos(ambientTime * 0.7 + i) * 0.08) * ambientCanvas.height;
            const r = c.r * Math.min(ambientCanvas.width, ambientCanvas.height);

            const grad = aCtx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, `rgba(${c.color.join(',')}, ${c.alpha})`);
            grad.addColorStop(1, 'transparent');
            aCtx.fillStyle = grad;
            aCtx.fillRect(0, 0, ambientCanvas.width, ambientCanvas.height);
        });

        requestAnimationFrame(drawAmbient);
    }
    drawAmbient();

    // ============ FLOATING PARTICLES ============
    const particles = [];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.4 + 0.1;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha += this.fadeDir * 0.003;
            if (this.alpha > 0.5 || this.alpha < 0.1) this.fadeDir *= -1;
            if (this.x < 0) this.x = particleCanvas.width;
            if (this.x > particleCanvas.width) this.x = 0;
            if (this.y < 0) this.y = particleCanvas.height;
            if (this.y > particleCanvas.height) this.y = 0;
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(212, 168, 83, ${this.alpha})`;
            pCtx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ============ CONFETTI SYSTEM ============
    const confetti = [];
    const confettiColors = ['#d4a853', '#e8c87a', '#c9a5a5', '#fff', '#ff9fb5', '#ffb7c5'];

    class Confetti {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 4;
            this.vy = Math.random() * 3 + 2;
            this.vx = (Math.random() - 0.5) * 3;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 8;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        }
        update() {
            this.y += this.vy;
            this.x += this.vx;
            this.rotation += this.rotationSpeed;
            this.vx *= 0.99;
        }
        draw() {
            cCtx.save();
            cCtx.translate(this.x, this.y);
            cCtx.rotate(this.rotation * Math.PI / 180);
            cCtx.fillStyle = this.color;
            cCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            cCtx.restore();
        }
    }

    let confettiActive = false;

    function launchConfetti() {
        if (confettiActive) return;
        confettiActive = true;
        playSound('pop', 0.25);
        const interval = setInterval(() => {
            for (let i = 0; i < 8; i++) confetti.push(new Confetti());
        }, 40);
        setTimeout(() => { clearInterval(interval); confettiActive = false; }, 4000);
    }

    function animateConfetti() {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let i = confetti.length - 1; i >= 0; i--) {
            confetti[i].update();
            confetti[i].draw();
            if (confetti[i].y > confettiCanvas.height) confetti.splice(i, 1);
        }
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();

    // ============ SHOOTING STARS SYSTEM ============
    const shootingStars = [];

    class ShootingStar {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * shootingStarCanvas.width;
            this.y = Math.random() * shootingStarCanvas.height * 0.5;
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 8 + 4;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
            this.opacity = 1;
            this.trail = [];
            this.active = false;
        }
        activate() {
            this.active = true;
            this.opacity = 1;
        }
        update() {
            if (!this.active) return;

            this.trail.unshift({ x: this.x, y: this.y, opacity: this.opacity });
            if (this.trail.length > 15) this.trail.pop();

            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.015;

            if (this.opacity <= 0 || this.x > shootingStarCanvas.width || this.y > shootingStarCanvas.height) {
                this.reset();
            }
        }
        draw() {
            if (!this.active || this.opacity <= 0) return;

            // Draw trail
            this.trail.forEach((point, i) => {
                const trailOpacity = point.opacity * (1 - i / this.trail.length) * 0.6;
                const trailSize = 2 * (1 - i / this.trail.length);
                ssCtx.beginPath();
                ssCtx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                ssCtx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
                ssCtx.fill();
            });

            // Draw star head with glow
            const gradient = ssCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 8);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(212, 168, 83, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, 'transparent');
            ssCtx.beginPath();
            ssCtx.arc(this.x, this.y, 8, 0, Math.PI * 2);
            ssCtx.fillStyle = gradient;
            ssCtx.fill();
        }
    }

    // Create pool of shooting stars
    for (let i = 0; i < 5; i++) {
        shootingStars.push(new ShootingStar());
    }

    // Randomly activate shooting stars
    setInterval(() => {
        const inactiveStar = shootingStars.find(s => !s.active);
        if (inactiveStar && Math.random() > 0.5) {
            inactiveStar.reset();
            inactiveStar.activate();
        }
    }, 2000);

    function animateShootingStars() {
        ssCtx.clearRect(0, 0, shootingStarCanvas.width, shootingStarCanvas.height);
        shootingStars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animateShootingStars);
    }
    animateShootingStars();

    // ============ BACKGROUND MUSIC ============
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let musicPlaying = false;

    function startBackgroundMusic() {
        if (bgMusic && !musicPlaying) {
            bgMusic.volume = 0.15;
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.classList.remove('muted');
            }).catch(() => {
                musicToggle.classList.add('muted');
            });
        }
    }

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            musicToggle.classList.add('muted');
            logAnalytics('music_toggle', { action: 'mute' });
        } else {
            bgMusic.volume = 0.15;
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.classList.remove('muted');
                logAnalytics('music_toggle', { action: 'unmute' });
            }).catch(() => { });
        }
    });

    // ============ TYPEWRITER - SYNCED SOUND ============
    let typeAudioInterval = null;

    function typeWriter(element, text, speed = 70, callback) {
        let i = 0;
        element.textContent = '';

        // Clear any existing interval
        if (typeAudioInterval) clearInterval(typeAudioInterval);

        // Sync sound with actual typing speed (play every 3rd character to reduce noise)
        let soundCounter = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                soundCounter++;

                // Play soft click every 3rd character (less annoying)
                if (soundCounter % 3 === 0) {
                    playSound('type', 0.02);
                }

                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        }
        type();
    }

    // ============ COUNTDOWN ============
    function initCountdown() {
        const numEl = document.getElementById('countdownNum');
        const nums = ['3', '2', '1', '🎉'];
        let idx = 0;

        const interval = setInterval(() => {
            idx++;
            if (idx < nums.length) {
                numEl.textContent = nums[idx];
                numEl.style.animation = 'none';
                numEl.offsetHeight;
                numEl.style.animation = 'countdownPulse 0.5s ease-out';
                if (idx < 3) playSound('countdown', 0.2);
            }
            if (idx >= nums.length - 1) {
                clearInterval(interval);
                playSound('chime', 0.3);
            }
        }, 1200);  // Slower countdown
    }

    // ============ QUALITIES ANIMATION ============
    function initQualities() {
        const cards = document.querySelectorAll('.quality-card');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('show');
                playSound('pop', 0.08);
            }, i * 500);  // 500ms between each card
        });
    }

    // ============ VISUAL STORY ANIMATION (SLIDESHOW) ============
    function initStory() {
        const chapters = document.querySelectorAll('.story-chapter');
        let currentChapter = 0;

        function showChapter(index) {
            // Hide previous chapter
            if (index > 0) {
                chapters[index - 1].classList.remove('show');
                chapters[index - 1].classList.add('hide');
            }

            // Show current chapter
            chapters[index].classList.remove('hide');
            chapters[index].classList.add('show');
            playSound('pop', 0.05);

            // Chapter-specific animations
            const chapter = chapters[index];
            const chapterNum = chapter.dataset.chapter;

            // Chapter 1: Facebook button animation
            if (chapterNum === '1') {
                const fbBtn = chapter.querySelector('.fb-button');
                if (fbBtn) {
                    setTimeout(() => fbBtn.classList.add('sending'), 500);
                    setTimeout(() => fbBtn.classList.add('pending'), 1500);
                }
            }

            // Chapter 2: Instagram follow animation
            if (chapterNum === '2') {
                const igBtn = chapter.querySelector('.ig-button');
                if (igBtn) {
                    setTimeout(() => igBtn.classList.add('followed'), 800);
                }
            }

            // Chapter 3: Story rings watching animation
            if (chapterNum === '3') {
                const rings = chapter.querySelectorAll('.story-ring');
                rings.forEach((ring, ri) => {
                    setTimeout(() => ring.classList.add('watched'), ri * 500);
                });
            }

            // Chapter 4: Cancel/Send loop animation
            if (chapterNum === '4') {
                const cancelBtn = chapter.querySelector('.cancel-btn');
                const sendBtn = chapter.querySelector('.send-btn');
                let loopCount = 0;
                const loopInterval = setInterval(() => {
                    if (loopCount % 2 === 0) {
                        cancelBtn.classList.add('active');
                        sendBtn.classList.remove('active');
                    } else {
                        cancelBtn.classList.remove('active');
                        sendBtn.classList.add('active');
                    }
                    loopCount++;
                    if (loopCount > 6) clearInterval(loopInterval);
                }, 400);
            }

            // Chapter 5: Victory sound
            if (chapterNum === '5') {
                setTimeout(() => playSound('chime', 0.15), 500);
            }
        }

        // Show chapters one by one
        chapters.forEach((_, i) => {
            setTimeout(() => showChapter(i), i * 3500);  // 3.5 seconds per chapter
        });
    }

    // ============ REASONS WITH TYPEWRITER ============
    function initReasons() {
        const reasons = [
            "Remember that time you made everyone laugh so hard they cried? Yeah, that's your superpower.",
            "You're the friend who remembers the little things, the one who shows up when it matters, the one who cares when nobody's watching.",
            "The world would be so boring without your energy, your ideas, and honestly... your chaos. Never change."
        ];

        const items = document.querySelectorAll('.reason-item');

        items.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('show');
                const textEl = item.querySelector('.reason-text');
                typeWriter(textEl, reasons[i], 55);  // Readable speed
            }, i * 5000);  // 5 seconds between each reason
        });
    }

    // ============ 3D GALLERY ============
    function initGallery() {
        const cards = document.querySelectorAll('.photo-card');
        const dots = document.querySelectorAll('.nav-dot');
        let current = 0;

        function showCard(index) {
            cards.forEach((card, i) => {
                card.classList.remove('active', 'prev', 'next', 'hidden');
                dots[i].classList.remove('active');

                if (i === index) {
                    card.classList.add('active');
                    dots[i].classList.add('active');
                } else if (i === (index - 1 + cards.length) % cards.length) {
                    card.classList.add('prev');
                } else if (i === (index + 1) % cards.length) {
                    card.classList.add('next');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        showCard(0);
        logAnalytics('gallery_view', { photo_index: 0, total_photos: cards.length });

        galleryInterval = setInterval(() => {
            current = (current + 1) % cards.length;
            showCard(current);
            playSound('slide', 0.12);
            logAnalytics('gallery_view', { photo_index: current, total_photos: cards.length });
        }, 3500);  // 3.5 seconds per photo
    }

    // ============ ENVELOPE ANIMATION ============
    function openEnvelope() {
        const envelope = document.getElementById('envelope');
        const letter = document.getElementById('letter');

        setTimeout(() => {
            envelope.classList.add('opening');
            playSound('envelope', 0.3);
        }, 1000);

        setTimeout(() => {
            envelope.classList.add('open');
            letter.classList.add('show');
            playSound('letter', 0.25);

            const body1 = document.getElementById('letterBody1');
            const body2 = document.getElementById('letterBody2');
            const body3 = document.getElementById('letterBody3');

            // Slow typing for letter - 65ms per char
            setTimeout(() => {
                typeWriter(body1, "I know I'm not always good with words, but I wanted to try anyway because you deserve it.", 65, () => {
                    setTimeout(() => {
                        typeWriter(body2, "You're not just another year older — you're another year wiser, stronger, and honestly, even more iconic than before.", 65, () => {
                            setTimeout(() => {
                                typeWriter(body3, "So here's to you — to your dreams, your crazy ideas, your midnight thoughts, and everything that makes you, YOU. Happy Birthday, Mim.", 65);
                            }, 800);  // Pause between paragraphs
                        });
                    }, 800);
                });
            }, 1000);
        }, 2500);
    }

    // ============ BLOW CANDLES - ENHANCED ============
    function initBirthday() {
        const blowBtn = document.getElementById('blowBtn');
        const candles = document.querySelectorAll('.candle');

        blowBtn.addEventListener('click', () => {
            // Log candle blow interaction
            logAnalytics('candles_blown', {
                action: 'blow_candles'
            });

            playSound('blow', 0.4);

            // Blow out candles with staggered effect
            candles.forEach((candle, i) => {
                const flame = candle.querySelector('.flame');
                const smoke = candle.querySelector('.smoke');

                setTimeout(() => {
                    flame.classList.add('out');
                    if (smoke) smoke.classList.add('active');
                    playSound('pop', 0.1);
                }, i * 400);  // Slower, more dramatic
            });

            blowBtn.classList.add('hidden');

            // Celebration sequence after all candles out
            setTimeout(() => {
                playSound('celebrate', 0.4);
                launchConfetti();

                // Second confetti burst
                setTimeout(() => {
                    launchConfetti();
                }, 800);
            }, 1500);

            // Add sparkle effect on balloons
            document.querySelectorAll('.balloon').forEach((balloon, i) => {
                setTimeout(() => {
                    balloon.style.animation = 'balloonFloat 2s ease-in-out infinite, partyPop 0.5s ease-out forwards';
                }, i * 200);
            });

            setTimeout(nextScene, 4000);
        });
    }

    // ============ WISH SCENE - ENHANCED ============
    function initWish() {
        const wishMessage = document.getElementById('wishMessage');
        const wishBgStars = document.getElementById('wishBgStars');
        const wishFloatingHearts = document.getElementById('wishFloatingHearts');

        // Create floating stars in background
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('span');
            star.textContent = ['⭐', '✨', '🌟', '✦', '✧'][Math.floor(Math.random() * 5)];
            star.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 15 + 8}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: sparkleFloat ${4 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 3}s;
                opacity: ${Math.random() * 0.4 + 0.2};
            `;
            wishBgStars.appendChild(star);
        }

        // Create floating hearts
        const hearts = ['💕', '💗', '💖', '💝', '💓', '❤️'];
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('span');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 12}px;
                left: ${Math.random() * 100}%;
                bottom: -50px;
                animation: heartRise ${6 + Math.random() * 4}s ease-out infinite;
                animation-delay: ${Math.random() * 5}s;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            wishFloatingHearts.appendChild(heart);
        }

        // Typewriter with magical sound
        setTimeout(() => {
            playSound('wish', 0.2);
            typeWriter(wishMessage, "Close your eyes. Think of something you really, really want. Now hold that thought... and believe it's already on its way to you. ✨", 80);
        }, 1500);

        // Sparkles around content
        const sparkles = document.getElementById('wishSparkles');
        for (let i = 0; i < 25; i++) {
            const sparkle = document.createElement('span');
            sparkle.textContent = ['✨', '⭐', '🌟', '✦'][Math.floor(Math.random() * 4)];
            sparkle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 10}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: sparkleFloat ${3 + Math.random() * 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            sparkles.appendChild(sparkle);
        }
    }

    // Sparkle and heart animations
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.2); }
        }
        @keyframes heartRise {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.4; }
            100% { transform: translateY(-100vh) scale(0.5) rotate(20deg); opacity: 0; }
        }
    `;
    document.head.appendChild(sparkleStyle);

    // ============ BIRTHDAY WISHES CAROUSEL ============
    function initWishesCarousel() {
        const cards = document.querySelectorAll('.wish-card');
        let current = 0;

        function showWish(index) {
            cards.forEach((card, i) => {
                card.classList.remove('active', 'prev');
                if (i === index) card.classList.add('active');
                else if (i === (index - 1 + cards.length) % cards.length) card.classList.add('prev');
            });
        }

        showWish(0);
        wishesInterval = setInterval(() => {
            current = (current + 1) % cards.length;
            showWish(current);
            playSound('chime', 0.1);
        }, 3000);  // 3 seconds per wish
    }

    // ============ HEART RAIN ============
    function initHeartRain() {
        // Log experience completion
        logAnalytics('experience_complete', {
            completed: true,
            total_scenes: scenes.length
        });

        const heartRain = document.getElementById('heartRain');
        const hearts = ['💕', '💗', '💖', '💝', '❤️'];

        setInterval(() => {
            const heart = document.createElement('span');
            heart.className = 'rain-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (2 + Math.random() * 2) + 's';
            heartRain.appendChild(heart);
            setTimeout(() => heart.remove(), 4000);
        }, 300);
    }

    // ============ QUOTE - VERY SLOW WITH 5 SEC PAUSE ============
    function initQuote() {
        const quoteText = document.getElementById('quoteText');
        // 80ms per character = very slow and readable
        typeWriter(quoteText, "Today isn't just another day on the calendar. It's the day the universe decided to gift us with someone who makes everything a little more fun, a little more chaotic, and a whole lot more memorable. Whether you're being Nargis, Nargis Kim, or Bandhobi Lolita — you're always unforgettable.", 80);
    }

    // ============ FUN STATS WITH ANIMATED COUNTERS ============
    function initStats() {
        const cards = document.querySelectorAll('.stat-card');

        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('show');
                playSound('pop', 0.08);

                // Animate the counter
                const numberEl = card.querySelector('.stat-number');
                const target = parseInt(card.dataset.target);
                const suffix = card.dataset.suffix || '';
                const duration = 2000;
                const start = performance.now();

                function animateNumber(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function for smooth animation
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(target * easeOut);

                    numberEl.textContent = current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(animateNumber);
                    }
                }

                requestAnimationFrame(animateNumber);
            }, i * 300);
        });
    }

    // ============ INSIDE JOKES CAROUSEL ============
    function initJokes() {
        const cards = document.querySelectorAll('.joke-card');
        const dots = document.querySelectorAll('.joke-dot');
        let current = 0;

        function showJoke(index) {
            cards.forEach((card, i) => {
                card.classList.remove('active', 'prev', 'next');
                dots[i]?.classList.remove('active');

                if (i === index) {
                    card.classList.add('active');
                    dots[i]?.classList.add('active');
                } else if (i === (index - 1 + cards.length) % cards.length) {
                    card.classList.add('prev');
                } else if (i === (index + 1) % cards.length) {
                    card.classList.add('next');
                }
            });
        }

        showJoke(0);

        jokesInterval = setInterval(() => {
            current = (current + 1) % cards.length;
            showJoke(current);
            playSound('pop', 0.08);
        }, 3000);

        // Allow manual navigation
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                current = i;
                showJoke(current);
                playSound('pop', 0.1);
            });
        });
    }

    // ============ SCENE MANAGEMENT ============
    function showScene(index) {
        if (galleryInterval) { clearInterval(galleryInterval); galleryInterval = null; }
        if (wishesInterval) { clearInterval(wishesInterval); wishesInterval = null; }
        if (jokesInterval) { clearInterval(jokesInterval); jokesInterval = null; }

        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));

        const scene = scenes[index];
        const sceneEl = document.getElementById(scene.id);

        if (sceneEl) {
            // Log scene view to Firebase Analytics
            logAnalytics('scene_view', {
                scene_name: scene.id,
                scene_index: index,
                scene_total: scenes.length
            });

            setTimeout(() => {
                sceneEl.classList.add('active');
                if (scene.sound) playSound(scene.sound, 0.25);

                switch (scene.id) {
                    case 'countdownScene': initCountdown(); break;
                    case 'quoteScene': initQuote(); break;
                    case 'storyScene': initStory(); break;
                    case 'qualitiesScene': initQualities(); break;
                    case 'statsScene': initStats(); break;
                    case 'jokesScene': initJokes(); break;
                    case 'galleryScene': setTimeout(initGallery, 500); break;
                    case 'reasonsScene': initReasons(); break;
                    case 'letterScene': openEnvelope(); break;
                    case 'birthdayScene': initBirthday(); break;
                    case 'wishScene': initWish(); launchConfetti(); break;
                    case 'wishesScene': initWishesCarousel(); break;
                    case 'finaleScene': initHeartRain(); launchConfetti(); break;
                }
            }, 300);
        }
    }

    function nextScene() {
        currentSceneIndex++;
        if (currentSceneIndex < scenes.length) {
            showScene(currentSceneIndex);

            if (scenes[currentSceneIndex].id !== 'birthdayScene' && scenes[currentSceneIndex].id !== 'finaleScene') {
                setTimeout(nextScene, scenes[currentSceneIndex].duration);
            }
        }
    }

    // ============ START ============
    startBtn.addEventListener('click', () => {
        // Log experience start
        logAnalytics('experience_start', {
            user_agent: navigator.userAgent,
            screen_width: window.innerWidth,
            screen_height: window.innerHeight
        });

        // Unlock all audio for mobile (browser policy requirement)
        Object.values(sounds).forEach(audio => {
            if (audio) {
                audio.muted = true;
                audio.play().catch(() => { });
                audio.pause();
                audio.muted = false;
            }
        });

        playSound('start', 0.3);
        startBackgroundMusic(); // Start the ambient music
        startScreen.classList.add('hidden');
        setTimeout(() => {
            experience.classList.add('active');
            nextScene();
        }, 1500);
    });

    // ============ REPLAY ============
    document.getElementById('replayBtn')?.addEventListener('click', () => {
        // Log replay event
        logAnalytics('experience_replay', {
            completed: true
        });

        playSound('slide', 0.2);
        currentSceneIndex = -1;
        confetti.length = 0;
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));

        document.querySelectorAll('.flame').forEach(f => f.classList.remove('out'));
        document.querySelectorAll('.smoke').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.quality-card').forEach(c => c.classList.remove('show'));
        document.querySelectorAll('.reason-item').forEach(r => r.classList.remove('show'));
        document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('show'));
        document.querySelectorAll('.joke-card').forEach(c => c.classList.remove('active', 'prev', 'next'));
        document.getElementById('blowBtn')?.classList.remove('hidden');
        document.getElementById('envelope')?.classList.remove('opening', 'open');
        document.getElementById('letter')?.classList.remove('show');

        nextScene();
    });

    console.log('✨ The Arobi Mim Story - Readable Edition Ready');
});
