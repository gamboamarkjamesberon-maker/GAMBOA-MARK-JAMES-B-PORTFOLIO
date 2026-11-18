document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const tplButtons = document.querySelectorAll('.tpl-btn');

  // 1. 3 Gaming Hero Background Templates State
  let currentTemplate = localStorage.getItem('mj-gaming-hero-tpl') || 'mlbb-hero';
  setTemplate(currentTemplate);

  function setTemplate(tpl) {
    currentTemplate = tpl;
    htmlEl.setAttribute('data-bg-template', tpl);
    localStorage.setItem('mj-gaming-hero-tpl', tpl);

    tplButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.template === tpl);
    });
  }

  tplButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setTemplate(btn.dataset.template);
    });
  });

  // 2. Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${pct}%`;
  });

  // =========================================================
  // 3. CURSOR-FOLLOWING GAMING HEROES ENGINE (MLBB, MINECRAFT, ROBLOX)
  // =========================================================
  const canvas = document.getElementById('interactiveBgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width * 0.5,
      y: height * 0.42,
      down: false
    };

    const projectiles = [];
    const shockwaves = [];
    let tick = 0;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      mouse.down = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      shockwaves.push({ x: e.clientX, y: e.clientY, r: 12, alpha: 1 });
      triggerHeroUltimate();
    });

    window.addEventListener('mouseup', () => {
      mouse.down = false;
    });

    // Squad of 6 Gaming Heroes that chase, orbit, and aim at your cursor!
    const squad = [
      { id: 0, angleOffset: 0, orbitR: 135, speed: 0.055, x: width * 0.2, y: height * 0.3, scale: 1.05 },
      { id: 1, angleOffset: (Math.PI * 2) / 3, orbitR: 165, speed: 0.042, x: width * 0.8, y: height * 0.3, scale: 1.0 },
      { id: 2, angleOffset: (Math.PI * 4) / 3, orbitR: 150, speed: 0.048, x: width * 0.5, y: height * 0.8, scale: 1.0 },
      { id: 3, angleOffset: Math.PI / 3, orbitR: 245, speed: 0.032, x: width * 0.15, y: height * 0.75, scale: 0.85 },
      { id: 4, angleOffset: Math.PI, orbitR: 265, speed: 0.028, x: width * 0.85, y: height * 0.75, scale: 0.85 },
      { id: 5, angleOffset: (Math.PI * 5) / 3, orbitR: 255, speed: 0.035, x: width * 0.5, y: height * 0.15, scale: 0.85 }
    ];

    function triggerHeroUltimate() {
      squad.forEach((hero) => {
        const angle = Math.atan2(mouse.y - hero.y, mouse.x - hero.x);
        projectiles.push({
          x: hero.x,
          y: hero.y,
          vx: Math.cos(angle) * 11,
          vy: Math.sin(angle) * 11,
          angle,
          life: 1.0,
          type: currentTemplate,
          heroId: hero.id % 3
        });
      });
    }

    // --- CUSTOM VECTOR SPRITE RENDERERS FOR REAL GAMING HEROES ---

    // 1. MLBB HEROES: Gusion (Daggers), Ling (Cyan Sword), Layla (Malefic Cannon)
    function drawMlbbHero(ctx, type, bob, aimAngle, isUlt) {
      // Mythic Magic Circle under Hero
      ctx.save();
      ctx.strokeStyle = type === 0 ? 'rgba(56, 189, 248, 0.55)' : type === 1 ? 'rgba(34, 211, 238, 0.55)' : 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(0, 26, 22, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Flowing Hero Cape
      ctx.fillStyle = type === 0 ? '#1e3a8a' : type === 1 ? '#0e7490' : '#92400e';
      ctx.beginPath();
      ctx.moveTo(-10, -4 + bob);
      ctx.lineTo(-22, 22 + bob * 1.4);
      ctx.lineTo(14, 20 + bob);
      ctx.lineTo(10, -4 + bob);
      ctx.closePath();
      ctx.fill();

      // Armor Body
      ctx.fillStyle = type === 0 ? '#0f172a' : type === 1 ? '#164e63' : '#1e293b';
      ctx.beginPath();
      ctx.roundRect(-11, -6 + bob, 22, 24, 6);
      ctx.fill();
      ctx.strokeStyle = type === 2 ? '#fbbf24' : '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing Core Chestplate
      ctx.fillStyle = type === 2 ? '#fbbf24' : '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -1 + bob);
      ctx.lineTo(5, 5 + bob);
      ctx.lineTo(0, 11 + bob);
      ctx.lineTo(-5, 5 + bob);
      ctx.closePath();
      ctx.fill();

      // Hero Head
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(0, -16 + bob, 9.5, 0, Math.PI * 2);
      ctx.fill();

      // Anime Hero Hair & Eyes
      if (type === 0) {
        // GUSION: Spiky Brown Hair + Glowing Blue Eyes
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(-11, -17 + bob);
        ctx.lineTo(-7, -29 + bob);
        ctx.lineTo(-1, -24 + bob);
        ctx.lineTo(4, -30 + bob);
        ctx.lineTo(11, -17 + bob);
        ctx.closePath();
        ctx.fill();
      } else if (type === 1) {
        // LING: White/Cyan Assassin Hair + Ponytail
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(0, -19 + bob, 10, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-8, -22 + bob);
        ctx.lineTo(-22, -14 + bob * 1.5);
        ctx.lineTo(-10, -15 + bob);
        ctx.fill();
      } else {
        // LAYLA: Golden Twin-Tails
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, -19 + bob, 10, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-14, -18 + bob, 5, 18);
        ctx.fillRect(9, -18 + bob, 5, 18);
      }

      // Glowing Eyes
      ctx.fillStyle = type === 2 ? '#f59e0b' : '#38bdf8';
      ctx.fillRect(2, -17 + bob, 3, 2.5);

      // WEAPON ROTATING TOWARD CURSOR!
      ctx.save();
      ctx.translate(0, 4 + bob);
      ctx.rotate(aimAngle);

      if (type === 0) {
        // Gusion Glowing Magic Daggers
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(12, -4);
        ctx.lineTo(30, 0);
        ctx.lineTo(12, 4);
        ctx.closePath();
        ctx.fill();
      } else if (type === 1) {
        // Ling Cyan Tempest Blade
        ctx.strokeStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(36, -6);
        ctx.stroke();
      } else {
        // Layla Malefic Energy Cannon
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.fillRect(8, -5, 26, 10);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(30, -3, 6, 6);
      }
      ctx.restore();
    }

    // 2. MINECRAFT HEROES: Steve (Diamond Sword), Creeper, Enderman
    function drawMinecraftHero(ctx, type, bob, aimAngle) {
      if (type === 0) {
        // STEVE WITH DIAMOND SWORD
        // Legs
        ctx.fillStyle = '#312e81';
        ctx.fillRect(-8, 12 + bob, 7, 14);
        ctx.fillRect(1, 12 + bob, 7, 14);
        // Cyan Shirt Torso
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(-9, -4 + bob, 18, 16);
        // Steve Head
        ctx.fillStyle = '#d97706';
        ctx.fillRect(-9, -22 + bob, 18, 18);
        // Hair & Eyes
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-9, -22 + bob, 18, 5);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-6, -14 + bob, 4, 3);
        ctx.fillRect(2, -14 + bob, 4, 3);
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(-4, -14 + bob, 2, 3);
        ctx.fillRect(2, -14 + bob, 2, 3);

        // Diamond Sword aiming at cursor
        ctx.save();
        ctx.translate(6, 2 + bob);
        ctx.rotate(aimAngle);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, -2, 8, 4);
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 10;
        ctx.fillRect(8, -3, 22, 6);
        ctx.restore();
      } else if (type === 1) {
        // CREEPER
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 1.5;
        // Feet
        ctx.fillRect(-10, 14 + bob, 8, 10);
        ctx.fillRect(2, 14 + bob, 8, 10);
        // Body
        ctx.fillRect(-7, -4 + bob, 14, 18);
        // Head
        ctx.fillRect(-10, -22 + bob, 20, 18);
        ctx.strokeRect(-10, -22 + bob, 20, 18);
        // Iconic Creeper Face
        ctx.fillStyle = '#052e16';
        ctx.fillRect(-6, -17 + bob, 4, 4);
        ctx.fillRect(2, -17 + bob, 4, 4);
        ctx.fillRect(-3, -13 + bob, 6, 4);
        ctx.fillRect(-5, -10 + bob, 3, 5);
        ctx.fillRect(2, -10 + bob, 3, 5);
      } else {
        // ENDERMAN (Holding Grass Block)
        ctx.fillStyle = '#09090b';
        ctx.fillRect(-6, 10 + bob, 4, 18);
        ctx.fillRect(2, 10 + bob, 4, 18);
        ctx.fillRect(-7, -6 + bob, 14, 16);
        ctx.fillRect(-8, -22 + bob, 16, 16);
        // Glowing Purple Eyes
        ctx.fillStyle = '#d946ef';
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 8;
        ctx.fillRect(-6, -15 + bob, 5, 2.5);
        ctx.fillRect(1, -15 + bob, 5, 2.5);
        ctx.shadowBlur = 0;
        // Held Grass Block
        ctx.fillStyle = '#78350f';
        ctx.fillRect(8, -4 + bob, 12, 12);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(8, -4 + bob, 12, 4);
      }
    }

    // 3. ROBLOX AVATARS: Classic Noob, Bacon Hair, Neon Korblox Knight
    function drawRobloxHero(ctx, type, bob, aimAngle) {
      // Blocky Roblox Legs
      ctx.fillStyle = type === 0 ? '#22c55e' : type === 1 ? '#1e293b' : '#0f172a';
      ctx.fillRect(-9, 10 + bob, 8, 15);
      ctx.fillRect(1, 10 + bob, 8, 15);

      // Blocky Roblox Torso
      ctx.fillStyle = type === 0 ? '#3b82f6' : type === 1 ? '#334155' : '#f43f5e';
      ctx.fillRect(-10, -6 + bob, 20, 16);

      // Roblox Cylinder/Rounded-Square Head
      ctx.fillStyle = type === 0 ? '#facc15' : '#fde68a';
      ctx.beginPath();
      ctx.roundRect(-8, -22 + bob, 16, 15, 4);
      ctx.fill();

      // Classic Roblox Smile Face :)
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.arc(-3, -16 + bob, 1.5, 0, Math.PI * 2);
      ctx.arc(3, -16 + bob, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -13 + bob, 3.5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Hair / Hat
      if (type === 1) {
        // Bacon Hair
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-9, -25 + bob, 18, 6);
        ctx.fillRect(-10, -22 + bob, 4, 8);
        ctx.fillRect(6, -22 + bob, 4, 8);
      } else if (type === 2) {
        // Neon Dominus Hood
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2.2;
        ctx.strokeRect(-10, -24 + bob, 20, 18);
      }

      // Roblox Laser Blox Blaster aiming at cursor
      ctx.save();
      ctx.translate(6, 1 + bob);
      ctx.rotate(aimAngle);
      ctx.fillStyle = type === 2 ? '#00f2fe' : '#f43f5e';
      ctx.shadowColor = type === 2 ? '#00f2fe' : '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.fillRect(4, -4, 20, 8);
      ctx.restore();
    }

    function renderLoop() {
      tick += 0.05;
      ctx.clearRect(0, 0, width, height);

      // Cursor Target Reticle
      ctx.save();
      ctx.translate(mouse.x, mouse.y);
      ctx.rotate(tick * 0.7);
      ctx.strokeStyle =
        currentTemplate === 'mlbb-hero'
          ? 'rgba(251, 191, 36, 0.65)'
          : currentTemplate === 'mc-hero'
          ? 'rgba(74, 222, 128, 0.65)'
          : 'rgba(0, 242, 254, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-32, 0); ctx.lineTo(-16, 0);
      ctx.moveTo(16, 0); ctx.lineTo(32, 0);
      ctx.moveTo(0, -32); ctx.lineTo(0, -16);
      ctx.moveTo(0, 16); ctx.lineTo(0, 32);
      ctx.stroke();
      ctx.restore();

      // Update & Draw Squad of Gaming Heroes Following Cursor!
      squad.forEach((hero, idx) => {
        const orbitAngle = tick * 0.65 + hero.angleOffset;
        const radius = mouse.down ? hero.orbitR * 0.65 : hero.orbitR;
        const targetX = mouse.x + Math.cos(orbitAngle) * radius;
        const targetY = mouse.y + Math.sin(orbitAngle) * (radius * 0.68);

        // Smooth magnetic follow toward cursor
        hero.x += (targetX - hero.x) * hero.speed;
        hero.y += (targetY - hero.y) * hero.speed;

        const aimAngle = Math.atan2(mouse.y - hero.y, mouse.x - hero.x);
        const bob = Math.sin(tick * 2.2 + idx) * 4;
        const facingLeft = mouse.x < hero.x;

        // Energy Tether Line to Cursor
        ctx.beginPath();
        ctx.moveTo(hero.x, hero.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle =
          currentTemplate === 'mlbb-hero'
            ? 'rgba(56, 189, 248, 0.14)'
            : currentTemplate === 'mc-hero'
            ? 'rgba(74, 222, 128, 0.14)'
            : 'rgba(244, 63, 94, 0.14)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.translate(hero.x, hero.y);
        ctx.scale(hero.scale, hero.scale);

        // Flip sprite horizontally if cursor is to the left, but keep weapon aimed accurately
        if (facingLeft) {
          ctx.scale(-1, 1);
        }
        const localAim = facingLeft ? Math.PI - aimAngle : aimAngle;

        if (currentTemplate === 'mlbb-hero') {
          drawMlbbHero(ctx, hero.id % 3, bob, localAim, mouse.down);
        } else if (currentTemplate === 'mc-hero') {
          drawMinecraftHero(ctx, hero.id % 3, bob, localAim);
        } else {
          drawRobloxHero(ctx, hero.id % 3, bob, localAim);
        }

        ctx.restore();
      });

      // Draw Ultimate Projectiles Fired on Click
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) {
          projectiles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.life;
        ctx.fillStyle =
          p.type === 'mlbb-hero'
            ? '#fbbf24'
            : p.type === 'mc-hero'
            ? '#22d3ee'
            : '#00f2fe';
        ctx.fillRect(-10, -2.5, 20, 5);
        ctx.restore();
      }

      // Draw Click Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.r += 9;
        sw.alpha -= 0.03;
        if (sw.alpha <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }
        ctx.strokeStyle =
          currentTemplate === 'mlbb-hero'
            ? `rgba(251, 191, 36, ${sw.alpha})`
            : currentTemplate === 'mc-hero'
            ? `rgba(74, 222, 128, ${sw.alpha})`
            : `rgba(0, 242, 254, ${sw.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  // 4. Typing Effect in Hero
  const typingEl = document.getElementById('typingText');
  const phrases = [
    '1st Year IT Student @ Mindoro State University',
    'MLBB Mythic Squad · Minecraft · Roblox Heroes',
    'Aspiring Future Engineer · Calapan City',
    'C# & C Programming Certified (99%+ Score)'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!typingEl) return;
    const currentPhrase = phrases[phraseIdx];
    typingEl.textContent = currentPhrase.substring(0, charIdx);

    if (!isDeleting && charIdx < currentPhrase.length) {
      charIdx++;
      setTimeout(typeLoop, 55);
    } else if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
    } else if (isDeleting && charIdx > 0) {
      charIdx--;
      setTimeout(typeLoop, 30);
    } else {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 350);
    }
  }
  typeLoop();

  // 5. 3D Hover Tilt on Cards
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 6. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 7. Scroll Reveal
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((el) => observer.observe(el));

  // 8. Certificate Modal
  const certificates = {
    csharp: {
      badge: 'CODECHUM C# · VERIFIED',
      score: '99.8% · 1312/1315',
      subtitle: 'C# Programming 1 (1F3-ITC112-CSharp)',
      description:
        'has successfully completed C# Programming 1 in 1F3-ITC112-CSharp with a total score of 1312/1315 at Mindoro State University.',
      date: 'Nov. 8, 2026',
      id: '32405',
      rawScore: '1312 / 1315',
      url: 'https://minsu.codechum.com/certificates/32405'
    },
    clang: {
      badge: 'CODECHUM C · VERIFIED',
      score: '99.0% · 1352/1365',
      subtitle: 'C Programming 1 (1F3-ITC112)',
      description:
        'has successfully completed C Programming 1 in 1F3-ITC112 with a total score of 1352/1365 at Mindoro State University.',
      date: 'Nov. 8, 2026',
      id: '32362',
      rawScore: '1352 / 1365',
      url: 'https://minsu.codechum.com/certificates/32362'
    }
  };

  const modal = document.getElementById('certModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');

  function openCertModal(key) {
    const data = certificates[key];
    if (!data || !modal) return;
    document.getElementById('modalBadge').textContent = data.badge;
    document.getElementById('modalScore').textContent = data.score;
    document.getElementById('modalSubtitle').textContent = data.subtitle;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalCertId').textContent = data.id;
    document.getElementById('modalRawScore').textContent = data.rawScore;
    document.getElementById('modalVerifyLink').href = data.url;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeCertModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.cert-card').forEach((card) => {
    card.addEventListener('click', () => openCertModal(card.dataset.cert));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCertModal(card.dataset.cert);
      }
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCertModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeCertModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeCertModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCertModal(); });

  // 9. Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        const original = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        setTimeout(() => { copyEmailBtn.textContent = original; }, 2000);
      } catch {
        copyEmailBtn.textContent = email;
      }
    });
  }

  // 10. Direct Email Sender
  const contactForm = document.getElementById('contactForm');
  const sendDirectBtn = document.getElementById('sendDirectBtn');
  const sendBtnText = document.getElementById('sendBtnText');
  const openMailAppBtn = document.getElementById('openMailAppBtn');
  const formFeedback = document.getElementById('formFeedback');

  function triggerMailto() {
    const name = document.getElementById('senderName').value.trim() || 'Portfolio Visitor';
    const senderEmail = document.getElementById('senderEmail').value.trim();
    const subjectInput = document.getElementById('senderSubject').value.trim() || `Portfolio Message from ${name}`;
    const message = document.getElementById('senderMessage').value.trim() || 'Hi MJ!';

    const subject = encodeURIComponent(subjectInput);
    const body = encodeURIComponent(
      `Hi Mark James (MJ),

${message}

---
From: ${name}${senderEmail ? ` (${senderEmail})` : ''}`
    );
    window.location.href = `mailto:gamboamarkjamesberon@gmail.com?subject=${subject}&body=${body}`;
  }

  if (openMailAppBtn) {
    openMailAppBtn.addEventListener('click', triggerMailto);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (sendDirectBtn) sendDirectBtn.disabled = true;
      if (sendBtnText) sendBtnText.textContent = 'Sending to MJ... ⏳';
      if (formFeedback) {
        formFeedback.className = 'form-feedback info';
        formFeedback.textContent = 'Dispatching message to gamboamarkjamesberon@gmail.com...';
      }

      try {
        const res = await fetch('https://formsubmit.co/ajax/gamboamarkjamesberon@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            _subject: `[Portfolio] ${subject}`,
            message
          })
        });

        if (res.ok) {
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = '✓ Message sent directly to MJ! (First-time use: click the one-time activation link sent to gamboamarkjamesberon@gmail.com).';
          }
          contactForm.reset();
        } else {
          throw new Error('Fallback to mailto');
        }
      } catch {
        if (formFeedback) {
          formFeedback.className = 'form-feedback info';
          formFeedback.textContent = 'Opening your email app so you can send the message directly...';
        }
        triggerMailto();
      } finally {
        if (sendDirectBtn) sendDirectBtn.disabled = false;
        if (sendBtnText) sendBtnText.textContent = "Send Direct to MJ's Inbox 🚀";
      }
    });
  }
});
