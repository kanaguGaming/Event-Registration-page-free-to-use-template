// Register GSAP Flip plugin
gsap.registerPlugin(Flip);

// Event Data - Mapped to GoT themes as requested
const eventsData = [
    {
        id: "paper_presentation",
        title: "Paper Presentation",
        theme: "The Highgarden Summit",
        tier: "Tier 1",
        tagline: "A classic presentation of knowledge. Updates tracked by the Maesters.",
        desc: "Present your research papers to the esteemed Archmaesters. Originality and depth of knowledge will decide your fate in the Citadel.",
        rules: [
            "Team must contain minimum 1 member to maximum 4 team members.",
            "10 minutes for presentation, 5 minutes for Q&A.",
            "Plagiarism leads to immediate disqualification.",
            "Each team member must contribute the presentation.",
            "Juries decision will be final.",
            "Report 10-15 minute befor alloted time."
        ],
        teamSize: "Up to 4 members",
        prizes: "1st: ₹1000",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/Tyrell – Paper Presentation.png"
    },
    {
        id: "shark_tank",
        title: "Shark Tank",
        theme: "The Casterly Rock Pitch",
        tier: "Tier 1",
        tagline: "Project expo with custom gold/silver coin investments via QR.",
        desc: "Pitch your tech project to the masters of the Iron Bank. Secure investments from attendees using custom QR coins and win the Iron Throne of innovation.",
        rules: [
            "Team must contain minimum 1 member to maximum 4 team members.",
            "The project must be original and developed by the team.",
            "Each team must have a functional demonstration or working prototype of their project.",
            "Pitch must be under 5 minutes.",
            "Projects acn be based on Software, hardware, AI/ML, IoT, Applications,  Robotics ect.,",
            "Q&A session of 3 minutes follows each pitch.",
            "Juries decision will be final.",
            "Report 10-15 minute befor alloted time."
        ],
        teamSize: "Up to 4 members",
        prizes: "1st: ₹1000",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/Lanyster - Shark tank.png"
    },
    {
        id: "ctf",
        title: "CTF (Capture the Flag)",
        theme: "Paying the Iron Price",
        tier: "Tier 2",
        tagline: "Cybersecurity CTF. Find the hidden flags in images and files.",
        desc: "Infiltrate the systems and uncover the hidden secrets. Become no one and bypass the security to claim your flags.",
        rules: [
            "Attack only the challenge-provided URLs, files, IPs, and information; never target the CTF platform, scoreboard, hosting servers, or event website, and report any platform vulnerability to the organizers.",
            "Maximum 2 members per team; collaborate only within your registered team, do not share flags/hints/solutions outside it, and use only one account per participant—violations or scoreboard manipulation may lead to disqualification.",
            "Do not disrupt the challenge environment or network; respect participants and organizers, with harassment, toxicity, abuse, teasing, or provoking prohibited.",
            "AI tools or automated assistants must not be used to directly solve challenges or generate solutions; investigative challenges must use non-AI browsers/search engines, while permitted online investigative tools, decoders, and articles may be used.",
            "Organizers may modify rules, adjust challenge points, or disqualify teams for cheating, malicious activity, or rule violations. All decisions made by the CTF organizers are final."
        ],
        teamSize: "Solo or 2 members",
        prizes: "1st: ₹1000",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/GreyJoy - CTF.png"
    },
    {
        id: "debug_relay",
        title: "Debug Relay",
        theme: "The Storm's End Relay",
        tier: "Tier 2",
        tagline: "15 pairs. Take turns debugging code. 'I drink and I know things.'",
        desc: "A tag-team coding challenge. One member debugs while the other waits, then swap. Communication and quick thinking are your only allies.",
        rules: [
            "Exactly 2 members per team.",
            "Only one member codes at a time.",
            "Python, java, C programing languages.",
            "Using mobiles, AI tools, External answers may lead to disqualification.",
            "Swap every 2 minutes — no exceptions.",
            "No external references or internet allowed.",
            "Organizers may modify rules, adjust challenge points, or disqualify teams for cheating, malicious activity, or rule violations. All decisions made by the CTF organizers are final."
        ],
        teamSize: "Exactly 2 members",
        prizes: "1st: ₹500",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/barotheon - Debug Relay.png"
    },
    {
        id: "ui_design",
        title: "UI Design",
        theme: "The Mad King's Canvas",
        tier: "Tier 2",
        tagline: "Design a wild, creative, and completely frustrating UI. Chaos is a ladder.",
        desc: "Create the most diabolical, worst possible user experience. The more frustrated the tester, the higher your score. Embrace chaos.",
        rules: [
            "Open to individuals and teams of up to 2 members",
            "Participants may study the provided reference video, but the on-spot task will differ; all designs must be original with no copying or plagiarism.",
            "personal laptops are encouraged, while college systems may be used subject to availability and browser-only development.",
            "Each round may have specific restrictions announced by organizers; participants must complete and submit their work within the given time and stop when time expires.",
            "AI, external tools, pre-prepared projects/code, unauthorized resources, sharing of designs/code/solutions, or accessing another participant’s system/files/account without permission are prohibited as per round-specific restrictions.",
            "Submit through the specified method before the deadline; rule violations or failure to follow coordinator instructions may lead to disqualification, and organizers/judges may modify or enforce rules with their decision being final."
        ],
        teamSize: "Individual",
        prizes: "1st: ₹500",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/Targaryen - UI Design.png"
    },
    {
        id: "tech_quiz",
        title: "Tech Quiz",
        theme: "Trial by the Eyrie",
        tier: "Tier 2",
        tagline: "Kahoot-based technical quiz. Only the most informed survive.",
        desc: "Test your knowledge on the latest tech gossip and hard facts. The little birds have gathered questions from all realms of technology.",
        rules: [
            "Individual participation only.",
            "Laptop is mandatory for the event.",
            "Fastest correct answer gets more points.",
            "No smartphones or secondary devices allowed."
        ],
        teamSize: "Individual",
        prizes: "1st: ₹1000",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/Arryn – Tech Quiz.png"
    },
    {
        id: "ai_prompt_battle",
        title: "AI Prompt Battle",
        theme: "The Viper's Strike",
        tier: "Tier 3",
        tagline: "Look at an image once, then write the prompt to recreate it.",
        desc: "Harness the power of sight. View an AI-generated image for 10 seconds, then craft the exact prompt to recreate it. Precision is power.",
        rules: [
            "A reference image will be given at the start of each round.",
            "Participants must recreate the image using text prompts only.",
            "Image uploads or image-to-image tools are strictly not allowed.",
            "Participants must bring their own laptop.",
            "Any AI tools can be used for image generation.",
            "participants must submit the chat link used to generate the image at the end of each round."
        ],
        teamSize: "Individual",
        prizes: "1st: ₹500",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/Martell - AI promt battle.png"
    },
    {
        id: "techdumb_pictionary",
        title: "TechDumb Pictionary",
        theme: "The Riverrun Riddles",
        tier: "Tier 3",
        tagline: "Rapid-fire picture connection to guess technical words.",
        desc: "You know nothing! Guess the technical term by connecting completely unrelated, dumb pictures drawn by your teammate.",
        rules: [
            "Teams of 2 members.",
            "Images will be displayed on the screen.",
            "Both team members can discuss and identify the technical word.",
            "No external help or electronic devices are allowed.",
            "Answers must be given within the given time limit. "
        ],
        teamSize: "Exactly 2 members",
        prizes: "1st: ₹500",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/Tully – TechDumb Pictionary.png"
    },
    {
        id: "down_side_up",
        title: "Down Side UP",
        theme: "Beyond the Wall Logic",
        tier: "Tier 3",
        tagline: "Technical questions, but you must provide the WRONG answers only.",
        desc: "Deceive and confuse. Answer technical questions with completely wrong but convincing answers. The more absurd yet believable, the better.",
        rules: [
            "Correct answer = disqualification, convincing false answer = points.",
            "Uses believable technical terms.",
            "Answers within given seconds confidently without hesitation. Each round carries an different time stamps.",
            "Avoids simply adding not to the correct answer.",
            "Answers must be tech-related — no random gibberish.",
            "Accept the Judge's decisions.No Arguments with Event Co-ordinators.No Arguments with Other Team members."
        ],
        teamSize: "Solo Participation",
        prizes: "1st: ₹500",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/Giantsbane – Down Side UP.png"
    },
    {
        id: "binary_charades",
        title: "Binary Charades",
        theme: "The Silent Wolf",
        tier: "Tier 3",
        tagline: "Act out technical terms without speaking. Hold the door!",
        desc: "No words allowed. Only actions. Act out complex technical architectures and terms while your partner decodes your silent performance.",
        rules: [
            "Exactly 2 participants per team allowed.",
            "A bowl contains several technical words, One participant randomly picks a word from the bowl.",
            "Act out the word using only gestures and body movements.",
            "The other participant must identify and guess the word.",
            "No talking, sounds, or verbal clues allowed.",
            "Points awarded for every correct guess within time."
        ],
        teamSize: "Exactly 2 members",
        prizes: "1st: ₹500",
        contact: "COORDINATOR_NAME",
        phone: "+91 XXXXXXXXXX",
        img: "assets/Stark - Binary Charades.png"
    }
];

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const eventsGrid = document.getElementById('events-grid');
const eventOverlay = document.getElementById('event-overlay');
const closeOverlayBtn = document.getElementById('close-overlay');
const detailsView = document.getElementById('event-details-view');
let activeCard = null;

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close nav when a link is clicked (smooth UX on mobile)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// Splash Screen Logic
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to('.splash-logo', { opacity: 1, duration: 1.5, ease: "power2.inOut" })
      .to('.splash-logo', { opacity: 0, duration: 1, delay: 1.5, ease: "power2.inOut" })
      .to(splashScreen, { opacity: 0, duration: 0.8, onComplete: () => {
          splashScreen.style.display = 'none';
          document.body.style.overflow = 'auto'; // Re-enable scrolling
          
          // Trigger card animations after splash
          gsap.from('.event-card', {
              y: 100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "all" // CRITICAL: Removes inline styles after animation so CSS hover transforms work again
          });
      }});
      
    document.body.style.overflow = 'hidden'; // Prevent scrolling during splash
    
    // Initialize cards and registration checkboxes
    renderCards();
    renderEventCheckboxes();
});

