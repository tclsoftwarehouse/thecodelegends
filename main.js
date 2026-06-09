// ── NAV SCROLL ──
(function(){
  const nb = document.getElementById('nb');
  if(!nb) return;
  window.addEventListener('scroll', () => nb.classList.toggle('solid', scrollY > 50));
})();

// ── HAMBURGER ──
(function(){
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mobMenu');
  if(!ham || !mob) return;
  ham.addEventListener('click', () => {
    mob.classList.toggle('open');
    const s = ham.querySelectorAll('span');
    if(mob.classList.contains('open')) {
      s[0].style.transform='rotate(45deg) translate(5px,5px)';
      s[1].style.opacity='0';
      s[2].style.transform='rotate(-45deg) translate(5px,-5px)';
    } else { s[0].style.transform=''; s[1].style.opacity=''; s[2].style.transform=''; }
  });
})();

function cm() {
  const mob = document.getElementById('mobMenu');
  const ham = document.getElementById('ham');
  if(mob) mob.classList.remove('open');
  if(ham) { const s=ham.querySelectorAll('span'); s[0].style.transform=''; s[1].style.opacity=''; s[2].style.transform=''; }
}

// ── REVEAL ON SCROLL ──
(function(){
  const revs = document.querySelectorAll('.r');
  if(!revs.length) return;
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('on'); ro.unobserve(e.target); }});
  }, {threshold:.1});
  revs.forEach(r => ro.observe(r));
})();

// ── CONTACT FORM ──
function sf(event) {
  if (event) event.preventDefault();

  const n = document.getElementById('fn');
  const e = document.getElementById('fe');
  const w = document.getElementById('fw');
  const s = document.getElementById('fs');
  const m = document.getElementById('fm');
  const btn = document.getElementById('cfbtn');
  const msg = document.getElementById('cfmsg');

  if (!n || !e || !m || !btn || !msg) return;

  const name = n.value.trim();
  const email = e.value.trim();
  const whatsapp = w ? w.value.trim() : '';
  const service = s ? s.value : '';
  const message = m.value.trim();

  function showFeedback(text, type) {
    msg.style.display = 'block';
    msg.innerText = text;
    if (type === 'success') {
      msg.style.color = '#25D366';
      msg.style.borderColor = 'rgba(37, 211, 102, 0.4)';
      msg.style.background = 'rgba(37, 211, 102, 0.05)';
    } else {
      msg.style.color = '#ff4a4a';
      msg.style.borderColor = 'rgba(255, 74, 74, 0.4)';
      msg.style.background = 'rgba(255, 74, 74, 0.05)';
    }
  }

  // 1. Validation
  if (!name || !email || !message) {
    showFeedback('✦ Please fill in all required fields (Name, Email, and Project Details).', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFeedback('✦ Please enter a valid email address.', 'error');
    return;
  }

  // 2. Loading State
  btn.disabled = true;
  btn.innerText = 'Sending...';
  btn.style.opacity = '0.5';
  btn.style.cursor = 'not-allowed';
  msg.style.display = 'none';

  const form = document.getElementById('contact-form');

  // Fallback for file:// protocol (browsers block AJAX fetch due to CORS)
  if (window.location.protocol === 'file:') {
    console.log('File protocol detected, submitting form natively.');
    if (form) {
      form.onsubmit = null;
      form.submit();
      return;
    }
  }

  // 3. FormSubmit AJAX Call
  fetch('https://formsubmit.co/ajax/tclsoftwarehouse@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      whatsapp: whatsapp || 'Not provided',
      service: service || 'Not specified',
      message: message,
      _subject: 'New Project Inquiry from ' + name,
      _captcha: 'false'
    })
  })
  .then(res => {
    if (res.ok) return res.json();
    throw new Error('Submission failed');
  })
  .then(data => {
    showFeedback('✦ Message received! We\'ll be in touch within 24 hours.', 'success');
    // Clear inputs
    n.value = '';
    e.value = '';
    if (w) w.value = '';
    if (s) s.value = '';
    m.value = '';
  })
  .catch(err => {
    console.warn('AJAX submit failed, falling back to native form submit.', err);
    if (form) {
      form.onsubmit = null;
      form.submit();
    } else {
      showFeedback('✦ Failed to send message. Please try again or click the WhatsApp button below.', 'error');
    }
  })
  .finally(() => {
    // 4. Restore Button State (only reaches here if AJAX succeeded or both failed)
    btn.disabled = false;
    btn.innerText = 'Send Message →';
    btn.style.opacity = '';
    btn.style.cursor = '';
  });
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id==='#'||!id) return;
    const t = document.querySelector(id);
    if(t){ e.preventDefault(); cm(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

// ── WHATSAPP CHAT WIDGET ──
(function(){
  const launcher = document.getElementById('waLauncher');
  const panel    = document.getElementById('waPanel');
  const closeBtn = document.getElementById('waClose');
  if(!launcher || !panel) return;

  // Toggle panel on launcher click
  launcher.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Close on X button
  if(closeBtn) closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // Close when clicking outside widget
  document.addEventListener('click', e => {
    const widget = document.getElementById('waWidget');
    if(widget && !widget.contains(e.target)){
      panel.classList.remove('open');
    }
  });
})();

// ── WHATSAPP MESSAGE SENDER ──
function sendWaMsg(msg) {
  const base = 'https://wa.me/923203556596';
  const url  = msg ? base + '?text=' + encodeURIComponent('Hello TCL! ' + msg) : base;
  window.open(url, '_blank');
}
