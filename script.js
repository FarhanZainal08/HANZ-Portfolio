const typedText = document.getElementById('typedText');
const revealItems = document.querySelectorAll('.reveal');
const audioToggle = document.getElementById('audioToggle');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.getElementById('primary-navigation');

function closeMobileMenu() {
  if (!menuToggle || !primaryNavigation) return;
  primaryNavigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
}

if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNavigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  });

  primaryNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });
}

const words = ['Innovator', 'Youth Leader', 'Editor', 'Creator'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typedText) return;

  const currentWord = words[wordIndex];

  if (!isDeleting && charIndex <= currentWord.length) {
    typedText.textContent = currentWord.slice(0, charIndex);
    charIndex += 1;
    setTimeout(typeLoop, 90);
    return;
  }

  if (!isDeleting && charIndex > currentWord.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (isDeleting && charIndex >= 0) {
    typedText.textContent = currentWord.slice(0, charIndex);
    charIndex -= 1;
    setTimeout(typeLoop, 55);
    return;
  }

  isDeleting = false;
  wordIndex = (wordIndex + 1) % words.length;
  charIndex = 0;
  setTimeout(typeLoop, 300);
}

if (typedText) {
  typeLoop();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const backgroundAudio = document.getElementById('backgroundAudio');
const audioPositionKey = 'portfolioAudioPosition';
let audioOn = false;

function restoreAudioPosition() {
  if (!backgroundAudio) return;

  const savedPosition = Number.parseFloat(localStorage.getItem(audioPositionKey));
  if (Number.isFinite(savedPosition) && savedPosition >= 0 && savedPosition < backgroundAudio.duration) {
    backgroundAudio.currentTime = savedPosition;
  }
}

function saveAudioPosition() {
  if (!backgroundAudio || !Number.isFinite(backgroundAudio.currentTime)) return;
  localStorage.setItem(audioPositionKey, String(backgroundAudio.currentTime));
}

function playAudio() {
  if (!backgroundAudio) return;

  backgroundAudio.volume = 0.18;
  backgroundAudio.play().then(() => {
    audioOn = true;
    if (audioToggle) {
      audioToggle.querySelector('.audio-icon').textContent = '♫';
    }
  }).catch(() => {
    audioOn = false;
  });
}

function stopAudio() {
  if (!backgroundAudio) return;
  backgroundAudio.pause();
  audioOn = false;
  if (audioToggle) {
    audioToggle.querySelector('.audio-icon').textContent = '♪';
  }
}

if (backgroundAudio) {
  if (backgroundAudio.readyState >= 1) {
    restoreAudioPosition();
  } else {
    backgroundAudio.addEventListener('loadedmetadata', restoreAudioPosition, { once: true });
  }

  backgroundAudio.addEventListener('timeupdate', saveAudioPosition);
}

playAudio();

window.addEventListener('pagehide', () => {
  saveAudioPosition();
  stopAudio();
});

if (audioToggle) {
  audioToggle.addEventListener('click', () => {
    if (!audioOn) {
      playAudio();
    } else {
      stopAudio();
    }
  });
}

