/**
 * EduSaarthi - Main Client Controller
 * Manages Low-Bandwidth Mode, Language Switching, Network State, and Toasts
 */

// Toast notification function
window.showToast = function (message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠️';
  if (type === 'error') icon = '✕';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // 2. Low-Bandwidth Mode Management
  const lowDataToggle = document.getElementById('low-data-toggle');
  const lowDataStatusPill = document.getElementById('low-data-status-pill');

  function setLowDataMode(enabled, notify = true) {
    if (enabled) {
      document.body.classList.add('low-data-mode');
      if (lowDataToggle) {
        lowDataToggle.classList.add('active');
        lowDataToggle.setAttribute('aria-pressed', 'true');
        const textSpan = lowDataToggle.querySelector('.toggle-text');
        if (textSpan) textSpan.textContent = 'Low Data: ON';
      }
      if (lowDataStatusPill) {
        lowDataStatusPill.className = 'status-badge low-data-active';
        lowDataStatusPill.innerHTML = '📶 Low Data: ON';
      }
      localStorage.setItem('lowDataMode', 'true');
      if (notify) showToast('Low Data Mode ON: Heavy media and animations reduced.', 'info');
    } else {
      document.body.classList.remove('low-data-mode');
      if (lowDataToggle) {
        lowDataToggle.classList.remove('active');
        lowDataToggle.setAttribute('aria-pressed', 'false');
        const textSpan = lowDataToggle.querySelector('.toggle-text');
        if (textSpan) textSpan.textContent = 'Low Data: OFF';
      }
      if (lowDataStatusPill) {
        lowDataStatusPill.className = 'status-badge';
        lowDataStatusPill.innerHTML = '📶 Normal Data';
      }
      localStorage.setItem('lowDataMode', 'false');
      if (notify) showToast('Normal Data Mode restored.', 'info');
    }

    // Persist to server session
    fetch('/auth/set-low-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled })
    }).catch(() => {});
  }

  // Check saved low data preference
  const savedLowData = localStorage.getItem('lowDataMode');
  if (savedLowData === 'true') {
    setLowDataMode(true, false);
  }

  if (lowDataToggle) {
    lowDataToggle.addEventListener('click', () => {
      const isCurrentlyActive = document.body.classList.contains('low-data-mode');
      setLowDataMode(!isCurrentlyActive, true);
    });
  }

  // 3. Online / Offline Network Status Detection
  const networkStatusPill = document.getElementById('network-status-pill');
  const offlineBanner = document.getElementById('offline-banner');

  function updateNetworkStatus() {
    const isOnline = navigator.onLine;
    if (networkStatusPill) {
      if (isOnline) {
        networkStatusPill.className = 'status-badge online';
        networkStatusPill.innerHTML = '✓ Online';
      } else {
        networkStatusPill.className = 'status-badge offline';
        networkStatusPill.innerHTML = '⚠️ Offline';
      }
    }

    if (offlineBanner) {
      if (isOnline) {
        offlineBanner.classList.remove('visible');
      } else {
        offlineBanner.classList.add('visible');
      }
    }
  }

  window.addEventListener('online', () => {
    updateNetworkStatus();
    showToast('Internet connection restored. Live features active.', 'success');
  });

  window.addEventListener('offline', () => {
    updateNetworkStatus();
    showToast("You're offline. Downloaded lessons are still available.", 'warning');
  });

  updateNetworkStatus();

  // 4. Multilingual Language Selector Handler
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', async () => {
      const selectedLang = langSelect.value;
      try {
        const res = await fetch('/auth/set-language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang: selectedLang })
        });
        if (res.ok) {
          const selectedText = langSelect.options[langSelect.selectedIndex].text;
          showToast(`Language set to ${selectedText}`, 'success');
          setTimeout(() => window.location.reload(), 250);
        }
      } catch (err) {
        console.error('Failed to change language:', err);
      }
    });
  }

  const langToggleBtn = document.getElementById('lang-toggle-btn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', async () => {
      const currentLang = langToggleBtn.dataset.currentLang || 'hi';
      const newLang = currentLang === 'hi' ? 'en' : 'hi';
      
      try {
        const res = await fetch('/auth/set-language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang: newLang })
        });
        if (res.ok) {
          showToast(newLang === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है।' : 'Language changed to English.', 'success');
          setTimeout(() => window.location.reload(), 250);
        }
      } catch (err) {
        console.error('Failed to change language:', err);
      }
    });
  }

  // 5. Interactive Mini-Quiz Checker
  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parentQuestion = btn.closest('.quiz-question-box');
      if (!parentQuestion) return;

      const correctIndex = parseInt(parentQuestion.dataset.correctIndex, 10);
      const chosenIndex = parseInt(btn.dataset.optionIndex, 10);
      const explanationBox = parentQuestion.querySelector('.quiz-explanation');

      // Disable further choices in this question
      parentQuestion.querySelectorAll('.quiz-option-btn').forEach(b => {
        b.disabled = true;
        b.classList.remove('selected-correct', 'selected-wrong');
      });

      if (chosenIndex === correctIndex) {
        btn.classList.add('selected-correct');
        btn.style.backgroundColor = '#D1FAE5';
        btn.style.borderColor = '#059669';
        btn.style.color = '#065F46';
        if (explanationBox) {
          explanationBox.style.display = 'block';
          explanationBox.classList.add('explanation-success');
        }
        showToast('Correct answer! Well done! 🎉', 'success');
      } else {
        btn.classList.add('selected-wrong');
        btn.style.backgroundColor = '#FEE2E2';
        btn.style.borderColor = '#DC2626';
        btn.style.color = '#991B1B';
        // Highlight correct one
        const correctBtn = parentQuestion.querySelector(`[data-option-index="${correctIndex}"]`);
        if (correctBtn) {
          correctBtn.style.backgroundColor = '#D1FAE5';
          correctBtn.style.borderColor = '#059669';
        }
        if (explanationBox) {
          explanationBox.style.display = 'block';
          explanationBox.classList.add('explanation-retry');
        }
        showToast('Review the explanation to strengthen your concept.', 'info');
      }
    });
  });
});
