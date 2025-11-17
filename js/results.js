(function () {
  const STORAGE_KEY_SCORES = 'diagnosticScores';

  function getScores() {
    const raw = localStorage.getItem(STORAGE_KEY_SCORES);
    if (!raw) {
      return {
        manic: 0,
        depressive: 0,
        hypomanic: 0,
        nondiagnostic: 0
      };
    }
    try {
      const parsed = JSON.parse(raw);
      return Object.assign(
        { manic: 0, depressive: 0, hypomanic: 0, nondiagnostic: 0 },
        parsed
      );
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

  const scores = getScores();
  const manic = scores.manic || 0;
  const depressive = scores.depressive || 0;
  const hypomanic = scores.hypomanic || 0;
  const nondiagnostic = scores.nondiagnostic || 0;

  const total = manic + depressive + hypomanic + nondiagnostic;

  const diagnosisTitleEl = document.getElementById('diagnosisTitle');
  const diagnosisDescriptionEl = document.getElementById('diagnosisDescription');

  let titleText = '';
  let descriptionText = '';

  if (total === 0) {
    // No data
    titleText = 'No data available';
    descriptionText =
      'We did not detect any choices from the story. Please return to the beginning and play through the scenarios to receive a diagnosis impression.';
  } else if (manic >= 3) {
    // Bipolar I
    titleText = 'Bipolar I';
    descriptionText =
      'You have been diagnosed with Bipolar I. The manic symptoms that perpetuated for a full week and impacted your daily life without depressive symptoms led to the diagnosis.';
  } else if (depressive >= 2 && hypomanic >= 2 && manic === 0) {
    // Bipolar II
    titleText = 'Bipolar II';
    descriptionText =
      'You have been diagnosed with Bipolar II. The perpetuation of depressive symptoms for two weeks and a minimum of four days with hypomanic symptoms along with no manic symptoms resulted in this diagnosis.';
  } else if (depressive >= 3 && manic === 0 && hypomanic === 0) {
    // Depression
    titleText = 'Depression';
    descriptionText =
      'You have been diagnosed with depression. The presence of depressive symptoms for a minimum of two weeks without hypomanic or manic symptoms gave rise to this diagnosis.';
  } else {
    // No diagnosis
    titleText = 'No diagnosis';
    descriptionText =
      'The criteria of Bipolar I and II and depression were not met, so no diagnosis was administered.';
  }

  if (diagnosisTitleEl) {
    diagnosisTitleEl.textContent = titleText;
  }
  if (diagnosisDescriptionEl) {
    diagnosisDescriptionEl.textContent = descriptionText;
  }

  // Table values

  function setCell(type, key, value) {
    const el = document.querySelector(`[data-type="${type}-${key}"]`);
    if (el) el.textContent = value;
  }

  ['manic', 'depressive', 'hypomanic', 'nondiagnostic'].forEach(type => {
    const count = scores[type] || 0;
    const percent = total ? Math.round((count / total) * 100) : 0;
    setCell(type, 'count', count);
    setCell(type, 'percent', percent + '%');
  });

  // Pie chart

  const chartCanvas = document.getElementById('resultsChart');
  if (chartCanvas && total > 0 && typeof Chart !== 'undefined') {
    const chart = new Chart(chartCanvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['Manic', 'Depressive', 'Hypomanic', 'Non-diagnostic'],
        datasets: [{
          data: [manic, depressive, hypomanic, nondiagnostic],
          backgroundColor: [
            '#f97316',
            '#6b7280',
            '#22c55e',
            '#3b82f6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    chartCanvas.parentElement.style.minHeight = '280px';
  } else if (chartCanvas && total === 0) {
    chartCanvas.parentElement.style.display = 'none';
  }
  localStorage.removeItem(STORAGE_KEY_SCORES);
  localStorage.removeItem('diagnosticHistory');
})();
