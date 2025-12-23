/* ============================================
   THE AROBI MIM STORY - ULTRA PREMIUM
   User-Friendly Timing - Readable Speed
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============ ELEMENTS ============
    const startScreen = document.getElementById('startScreen');
    const startBtn = document.getElementById('startBtn');
    const experience = document.getElementById('experience');
    const ambientCanvas = document.getElementById('ambientCanvas');
    const particleCanvas = document.getElementById('particleCanvas');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cursorGlow = document.getElementById('cursorGlow');
    const aCtx = ambientCanvas.getContext('2d');
    const pCtx = particleCanvas.getContext('2d');
    const cCtx = confettiCanvas.getContext('2d');

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
        countdown: document.getElementById('countdownSound')
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

    // ============ USER-FRIENDLY TIMING ============
    // CALCULATED: text_length × typing_speed + read_time
    const scenes = [
        { id: 'introScene', duration: 5000, sound: 'start' },           // 5 sec
        { id: 'countdownScene', duration: 5500, sound: 'countdown' },   // 5.5 sec
        { id: 'titleScene', duration: 6000, sound: 'title' },           // 6 sec
        { id: 'quoteScene', duration: 32000, sound: null },             // 300 chars × 80ms + 8s read = 32 sec
        { id: 'storyScene', duration: 18000, sound: 'chime' },          // 5 events × 2.5s + 5.5s = 18 sec
        { id: 'qualitiesScene', duration: 12000, sound: 'chime' },      // 6 cards × 500ms + 9s stay = 12 sec
        { id: 'galleryScene', duration: 20000, sound: 'slide' },        // 5 photos × 3.5s + 2.5s = 20 sec
        { id: 'reasonsScene', duration: 28000, sound: null },           // 3 reasons × 5s gap + typing = 28 sec
        { id: 'letterScene', duration: 38000, sound: 'envelope' },      // envelope 2.5s + 3 paras typing = 38 sec
        { id: 'birthdayScene', duration: 25000, sound: 'chime' },       // user interaction
        { id: 'wishScene', duration: 16000, sound: 'wish' },            // 130 chars × 80ms + 5s = 16 sec
        { id: 'wishesScene', duration: 16000, sound: 'heart' },         // 4 wishes × 3s + 4s = 16 sec
        { id: 'finaleScene', duration: 60000, sound: 'heart' }          // stay forever
    ];

    let currentSceneIndex = -1;
    let galleryInterval = null;
    let wishesInterval = null;

    // ============ CANVAS SETUP ============
    function resizeCanvases() {
        [ambientCanvas, particleCanvas, confettiCanvas].forEach(canvas => {
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

    // ============ VISUAL STORY ANIMATION ============
    function initStory() {
        const chapters = document.querySelectorAll('.story-chapter');
        const storyScene = document.getElementById('storyScene');

        chapters.forEach((chapter, i) => {
            setTimeout(() => {
                chapter.classList.add('show');
                playSound('pop', 0.05);

                // Auto-scroll to keep chapter visible
                if (storyScene) {
                    const chapterTop = chapter.offsetTop - 80;
                    storyScene.scrollTo({ top: chapterTop, behavior: 'smooth' });
                }

                // Chapter-specific animations
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
                        setTimeout(() => {
                            ring.classList.add('watched');
                        }, ri * 600);
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
                    }, 500);
                }

                // Chapter 5: Victory sound
                if (chapterNum === '5') {
                    setTimeout(() => playSound('chime', 0.15), 500);
                }

            }, i * 3000);  // 3 seconds between each chapter
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
        galleryInterval = setInterval(() => {
            current = (current + 1) % cards.length;
            showCard(current);
            playSound('slide', 0.12);
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

    // ============ BLOW CANDLES ============
    function initBirthday() {
        const blowBtn = document.getElementById('blowBtn');
        const candles = document.querySelectorAll('.candle');

        blowBtn.addEventListener('click', () => {
            playSound('blow', 0.4);

            candles.forEach((candle, i) => {
                const flame = candle.querySelector('.flame');
                const smoke = candle.querySelector('.smoke');

                setTimeout(() => {
                    flame.classList.add('out');
                    if (smoke) smoke.classList.add('active');
                }, i * 300);  // Slower blow out
            });

            blowBtn.classList.add('hidden');

            setTimeout(() => {
                playSound('chime', 0.35);
                launchConfetti();
            }, 1200);

            setTimeout(nextScene, 3500);
        });
    }

    // ============ WISH SCENE ============
    function initWish() {
        const wishMessage = document.getElementById('wishMessage');

        setTimeout(() => {
            typeWriter(wishMessage, "Close your eyes. Think of something you really, really want. Now hold that thought... and believe it's already on its way to you. ✨", 80);  // Very slow
        }, 1500);

        const sparkles = document.getElementById('wishSparkles');
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('span');
            sparkle.textContent = '✨';
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

    // Sparkle animation
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.2); }
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

    // ============ SCENE MANAGEMENT ============
    function showScene(index) {
        if (galleryInterval) { clearInterval(galleryInterval); galleryInterval = null; }
        if (wishesInterval) { clearInterval(wishesInterval); wishesInterval = null; }

        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));

        const scene = scenes[index];
        const sceneEl = document.getElementById(scene.id);

        if (sceneEl) {
            setTimeout(() => {
                sceneEl.classList.add('active');
                if (scene.sound) playSound(scene.sound, 0.25);

                switch (scene.id) {
                    case 'countdownScene': initCountdown(); break;
                    case 'quoteScene': initQuote(); break;
                    case 'storyScene': initStory(); break;
                    case 'qualitiesScene': initQualities(); break;
                    case 'galleryScene': setTimeout(initGallery, 500); break;
                    case 'reasonsScene': initReasons(); break;
                    case 'letterScene': openEnvelope(); break;
                    case 'birthdayScene': initBirthday(); break;
                    case 'wishScene': initWish(); launchConfetti(); break;
                    case 'wishesScene': initWishesCarousel(); break;
                    case 'finaleScene': initHeartRain(); break;
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
        playSound('start', 0.3);
        startScreen.classList.add('hidden');
        setTimeout(() => {
            experience.classList.add('active');
            nextScene();
        }, 1500);
    });

    // ============ REPLAY ============
    document.getElementById('replayBtn')?.addEventListener('click', () => {
        playSound('slide', 0.2);
        currentSceneIndex = -1;
        confetti.length = 0;
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));

        document.querySelectorAll('.flame').forEach(f => f.classList.remove('out'));
        document.querySelectorAll('.smoke').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.quality-card').forEach(c => c.classList.remove('show'));
        document.querySelectorAll('.reason-item').forEach(r => r.classList.remove('show'));
        document.getElementById('blowBtn')?.classList.remove('hidden');
        document.getElementById('envelope')?.classList.remove('opening', 'open');
        document.getElementById('letter')?.classList.remove('show');

        nextScene();
    });

    console.log('✨ The Arobi Mim Story - Readable Edition Ready');
});
