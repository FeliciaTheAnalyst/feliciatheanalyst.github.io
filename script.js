(() => {
  const intro = document.getElementById('intro');
  const portfolio = document.getElementById('portfolio');
  const enterButton = document.getElementById('enterPortfolio');
  const skipButton = document.getElementById('skipIntro');
  let introFinished = false;
  document.body.classList.add('intro-active');

  function revealPortfolio() {
    if (introFinished) return;
    introFinished = true;
    intro.classList.add('intro-leaving');
    portfolio.classList.remove('is-hidden');
    portfolio.classList.add('portfolio-visible');
    document.body.classList.remove('intro-active');
    window.setTimeout(() => { intro.hidden = true; }, 950);
  }
  enterButton.addEventListener('click', revealPortfolio);
  skipButton.addEventListener('click', revealPortfolio);
  window.setTimeout(revealPortfolio, 6500);

  // Mobile navigation
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));
  document.getElementById('year').textContent = new Date().getFullYear();

  // Project carousel: one featured card with neighboring cards peeking into view.
  const track = document.getElementById('projectTrack');
  const cards = [...track.querySelectorAll('.project-card')];
  const dots = document.getElementById('carouselDots');
  const counter = document.getElementById('projectCounter');
  let activeIndex = 0;
  let startX = null;
  cards.forEach((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show project ${index + 1}`);
    dot.addEventListener('click', () => goToProject(index));
    dots.appendChild(dot);
    card.addEventListener('click', (event) => {
      if (event.target.closest('a,button')) return;
      goToProject(index);
    });
  });
  function goToProject(index) {
    activeIndex = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === activeIndex);
      card.setAttribute('aria-current', i === activeIndex ? 'true' : 'false');
    });
    [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    const firstCard = cards[0];
    const cardStyle = getComputedStyle(track);
    const gap = parseFloat(cardStyle.columnGap || cardStyle.gap) || 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const stageWidth = document.getElementById('projectStage').getBoundingClientRect().width;
    const maxTranslate = Math.max(0, track.scrollWidth - stageWidth);
    const ideal = activeIndex * (cardWidth + gap) - (stageWidth - cardWidth) / 2;
    const translate = Math.max(0, Math.min(maxTranslate, ideal));
    track.style.transform = `translateX(${-translate}px)`;
  }
  document.getElementById('prevProject').addEventListener('click', () => goToProject(activeIndex - 1));
  document.getElementById('nextProject').addEventListener('click', () => goToProject(activeIndex + 1));
  track.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) goToProject(activeIndex + (dx < 0 ? 1 : -1));
    startX = null;
  }, {passive:true});
  window.addEventListener('resize', () => goToProject(activeIndex));

  goToProject(0);

  // Gentle pointer-driven depth on the active project card only.
  // It is disabled on touch devices and when reduced motion is requested.
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canTilt) {
    cards.forEach(card => {
      card.addEventListener('pointermove', event => {
        if (!card.classList.contains('is-active')) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 3.5;
        const rotateX = (0.5 - y) * 3.5;
        card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }


  // Assistant panel controls
  const panel = document.getElementById('assistantPanel');
  const launcher = document.getElementById('assistantLauncher');
  const messages = document.getElementById('assistantMessages');
  const input = document.getElementById('assistantInput');
  function openAssistant() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    input.focus();
  }
  function closeAssistant() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
  launcher.addEventListener('click', () => panel.classList.contains('open') ? closeAssistant() : openAssistant());
  document.getElementById('closeAssistant').addEventListener('click', closeAssistant);
  document.querySelectorAll('[data-open-assistant]').forEach(button => button.addEventListener('click', openAssistant));
  document.querySelectorAll('.quick-questions button').forEach(button => button.addEventListener('click', () => askQuestion(button.textContent)));
  document.getElementById('assistantForm').addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    askQuestion(question);
    input.value = '';
  });
  function addMessage(text, type) {
    const message = document.createElement('div');
    message.className = `assistant-message ${type === 'user' ? 'user-message' : 'bot-message'}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }
  function answerFor(question) {
    const q = question.toLowerCase();
    if (/project|work|portfolio|dashboard/.test(q)) return 'Felicia features six project areas: Data Quality & Data Governance, Power BI, SQL, Excel, Tableau, and the Dear Sis Data Assistant. Use the project carousel to open each collection.';
    if (/skill|tool|technology|technical/.test(q)) return 'Her toolkit includes Power BI, Excel, Tableau, SQL, Salesforce, SAP, HTML/CSS, JavaScript, Java, Visual Studio Code, AI agent development and portfolio web design. Her focus areas include data quality, governance, analytics and reporting.';
    if (/contact|email|reach|connect|linkedin/.test(q)) return 'You can email Felicia at liciaanalyst@gmail.com, connect on LinkedIn at linkedin.com/in/feliciaanalyst, or explore her GitHub portfolio. Use the contact section for direct links.';
    if (/experience|career|background|work history/.test(q)) return 'Felicia has worked in data operations, data quality and governance, and systems administration/data analysis. Her portfolio lists roles at PeopleTree Group, PNet/CareerJunction, and SA Digital Villages.';
    if (/location|where|south africa|johannesburg|cape town/.test(q)) return 'Felicia is based in South Africa and lists Johannesburg and Cape Town as her locations.';
    if (/ai|assistant|javascript|develop/.test(q)) return 'The Dear Sis Data Assistant is a portfolio chatbot developed with JavaScript, HTML and CSS. It is designed to answer questions about Felicia’s skills, experience and projects.';
    if (/hire|job|opportunit|recruit/.test(q)) return 'For job opportunities or collaboration, please contact Felicia at liciaanalyst@gmail.com or connect via LinkedIn. You can also explore her projects to see her work.';
    if (/governance|quality/.test(q)) return 'Felicia’s Data Quality & Data Governance project presents a framework for data quality and governance. Open the first project card to view it.';
    return 'I can help you explore Felicia’s projects, skills, professional background, AI assistant, location or contact details. Try asking about one of those topics.';
  }
  function askQuestion(question) {
    addMessage(question, 'user');
    window.setTimeout(() => addMessage(answerFor(question), 'bot'), 280);
  }
})();
