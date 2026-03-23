/**
 * App logic for Allah's Names — Lesson Viewer
 */
(function () {
  const grid = document.getElementById('episodesGrid');
  const searchInput = document.getElementById('searchInput');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalVideo = document.getElementById('modalVideo');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalLessons = document.getElementById('modalLessons');
  const themeToggle = document.getElementById('themeToggle');

  // Theme toggle
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') document.documentElement.classList.add('light');
  function updateToggleIcon() {
    themeToggle.innerHTML = document.documentElement.classList.contains('light') ? '&#9728;' : '&#9790;';
  }
  updateToggleIcon();
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
    updateToggleIcon();
  });

  // Render all episode cards
  function renderEpisodes(filter = '') {
    const lowerFilter = filter.toLowerCase();
    const filtered = EPISODES.filter(ep =>
      ep.title.toLowerCase().includes(lowerFilter) ||
      ep.lessons.some(l => l.toLowerCase().includes(lowerFilter)) ||
      ep.ep.toLowerCase().includes(lowerFilter)
    );

    grid.innerHTML = filtered.map((ep, i) => `
      <article class="episode-card" data-index="${EPISODES.indexOf(ep)}" tabindex="0" role="button"
              aria-label="Open ${ep.title}">
        <div class="episode-card-thumb">
          <img src="https://img.youtube.com/vi/${ep.videoId}/mqdefault.jpg"
               alt="${ep.title}" loading="lazy">
          <div class="play-icon"></div>
        </div>
        <div class="episode-card-body">
          <span class="ep-badge">${ep.ep}</span>
          <h3>${ep.title}</h3>
          <p class="lesson-preview">${ep.lessons[0] || ''}</p>
        </div>
      </article>
    `).join('');

    // Attach click listeners
    grid.querySelectorAll('.episode-card').forEach(card => {
      card.addEventListener('click', () => openModal(Number(card.dataset.index)));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter') openModal(Number(card.dataset.index));
      });
    });
  }

  // Open modal with episode details
  function openModal(index) {
    const ep = EPISODES[index];
    if (!ep) return;

    modalBadge.textContent = ep.ep;
    modalTitle.textContent = ep.title;
    modalVideo.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${ep.videoId}?rel=0"
              title="${ep.title}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>`;

    let lessonsHTML = '<h3>Key Lessons</h3><ul>';
    ep.lessons.forEach(lesson => {
      lessonsHTML += `<li>${lesson}</li>`;
    });
    lessonsHTML += '</ul>';
    modalLessons.innerHTML = lessonsHTML;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    modalOverlay.classList.remove('active');
    modalVideo.innerHTML = '';
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Search
  searchInput.addEventListener('input', e => {
    renderEpisodes(e.target.value);
  });

  // Initial render
  renderEpisodes();
})();
