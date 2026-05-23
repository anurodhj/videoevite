document.addEventListener('DOMContentLoaded', () => {

  // Showcase State & Templates Data
  const templates = {
    wedding: {
      title: "Wedding Video Invitation",
      subtitle: "The couple records a warm invite; VideoEvite overlays the guest name in a premium layout.",
      bgImage: "assets/wedding_host.png",
      videoUrl: "", // Optional base video
      fields: [
        { id: "wedding_host_name", label: "Hosts / Couple Name", value: "Alexander & Sophia", type: "text" },
        { id: "wedding_guest_name", label: "Guest Name", value: "David & Emily Miller", type: "text" },
        { id: "wedding_date", label: "Wedding Date", value: "September 18, 2026", type: "text" }
      ],
      placeholderName: "wedding"
    },
    hotel: {
      title: "Hotel Booking Confirmation",
      subtitle: "The General Manager records a warm welcome; VideoEvite embeds reservation check-in details.",
      bgImage: "assets/hotel_bg.png",
      fields: [
        { id: "hotel_guest_name", label: "Guest Name", value: "Sarah Jenkins", type: "text" },
        { id: "hotel_room_type", label: "Room / Suite Type", value: "Presidential Penthouse", type: "text" },
        { id: "hotel_checkin", label: "Check-in Date", value: "June 15, 2026", type: "text" }
      ],
      placeholderName: "hotel"
    },
    college: {
      title: "College Admission Welcome",
      subtitle: "The Dean records an acceptance video; VideoEvite customizes the letter, student name, and major.",
      bgImage: "assets/college_bg.png",
      fields: [
        { id: "college_student_name", label: "Student Name", value: "Liam Gallagher", type: "text" },
        { id: "college_major", label: "Admitted Major", value: "B.S. Aerospace Engineering", type: "text" },
        { id: "college_scholarship", label: "Scholarship / Aid", value: "Dean's Excellence Scholar", type: "text" }
      ],
      placeholderName: "college"
    }
  };

  let activeTemplate = 'wedding';
  let isPlaying = false;
  let playerProgress = 0;
  let playInterval = null;
  let typingTimer = null;

  // Cache DOM Elements
  const tabWedding = document.getElementById('tab-wedding');
  const tabHotel = document.getElementById('tab-hotel');
  const tabCollege = document.getElementById('tab-college');

  const showcaseTitle = document.getElementById('showcase-title');
  const showcaseDesc = document.getElementById('showcase-desc');
  const showcaseForm = document.getElementById('showcase-form');
  const livePlayer = document.getElementById('live-player');
  const playerBg = document.getElementById('player-bg');
  const playBtn = document.getElementById('play-btn');
  const playerProgressEl = document.getElementById('player-progress');
  const playerTimeEl = document.getElementById('player-time');
  const playerVideo = document.getElementById('player-video');
  const videoExampleToggle = document.getElementById('video-example-toggle');
  const toggleButtons = document.querySelectorAll('.btn-toggle');
  const soundBtn = document.getElementById('sound-btn');

  // Overlay Elements
  const overlayWedding = document.getElementById('overlay-wedding');
  const overlayHotel = document.getElementById('overlay-hotel');
  const overlayCollege = document.getElementById('overlay-college');

  // Target Overlay Fields
  const owNames = document.getElementById('ow-names');
  const owGuest = document.getElementById('ow-guest');
  const owDate = document.getElementById('ow-date');

  const ohGuest = document.getElementById('oh-guest');
  const ohRoom = document.getElementById('oh-room');
  const ohDate = document.getElementById('oh-date');

  const ocStudent = document.getElementById('oc-student');
  const ocMajor = document.getElementById('oc-major');
  const ocScholarship = document.getElementById('oc-scholarship');

  // Modal DOM Elements
  const modalOverlay = document.getElementById('modal-overlay');
  const openModalBtns = document.querySelectorAll('.open-demo-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const leadForm = document.getElementById('lead-form');
  const modalContent = document.getElementById('modal-body-content');

  // Initial Setup
  initShowcase('wedding');

  // Tab Events
  tabWedding.addEventListener('click', () => switchTab('wedding', tabWedding));
  tabHotel.addEventListener('click', () => switchTab('hotel', tabHotel));
  tabCollege.addEventListener('click', () => switchTab('college', tabCollege));

  function switchTab(templateKey, activeTabEl) {
    if (activeTemplate === templateKey) return;

    // UI tabs state
    document.querySelectorAll('.showcase-tab').forEach(t => t.classList.remove('active'));
    activeTabEl.classList.add('active');

    activeTemplate = templateKey;
    initShowcase(templateKey);
    resetPlayer();
  }

  // Register Click Events for Video Selector Pills
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const videoKey = btn.getAttribute('data-video');

      if (playerVideo) {
        playerVideo.src = videoKey === 'white' ? 'assets/white_wedding.mp4' : 'assets/Phuket_Wedding.mp4';
        playerVideo.load();
        if (isPlaying) {
          playerVideo.play().catch(err => console.log("Video play failed:", err));
        }
      }

      // Update overlay texts and form input values
      const namesInput = document.getElementById('wedding_host_name');
      const dateInput = document.getElementById('wedding_date');

      if (videoKey === 'white') {
        if (owNames) owNames.textContent = "Alexander & Sophia";
        if (owGuest) owGuest.textContent = "David & Emily Miller";
        if (owDate) owDate.textContent = "September 18, 2026";
        if (namesInput) namesInput.value = "Alexander & Sophia";
        if (dateInput) dateInput.value = "September 18, 2026";
        templates.wedding.fields[0].value = "Alexander & Sophia";
        templates.wedding.fields[2].value = "September 18, 2026";
      } else {
        if (owNames) owNames.textContent = "Marcus & Aisha";
        if (owGuest) owGuest.textContent = "David & Emily Miller";
        if (owDate) owDate.textContent = "November 12, 2026";
        if (namesInput) namesInput.value = "Marcus & Aisha";
        if (dateInput) dateInput.value = "November 12, 2026";
        templates.wedding.fields[0].value = "Marcus & Aisha";
        templates.wedding.fields[2].value = "November 12, 2026";
      }

      triggerPersonalizationGlow();
    });
  });

  function initShowcase(templateKey) {
    const data = templates[templateKey];

    showcaseTitle.textContent = data.title;
    showcaseDesc.textContent = data.subtitle;

    // Handle background media swapping
    if (templateKey === 'wedding') {
      if (videoExampleToggle) videoExampleToggle.style.display = 'block';
      if (playerVideo) {
        playerVideo.style.display = 'block';
        const activeVideo = document.querySelector('.btn-toggle.active').getAttribute('data-video');
        playerVideo.src = activeVideo === 'white' ? 'assets/white_wedding.mp4' : 'assets/Phuket_Wedding.mp4';
        playerVideo.load();
      }
      if (playerBg) playerBg.style.display = 'none';
    } else {
      if (videoExampleToggle) videoExampleToggle.style.display = 'none';
      if (playerVideo) {
        playerVideo.style.display = 'none';
        playerVideo.pause();
      }
      if (playerBg) {
        playerBg.style.display = 'block';
        playerBg.src = data.bgImage;
      }
    }

    playerBg.onerror = function () {
      // Fallback images in case local copy fails initially
      if (templateKey === 'wedding') {
        playerBg.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
      } else if (templateKey === 'hotel') {
        playerBg.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
      } else {
        playerBg.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800';
      }
    };

    // Active template overlay visibility
    overlayWedding.classList.remove('active');
    overlayHotel.classList.remove('active');
    overlayCollege.classList.remove('active');

    if (templateKey === 'wedding') overlayWedding.classList.add('active');
    if (templateKey === 'hotel') overlayHotel.classList.add('active');
    if (templateKey === 'college') overlayCollege.classList.add('active');

    // Render dynamic form fields
    showcaseForm.innerHTML = '';
    data.fields.forEach(field => {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';

      const label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;

      const input = document.createElement('input');
      input.type = field.type;
      input.id = field.id;
      input.value = field.value;
      input.autocomplete = "off";

      formGroup.appendChild(label);
      formGroup.appendChild(input);
      showcaseForm.appendChild(formGroup);

      // Bind live inputs
      input.addEventListener('input', (e) => {
        updateOverlayText(templateKey, field.id, e.target.value);
        triggerPersonalizationGlow();
      });
    });

    // Write initial inputs to overlay elements
    data.fields.forEach(field => {
      updateOverlayText(templateKey, field.id, field.value);
    });
  }

  function updateOverlayText(templateKey, fieldId, value) {
    // Sanitize value just in case
    const safeValue = value.trim() === "" ? "—" : value;

    if (templateKey === 'wedding') {
      if (fieldId === 'wedding_host_name') owNames.textContent = safeValue;
      if (fieldId === 'wedding_guest_name') owGuest.textContent = safeValue;
      if (fieldId === 'wedding_date') owDate.textContent = safeValue;
    }

    if (templateKey === 'hotel') {
      if (fieldId === 'hotel_guest_name') ohGuest.textContent = safeValue;
      if (fieldId === 'hotel_room_type') ohRoom.textContent = safeValue;
      if (fieldId === 'hotel_checkin') ohDate.textContent = safeValue;
    }

    if (templateKey === 'college') {
      if (fieldId === 'college_student_name') ocStudent.textContent = safeValue;
      if (fieldId === 'college_major') ocMajor.textContent = safeValue;
      if (fieldId === 'college_scholarship') ocScholarship.textContent = safeValue;
    }
  }

  // Micro-interaction: glowing border on update
  function triggerPersonalizationGlow() {
    const videoWrapper = livePlayer;
    videoWrapper.style.boxShadow = '0 0 30px var(--accent-teal-glow), 0 20px 50px rgba(0, 0, 0, 0.5)';

    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      videoWrapper.style.boxShadow = 'var(--glass-shadow), 0 20px 50px rgba(0, 0, 0, 0.4)';
    }, 450);
  }

  // Video Simulator Playback Logic
  playBtn.addEventListener('click', togglePlay);

  let isMuted = true;
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (playerVideo) {
        playerVideo.muted = isMuted;
      }
      if (isMuted) {
        soundBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x" id="sound-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      } else {
        soundBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2" id="sound-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      }
    });
  }

  function togglePlay() {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }

  function playVideo() {
    isPlaying = true;
    livePlayer.classList.add('playing');
    playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

    if (activeTemplate === 'wedding' && playerVideo) {
      playerVideo.play().catch(err => console.log("Video playback failed:", err));
    }

    playInterval = setInterval(() => {
      if (activeTemplate === 'wedding' && playerVideo && playerVideo.duration) {
        playerProgress = (playerVideo.currentTime / playerVideo.duration) * 100;
        playerProgressEl.style.width = `${playerProgress}%`;

        const totalDuration = playerVideo.duration;
        const currentSeconds = Math.floor(playerVideo.currentTime);
        const totalSecs = Math.floor(totalDuration);
        playerTimeEl.textContent = `0:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds} / 0:${totalSecs < 10 ? '0' + totalSecs : totalSecs}`;
      } else {
        playerProgress += 1;
        if (playerProgress >= 100) {
          playerProgress = 0;
        }
        playerProgressEl.style.width = `${playerProgress}%`;

        // Calculate display timer (mock 10s video)
        const currentSeconds = Math.floor((playerProgress / 100) * 10);
        playerTimeEl.textContent = `0:0${currentSeconds} / 0:10`;
      }
    }, 100);
  }

  function pauseVideo() {
    isPlaying = false;
    livePlayer.classList.remove('playing');
    playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    clearInterval(playInterval);

    if (activeTemplate === 'wedding' && playerVideo) {
      playerVideo.pause();
    }
  }

  function resetPlayer() {
    pauseVideo();
    playerProgress = 0;
    playerProgressEl.style.width = '0%';
    playerTimeEl.textContent = '0:00 / 0:10';
    if (playerVideo) {
      playerVideo.pause();
      playerVideo.currentTime = 0;
      playerVideo.muted = true;
    }
    isMuted = true;
    if (soundBtn) {
      soundBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x" id="sound-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    }
  }

  // Modal Handlers
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
    });
  });

  closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    // Clear forms after a short delay
    setTimeout(resetModalForm, 300);
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
      setTimeout(resetModalForm, 300);
    }
  });

  // Modal Form Submission Simulation
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple verification
    const email = document.getElementById('demo-email').value;
    const name = document.getElementById('demo-name').value;
    if (!email || !name) return;

    // Show loading spinner within modal
    const originalSubmitBtn = leadForm.querySelector('button[type="submit"]');
    originalSubmitBtn.disabled = true;
    originalSubmitBtn.textContent = "Processing...";

    setTimeout(() => {
      // Transition to success state
      modalContent.innerHTML = `
        <div class="success-panel">
          <div class="success-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3>Demo Requested!</h3>
          <p>Thank you, <strong>${name}</strong>. Our team will contact you at <strong>${email}</strong> shortly to showcase how our personalization engine fits your workflow.</p>
          <button class="btn btn-secondary btn-sm" id="btn-close-success" style="margin-top: 24px;">Close Window</button>
        </div>
      `;

      document.getElementById('btn-close-success').addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        setTimeout(resetModalForm, 300);
      });
    }, 1200);
  });

  function resetModalForm() {
    modalContent.innerHTML = `
      <div class="modal-header">
        <h2>Request a Product Demo</h2>
        <p>Schedule a live 1-on-1 walkthrough with our integration team to see VideoEvite in action for your organization.</p>
      </div>
      <form class="modal-form" id="lead-form">
        <div class="form-group">
          <label for="demo-name">Full Name</label>
          <input type="text" id="demo-name" placeholder="John Doe" required>
        </div>
        <div class="form-group">
          <label for="demo-email">Work Email</label>
          <input type="email" id="demo-email" placeholder="john@company.com" required>
        </div>
        <div class="form-group">
          <label for="demo-company">Company / Wedding Host Name</label>
          <input type="text" id="demo-company" placeholder="e.g. Grand Plaza Hotels / Smith-Jones Wedding" required>
        </div>
        <div class="form-group">
          <label for="demo-use-case">Primary Use Case</label>
          <select id="demo-use-case" required>
            <option value="" disabled selected>Select your application...</option>
            <option value="marriage">Personalized Marriage Video Invitations</option>
            <option value="hotel">Hotel GM Booking Confirmations</option>
            <option value="college">College Admission Dean Video Welcome</option>
            <option value="other">Other custom SaaS integrations</option>
          </select>
        </div>
        <div class="form-group">
          <label for="demo-message">Tell us about your project (optional)</label>
          <textarea id="demo-message" placeholder="We need to send 500 personalized videos per month..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Schedule Demo</button>
      </form>
    `;

    // Re-bind form submission and close events since DOM elements were replaced
    const newForm = document.getElementById('lead-form');
    newForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('demo-email').value;
      const name = document.getElementById('demo-name').value;
      if (!email || !name) return;

      const submitBtn = newForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Processing...";

      setTimeout(() => {
        modalContent.innerHTML = `
          <div class="success-panel">
            <div class="success-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3>Demo Requested!</h3>
            <p>Thank you, <strong>${name}</strong>. Our team will contact you at <strong>${email}</strong> shortly to showcase how our personalization engine fits your workflow.</p>
            <button class="btn btn-secondary btn-sm" id="btn-close-success" style="margin-top: 24px;">Close Window</button>
          </div>
        `;

        document.getElementById('btn-close-success').addEventListener('click', () => {
          modalOverlay.classList.remove('active');
          setTimeout(resetModalForm, 300);
        });
      }, 1200);
    });
  }



});
