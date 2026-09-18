/* ── VERY EASY TRUE STORIES · SHARED ENGINE ── */
/* The state, logic, and helpers used by every story file. */

const VETS = {
  state: {
    scored: {},    // qid -> {answer, correct, attempts, firstAttemptCorrect}
    predicted: {}, // qid -> answer text
    totalScored: 0,
    totalPredict: 0,
  },

  init(){
    // Count questions in the DOM
    this.state.totalScored = document.querySelectorAll('.question.scored').length;
    this.state.totalPredict = document.querySelectorAll('.question.predict').length;
    this.updateScorePill();
  },

  startStory(){
    const title = document.getElementById('title-page');
    if(title) title.style.display = 'none';
    this.goToPage(1);
  },

  goToPage(n){
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-'+n);
    if(target) target.classList.add('active');
    const results = document.getElementById('results');
    if(results) results.classList.remove('active');
    window.scrollTo({top:0, behavior:'smooth'});
  },

  // Try-again logic: wrong answer locks the wrong button but leaves the question open.
  // Score is based on FIRST attempt only.
  answerScored(btn, qid, choice){
    const q = btn.closest('.question');
    if(q.dataset.locked) return;

    const correct = q.dataset.correct;
    const isCorrect = (choice === correct);

    // Track attempts
    if(!this.state.scored[qid]){
      this.state.scored[qid] = {
        answer: choice,
        correct: isCorrect,
        attempts: 1,
        firstAttemptCorrect: isCorrect
      };
    } else {
      this.state.scored[qid].attempts++;
      this.state.scored[qid].answer = choice;
      this.state.scored[qid].correct = isCorrect;
    }

    if(isCorrect){
      btn.classList.add('correct');
      btn.disabled = true;
      // Lock the whole question
      q.dataset.locked = '1';
      q.querySelectorAll('.choice').forEach(b => b.disabled = true);

      const fb = document.getElementById('fb-'+qid);
      if(fb){
        fb.classList.remove('try-again');
        if(this.state.scored[qid].firstAttemptCorrect){
          fb.textContent = '✓ Correct!';
        } else {
          fb.textContent = '✓ Yes, that\'s right!';
        }
        fb.classList.add('show');
      }
      this.updateScorePill();
      this.checkPageComplete(q);
    } else {
      // Wrong: lock just this button, leave question open
      btn.classList.add('wrong');
      btn.disabled = true;
      const fb = document.getElementById('fb-'+qid);
      if(fb){
        fb.textContent = 'Try again. Choose another answer.';
        fb.classList.add('show','try-again');
      }
    }
  },

  answerPredict(btn, qid){
    const q = btn.closest('.question');
    if(q.dataset.locked) return;
    q.dataset.locked = '1';

    q.querySelectorAll('.choice').forEach(b => b.disabled = true);
    btn.classList.add('predicted');

    this.state.predicted[qid] = btn.textContent.trim();
    const fb = document.getElementById('fb-'+qid);
    if(fb) fb.classList.add('show');
    this.checkPageComplete(q);
  },

  updateScorePill(){
    // Score = # of questions where first attempt was correct
    const got = Object.values(this.state.scored).filter(s => s.firstAttemptCorrect).length;
    const completed = Object.values(this.state.scored).filter(s => s.correct).length;
    const pill = document.getElementById('score-pill');
    if(pill) pill.textContent = got + ' / ' + completed;
  },

  checkPageComplete(qEl){
    const page = qEl.closest('.page');
    if(!page) return;
    const allQs = page.querySelectorAll('.question');
    const allLocked = Array.from(allQs).every(q => q.dataset.locked === '1');
    if(allLocked){
      const pageNum = page.id.split('-')[1];
      const nextBtn = document.getElementById('next-' + pageNum);
      if(nextBtn) nextBtn.disabled = false;
    }
  },

  showResults(){
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const results = document.getElementById('results');
    if(!results) return;
    results.classList.add('active');

    const got = Object.values(this.state.scored).filter(s => s.firstAttemptCorrect).length;
    const total = this.state.totalScored;

    const scoreEl = document.getElementById('results-score');
    if(scoreEl) scoreEl.textContent = got + '/' + total;

    const predictCount = Object.keys(this.state.predicted).length;
    const pcEl = document.getElementById('predict-count');
    if(pcEl) pcEl.textContent = predictCount;

    let icon = '📖', h = 'Good Try!', sub = 'Read it again to remember more.';
    const pct = total > 0 ? got/total : 0;
    if(pct === 1){ icon = '🏆'; h = 'Perfect!'; sub = 'You got every question on the first try.'; }
    else if(pct >= 0.66){ icon = '⭐'; h = 'Great Job!'; sub = 'You understood most of the story.'; }

    const iconEl = document.getElementById('results-icon');
    const hEl = document.getElementById('results-h');
    const subEl = document.getElementById('results-sub');
    if(iconEl) iconEl.textContent = icon;
    if(hEl) hEl.textContent = h;
    if(subEl) subEl.textContent = sub;

    window.scrollTo({top:0, behavior:'smooth'});
  },

  restart(){
    this.state.scored = {};
    this.state.predicted = {};
    document.querySelectorAll('.question').forEach(q => {
      delete q.dataset.locked;
      q.querySelectorAll('.choice').forEach(b => {
        b.disabled = false;
        b.classList.remove('correct','wrong','predicted');
      });
      q.querySelectorAll('.q-feedback').forEach(f => {
        f.classList.remove('show','try-again');
        f.textContent = f.dataset.original || '';
      });
    });
    document.querySelectorAll('.next-btn').forEach(b => b.disabled = true);
    this.updateScorePill();
    document.getElementById('results').classList.remove('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const title = document.getElementById('title-page');
    if(title) title.style.display = 'block';
    window.scrollTo({top:0, behavior:'smooth'});
  }
};

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
  // Save original feedback text so restart can restore it
  document.querySelectorAll('.q-feedback').forEach(f => {
    f.dataset.original = f.textContent;
  });
  VETS.init();
});

// Expose handlers globally for inline onclick
window.startStory = () => VETS.startStory();
window.goToPage = (n) => VETS.goToPage(n);
window.answerScored = (btn, qid, choice) => VETS.answerScored(btn, qid, choice);
window.answerPredict = (btn, qid) => VETS.answerPredict(btn, qid);
window.showResults = () => VETS.showResults();
window.restart = () => VETS.restart();