// Render Event Cards
function renderCards() {
    eventsData.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.id = event.id;
        
        let tierClass = "tier-1";
        if (event.tier === "Tier 2") tierClass = "tier-2";
        else if (event.tier === "Tier 3") tierClass = "tier-3";
        
        card.innerHTML = `
            <img src="${event.img}" alt="${event.title}" class="card-bg">
            <div class="tier-badge ${tierClass}">${event.tier}</div>
            <div class="card-content">
                <div class="card-theme">${event.theme}</div>
                <h3 class="card-title">${event.title}</h3>
                <p class="card-tagline">${event.tagline}</p>
                <div class="more-details-btn">more details &rarr;</div>
            </div>
        `;
        
        card.addEventListener('click', (e) => openEventOverlay(event, card));
        eventsGrid.appendChild(card);
    });
}

// Open Overlay with cinematic flash + scale animation
function openEventOverlay(event, card) {
    activeCard = card;

    // ── Set cover photo as background ──────────────────────────────────
    const overlayBg = document.getElementById('overlay-bg-photo');
    overlayBg.style.backgroundImage = `url('${event.img}')`;

    // ── Populate all details ────────────────────────────────────────────
    document.getElementById('detail-title').innerText = event.title;
    document.getElementById('detail-theme').innerText = event.theme;
    document.getElementById('detail-desc').innerText = event.desc;
    document.getElementById('detail-rules').innerHTML = event.rules
        .map(r => `<li><i class="fas fa-chevron-right"></i>${r}</li>`).join('');
    document.getElementById('detail-team-size').innerText = event.teamSize;
    document.getElementById('detail-prizes').innerText = event.prizes;
    document.getElementById('detail-coord-name').innerText = event.contact;
    document.getElementById('detail-coord-phone').href = `tel:${event.phone}`;
    document.getElementById('detail-coord-phone-text').innerText = event.phone;

    // ── Show overlay ────────────────────────────────────────────────────
    eventOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // ── Cinematic animation: flash burst → card maximises ──────────────
    const rect = card.getBoundingClientRect();
    const cardCX = rect.left + rect.width / 2;
    const cardCY = rect.top  + rect.height / 2;
    const vCX    = window.innerWidth  / 2;
    const vCY    = window.innerHeight / 2;

    // Flash element: position at card centre, translate -50% via CSS already
    const flash = document.getElementById('overlay-flash');
    gsap.set(flash, {
        left: cardCX,
        top:  cardCY,
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0
    });

    // Overlay card: start tiny at card centre, then move to viewport centre
    const overlayContent = document.querySelector('.overlay-content');
    gsap.set(overlayContent, {
        x: cardCX - vCX,
        y: cardCY - vCY,
        scale: 0.06,
        opacity: 0,
        transformOrigin: 'center center'
    });

    const tl = gsap.timeline();

    // 1. Flash burst
    tl.to(flash, { scale: 5, opacity: 1, duration: 0.16, ease: 'power2.out' })
    // 2. Flash fades out
      .to(flash, { scale: 14, opacity: 0, duration: 0.4, ease: 'power1.out' }, '<0.06')
    // 3. Popup expands to centre
      .to(overlayContent, {
          x: 0, y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out'
      }, '<0.04')
    // 4. Inner content cascades in
      .from('.popup-header', { y: -25, opacity: 0, duration: 0.38, ease: 'power3.out' }, '-=0.2')
      .from('.popup-body > *', {
          y: 22, opacity: 0, duration: 0.32,
          stagger: 0.07, ease: 'power2.out'
      }, '-=0.22')
      .from('.popup-register-btn', { y: 16, opacity: 0, duration: 0.3, ease: 'back.out(2)' }, '-=0.1');
}

