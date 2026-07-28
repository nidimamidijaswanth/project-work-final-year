import Page from './Page.js';

class FocusPage extends Page {
  get startSessionBtn() { return $('button*=Start'); }
  get pauseSessionBtn() { return $('button*=Pause'); }
  get resumeSessionBtn() { return $('button*=Resume'); }
  get endSessionBtn() { return $('button*=End'); }
  get timerDisplay() { return $('.timer-display, .focus-timer-clock'); }
  get focusScoreBadge() { return $('.focus-score, .score-badge'); }
  get duration25m() { return $('button*=25m'); }
  get duration45m() { return $('button*=45m'); }
  get duration60m() { return $('button*=60m'); }
  get modeDeepWork() { return $('button*=Deep Work'); }
  get modeStudy() { return $('button*=Study'); }

  async startFocusSession(duration = '25m', mode = 'Deep Work') {
    if (duration === '25m') await this.duration25m.click();
    else if (duration === '45m') await this.duration45m.click();
    else if (duration === '60m') await this.duration60m.click();

    await this.startSessionBtn.click();
  }

  async pauseSession() {
    await this.pauseSessionBtn.click();
  }

  async resumeSession() {
    await this.resumeSessionBtn.click();
  }

  async endSession() {
    await this.endSessionBtn.click();
  }
}

export default new FocusPage();
