(function () {
  const STORAGE_KEY_SCORES = 'diagnosticScores';
  const STORAGE_KEY_HISTORY = 'diagnosticHistory';

  function getScores() {
    const raw = localStorage.getItem(STORAGE_KEY_SCORES);
    if (!raw) {
      // Default structure
      return {
        manic: 0,
        depressive: 0,
        hypomanic: 0,
        nondiagnostic: 0
      };
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Could not parse diagnosticScores, resetting.', e);
      return {
        manic: 0,
        depressive: 0,
        hypomanic: 0,
        nondiagnostic: 0
      };
    }
  }

  function setScores(scores) {
    localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores));
  }

  function getHistory() {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Could not parse diagnosticHistory, resetting.', e);
      return [];
    }
  }

  function setHistory(history) {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }

  function recordChoice(type) {
    // update scores
    const scores = getScores();
    if (!Object.prototype.hasOwnProperty.call(scores, type)) {
      scores[type] = 0;
    }
    scores[type] += 1;
    setScores(scores);

    const history = getHistory();
    history.push({
      type: type,
      page: window.location.pathname,
      timestamp: Date.now()
    });
    setHistory(history);
  }

  function setupClickTracking() {
    const links = document.querySelectorAll('.optlink');
    links.forEach(link => {
      link.addEventListener('click', function () {
        const diagnosticType = this.getAttribute('data-diagnostic');
        if (diagnosticType) {
          recordChoice(diagnosticType);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', setupClickTracking);
})();