// Close Overlay
function closeEventOverlay() {
    gsap.to('.overlay-content', {
        scale: 0.85,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
            eventOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}

closeOverlayBtn.addEventListener('click', closeEventOverlay);

// Also close overlay when clicking the backdrop
eventOverlay.addEventListener('click', (e) => {
    if (e.target === eventOverlay) closeEventOverlay();
});

// =====================================================================
// INDIVIDUAL REGISTRATION SECTION
// =====================================================================
const openRegFormBtn = document.getElementById('open-reg-form');
const closeRegFormBtn = document.getElementById('close-reg-form');
const registerBanner = document.getElementById('register-banner');
const registerFormContainer = document.getElementById('register-form-container');
const individualRegForm = document.getElementById('individual-reg-form');
const eventsCheckboxGrid = document.getElementById('events-checkbox-grid');

// Step elements
const step1 = document.getElementById('reg-step-1');
const step2 = document.getElementById('reg-step-2');
const stepInd1 = document.getElementById('step-ind-1');
const stepInd2 = document.getElementById('step-ind-2');
const proceedBtn = document.getElementById('proceed-to-payment');
const backBtn = document.getElementById('back-to-step1');
const step1Error = document.getElementById('step1-error');
const step2Error = document.getElementById('step2-error');

// File upload elements
const screenshotInput = document.getElementById('reg-screenshot');
const fileUploadArea = document.getElementById('file-upload-area');
const filePlaceholder = document.getElementById('file-placeholder');
const filePreview = document.getElementById('file-preview');
const previewImg = document.getElementById('preview-img');
const previewName = document.getElementById('preview-name');
const previewSize = document.getElementById('preview-size');
const removeFileBtn = document.getElementById('remove-file');

// Inject event checkboxes from eventsData
function renderEventCheckboxes() {
    eventsCheckboxGrid.innerHTML = '';
    eventsData.forEach(event => {
        const item = document.createElement('label');
        item.className = 'event-checkbox-item';
        // NOTE: Do NOT set item.htmlFor here — the input is already inside the label.
        // Setting both causes a double-toggle bug (browser fires the click twice).
        item.innerHTML = `
            <input type="checkbox" id="chk-${event.id}" name="events" value="${event.title}">
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">${event.title}</span>
        `;
        eventsCheckboxGrid.appendChild(item);
    });
}

// Open registration form
openRegFormBtn.addEventListener('click', () => {
    registerBanner.classList.add('hidden');
    registerFormContainer.classList.remove('hidden');
    gsap.fromTo('#register-form-container',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
    document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
});

// Close / collapse back to banner (also resets form to step 1)
closeRegFormBtn.addEventListener('click', () => {
    gsap.to('#register-form-container', {
        opacity: 0, y: 20, duration: 0.3, onComplete: () => {
            registerFormContainer.classList.add('hidden');
            registerBanner.classList.remove('hidden');
            gsap.fromTo('#register-banner', { opacity: 0 }, { opacity: 1, duration: 0.4 });
            resetFormToStep1();
        }
    });
});

// Reset entire form back to step 1
function resetFormToStep1() {
    individualRegForm.reset();
    clearFilePreview();
    showStep(1);
    step1Error.classList.add('hidden');
    step2Error.classList.add('hidden');
    document.getElementById('reg-form-message').innerHTML = '';
}

// ── Step Navigation ──────────────────────────────────────────────────

function showStep(num) {
    if (num === 1) {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        gsap.fromTo(step1, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4 });
        stepInd1.classList.add('active');
        stepInd1.classList.remove('completed');
        stepInd2.classList.remove('active');
    } else {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        gsap.fromTo(step2, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4 });
        stepInd1.classList.remove('active');
        stepInd1.classList.add('completed');
        stepInd2.classList.add('active');
    }
}

// Proceed to Step 2 — validate Step 1 first
proceedBtn.addEventListener('click', () => {
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const college = document.getElementById('reg-college').value.trim();
    const selectedEvents = [...individualRegForm.querySelectorAll('input[name="events"]:checked')].map(cb => cb.value);

    // Validate
    if (!name) return showStep1Error('Please enter your name.');
    if (!/^[0-9]{10}$/.test(phone)) return showStep1Error('Please enter a valid 10-digit contact number.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showStep1Error('Please enter a valid email address.');
    if (!college) return showStep1Error('Please enter your college / institution name.');
    if (selectedEvents.length === 0) return showStep1Error('Please select at least one event to attend.');
    const food = document.getElementById('reg-food').value;
    if (!food) return showStep1Error('Please select your food preference (Veg / Non-Veg).');

    // All good — build summary and go to step 2
    step1Error.classList.add('hidden');
    const summaryEl = document.getElementById('payment-summary-text');
    summaryEl.innerHTML = `
        <strong>${name}</strong> — ${college}<br>
        <span class="summary-events"><i class="fas fa-calendar-check"></i> ${selectedEvents.join(' • ')}</span>
    `;
    showStep(2);
    // Scroll to top of form
    registerFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function showStep1Error(msg) {
    step1Error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    step1Error.classList.remove('hidden');
    gsap.fromTo(step1Error, { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: 0.3 });
}

// Back to Step 1
backBtn.addEventListener('click', () => showStep(1));

// Clear button (Step 1)
document.getElementById('reset-reg-form').addEventListener('click', resetFormToStep1);

// ── Food Preference Dropdown ──────────────────────────────────────────
// No JS needed — native <select> handles state automatically.

// ── File Upload ───────────────────────────────────────────────────────

fileUploadArea.addEventListener('click', () => screenshotInput.click());

// Drag & drop
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('drag-over');
});
fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('drag-over'));
fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelected(file);
});

screenshotInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleFileSelected(e.target.files[0]);
});

function handleFileSelected(file) {
    // Type check
    if (!file.type.startsWith('image/')) {
        showStep2Error('Please upload an image file (PNG, JPG, WEBP).');
        return;
    }
    // Size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showStep2Error('File is too large. Please upload an image under 5 MB.');
        return;
    }
    step2Error.classList.add('hidden');

    const reader = new FileReader();
    reader.onload = (ev) => {
        previewImg.src = ev.target.result;
        previewName.textContent = file.name;
        previewSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
        filePlaceholder.classList.add('hidden');
        filePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearFilePreview();
});

function clearFilePreview() {
    screenshotInput.value = '';
    previewImg.src = '';
    previewName.textContent = '';
    previewSize.textContent = '';
    filePlaceholder.classList.remove('hidden');
    filePreview.classList.add('hidden');
}

function showStep2Error(msg) {
    step2Error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    step2Error.classList.remove('hidden');
    gsap.fromTo(step2Error, { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: 0.3 });
}

// ── Form Submission ───────────────────────────────────────────────────

// TODO: Replace this with your own Google Apps Script Web App URL
// Deploy your google_script.gs as a Web App and paste the URL here.
const WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

individualRegForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('reg-submit-btn');
    const msgDiv = document.getElementById('reg-form-message');

    // Validate Step 2 fields
    const txnId = document.getElementById('reg-txn-id').value.trim();
    if (!txnId) { showStep2Error('Please enter the Transaction ID.'); return; }
    if (!screenshotInput.files[0]) { showStep2Error('Please upload your payment screenshot.'); return; }

    step2Error.classList.add('hidden');
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending Ravens...`;
    submitBtn.disabled = true;
    msgDiv.innerHTML = '';

    // Read screenshot as base64
    const file = screenshotInput.files[0];
    const reader = new FileReader();

    reader.onload = async (ev) => {
        const selectedEvents = [...individualRegForm.querySelectorAll('input[name="events"]:checked')].map(cb => cb.value);

        const data = {
            name: document.getElementById('reg-name').value.trim(),
            phone: document.getElementById('reg-phone').value.trim(),
            email: document.getElementById('reg-email').value.trim(),
            college: document.getElementById('reg-college').value.trim(),
            events: selectedEvents.join(', '),
            food: document.getElementById('reg-food').value,
            fee: '₹200',
            transactionId: txnId,
            screenshotBase64: ev.target.result,      // full DataURL e.g. "data:image/png;base64,..."
            screenshotName: file.name
        };

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (result.status === 'success') {
                // Show cinematic full-screen success overlay
                showSuccessOverlay(data.email);
                individualRegForm.reset();
                clearFilePreview();
                showStep(1);
            } else {
                throw new Error(result.message || 'Server Error');
            }
        } catch (error) {
            console.error('Submission failed:', error);
            msgDiv.innerHTML = `<span class="msg-error"><i class="fas fa-times-circle"></i> A raven was intercepted. Please try again or contact us directly.</span>`;
        } finally {
            submitBtn.innerHTML = `Submit Registration <i class="fas fa-paper-plane"></i>`;
            submitBtn.disabled = false;
        }
    };

    reader.readAsDataURL(file);
});


// =====================================================================
// SUCCESS OVERLAY — cinematic full-screen card after registration
// =====================================================================
const successOverlay   = document.getElementById('success-overlay');
const successCard      = document.getElementById('success-card');
const successExploreBtn= document.getElementById('success-explore-btn');
const successEmailText = document.getElementById('success-email-text');
const particlesCanvas  = document.getElementById('success-particles');
let   particleAnim     = null;

function showSuccessOverlay(email) {
    // Inject email
    successEmailText.textContent = email || '—';

    // Show overlay
    successOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Re-trigger SVG stroke animations by cloning (reset dashoffset)
    const svgEl = successCard.querySelector('.success-checkmark');
    const clone = svgEl.cloneNode(true);
    svgEl.replaceWith(clone);

    // Card entrance
    successCard.classList.remove('animate-in');
    void successCard.offsetWidth; // force reflow
    successCard.classList.add('animate-in');

    // Particle burst
    startParticles();
}

function hideSuccessOverlay() {
    gsap.to(successCard, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            successOverlay.classList.add('hidden');
            successCard.style.transform = '';
            successCard.style.opacity = '';
            stopParticles();
            document.body.style.overflow = 'auto';
        }
    });
}

// "Continue Exploring" — hide overlay and scroll to events section
successExploreBtn.addEventListener('click', () => {
    hideSuccessOverlay();
    setTimeout(() => {
        const eventsSection = document.getElementById('events');
        if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 350);
});

// ── Ambient particle system ──────────────────────────────────────────
function startParticles() {
    const canvas = particlesCanvas;
    const ctx    = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;
    const COLORS = ['#e65c00', '#ff8c42', '#990000', '#ffcc88', '#ff5500', '#ffd700'];
    const COUNT  = 70;

    const particles = Array.from({ length: COUNT }, () => ({
        x:  W / 2 + (Math.random() - 0.5) * 60,
        y:  H / 2 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 4.5,
        vy: (Math.random() - 0.5) * 4.5 - 1.5,
        r:  Math.random() * 3 + 1.2,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    let running = true;

    function draw() {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x     += p.vx;
            p.y     += p.vy;
            p.vy    += 0.055; // gravity
            p.alpha -= p.decay;
            if (p.alpha < 0) p.alpha = 0;
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.restore();
        });
        particleAnim = requestAnimationFrame(draw);
    }

    draw();

    // Respawn after 2.5 s to keep ambient sparkle
    setTimeout(() => {
        if (!running) return;
        particles.forEach(p => {
            p.x     = W / 2 + (Math.random() - 0.5) * 120;
            p.y     = H / 2 + (Math.random() - 0.5) * 120;
            p.vx    = (Math.random() - 0.5) * 2;
            p.vy    = (Math.random() - 0.5) * 2 - 0.5;
            p.alpha = Math.random() * 0.4 + 0.1;
            p.r     = Math.random() * 2 + 0.8;
            p.decay = 0.003 + Math.random() * 0.005;
        });
    }, 2500);

    particlesCanvas._stopFn = () => { running = false; };
}

function stopParticles() {
    if (particleAnim) cancelAnimationFrame(particleAnim);
    if (particlesCanvas._stopFn) particlesCanvas._stopFn();
    const ctx = particlesCanvas.getContext('2d');
    ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
}



// Interactive Dragon Scale Background Parallax
const dragonBg = document.querySelector('.dragon-background');

// Mouse movement parallax
document.addEventListener('mousemove', (e) => {
    // Only apply if the overlay is hidden (user is not filling form)
    if (eventOverlay.classList.contains('hidden')) {
        const x = (window.innerWidth - e.pageX * 2) / 80;
        const y = (window.innerHeight - e.pageY * 2) / 80;
        
        gsap.to(dragonBg, {
            x: x,
            y: y,
            duration: 1.5,
            ease: "power2.out"
        });
    }
});

// Scroll parallax
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Scale the background slightly as we scroll down and move it up
    gsap.to(dragonBg, {
        y: -scrollY * 0.2,
        scale: 1 + (scrollY * 0.0003),
        duration: 0.5,
        ease: "power1.out"
    });

    // Scroll-hint: hide when scrolled down, re-arm when back at top
    if (scrollY > 80) {
        hideScrollHint();
    } else {
        if (scrollHintShown) {
            scrollHintShown = false;
            resetScrollHintTimer();
        }
    }
});


// =====================================================================
// SCROLL-DOWN HINT — shows after 2 s of staying on #home
// =====================================================================
const scrollHint = document.getElementById('scroll-down-hint');
let scrollHintTimer = null;
let scrollHintShown = false;
let isHicking = false;

function showScrollHint() {
    if (scrollHintShown) return;
    scrollHintShown = true;
    scrollHint.classList.add('visible');
}

function hideScrollHint() {
    scrollHint.classList.remove('visible');
    clearTimeout(scrollHintTimer);
}

function resetScrollHintTimer() {
    clearTimeout(scrollHintTimer);
    if (window.scrollY <= 80) {
        scrollHintTimer = setTimeout(showScrollHint, 2000);
    }
}

// Start the timer after splash ends
(function waitForSplashEnd() {
    const check = setInterval(() => {
        if (splashScreen.style.display === 'none') {
            clearInterval(check);
            resetScrollHintTimer();
        }
    }, 200);
})();

// Dismiss on click — scroll to events
scrollHint.addEventListener('click', () => {
    hideScrollHint();
    window.scrollTo({ top: document.getElementById('events').offsetTop, behavior: 'smooth' });
});

/* ═══════════════════════════════════════════════════════════════
   COUNTDOWN CLOCKS
   ═══════════════════════════════════════════════════════════════ */
(function initCountdowns() {
    // TODO: Update the dates below for your event
    // Format: 'YYYY-MM-DDTHH:MM:SS+05:30' (IST = UTC+5:30)
    // Event date/time — when the event starts
    const EVENT_DATE = new Date('YYYY-MM-DDTHH:MM:SS+05:30');
    // Registration close date — last day to register
    const REG_CLOSE_DATE = new Date('YYYY-MM-DDTHH:MM:SS+05:30');

    /**
     * Pads a number to 2 digits.
     */
    function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

    /**
     * Updates a single countdown-num element with flip animation if the value changed.
     */
    function setNum(el, val) {
        const v = pad(val);
        if (el && el.textContent !== v) {
            el.classList.remove('flip-anim');
            // Force reflow to restart animation
            void el.offsetWidth;
            el.textContent = v;
            el.classList.add('flip-anim');
        }
    }

    /**
     * Calculates remaining time from now to targetDate.
     * Returns { days, hours, minutes, seconds, expired }
     */
    function getRemaining(targetDate) {
        const diff = targetDate - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        const totalSeconds = Math.floor(diff / 1000);
        const days    = Math.floor(totalSeconds / 86400);
        const hours   = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { days, hours, minutes, seconds, expired: false };
    }

    // ── Event Countdown elements ─────────────────────────────────
    const evtD = document.getElementById('evt-d');
    const evtH = document.getElementById('evt-h');
    const evtM = document.getElementById('evt-m');
    const evtS = document.getElementById('evt-s');
    const evtStrip = document.getElementById('event-countdown');
    const evtWrapper = document.getElementById('event-countdown-wrapper');

    // ── Registration Countdown elements ──────────────────────────
    const regD = document.getElementById('reg-d');
    const regH = document.getElementById('reg-h');
    const regM = document.getElementById('reg-m');
    const regS = document.getElementById('reg-s');
    const regStrip = document.getElementById('reg-countdown');
    const regSection = document.getElementById('reg-countdown-section');

    function showExpired(stripEl, wrapperEl, message) {
        if (!stripEl) return;
        stripEl.innerHTML = `<span class="countdown-expired-msg">${message}</span>`;
    }

    function tick() {
        // — Event countdown —
        const evt = getRemaining(EVENT_DATE);
        if (evt.expired) {
            showExpired(evtStrip, evtWrapper, '🔥 The Dragon Has Awakened 🔥');
        } else {
            setNum(evtD, evt.days);
            setNum(evtH, evt.hours);
            setNum(evtM, evt.minutes);
            setNum(evtS, evt.seconds);
        }

        // — Registration countdown —
        const reg = getRemaining(REG_CLOSE_DATE);
        if (reg.expired) {
            showExpired(regStrip, regSection, '⚔️ The Gates Are Shut — Registration Closed ⚔️');
            // Optionally hide the CTA button too
            const cta = document.querySelector('.reg-countdown-cta');
            if (cta) cta.style.display = 'none';
        } else {
            setNum(regD, reg.days);
            setNum(regH, reg.hours);
            setNum(regM, reg.minutes);
            setNum(regS, reg.seconds);
        }
    }

    // Run immediately then every second
    tick();
    setInterval(tick, 1000);
})();
