/**
 * App logic for Allah's Names — Lesson Viewer
 */
(function () {
  const list = document.getElementById('episodesList');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalVideo = document.getElementById('modalVideo');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalLessons = document.getElementById('modalLessons');
  const modalDuas = document.getElementById('modalDuas');
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

  // Render all episodes as a list
  function renderEpisodes() {
    list.innerHTML = EPISODES.map((ep, i) => `
      <article class="episode-row" data-index="${i}" tabindex="0" role="button"
              aria-label="Open ${ep.title}">
        <div class="episode-row-thumb">
          <img src="https://img.youtube.com/vi/${ep.videoId}/mqdefault.jpg"
               alt="${ep.title}" loading="lazy">
          <div class="play-icon"></div>
        </div>
        <div class="episode-row-body">
          <span class="ep-badge">${ep.ep}</span>
          <h3>${ep.title}</h3>
          <p class="lesson-preview">${ep.lessons[0] || ''}</p>
        </div>
      </article>
    `).join('');

    list.querySelectorAll('.episode-row').forEach(row => {
      row.addEventListener('click', () => openModal(Number(row.dataset.index)));
      row.addEventListener('keydown', e => {
        if (e.key === 'Enter') openModal(Number(row.dataset.index));
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

    // Render duas if available
    if (ep.duas && ep.duas.length > 0) {
      let duasHTML = '<h3>Closing Prayers</h3><ul>';
      ep.duas.forEach(dua => {
        duasHTML += `<li>${dua}</li>`;
      });
      duasHTML += '</ul>';
      modalDuas.innerHTML = duasHTML;
    } else {
      modalDuas.innerHTML = '';
    }

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

  // Initial render
  renderEpisodes();
})();
