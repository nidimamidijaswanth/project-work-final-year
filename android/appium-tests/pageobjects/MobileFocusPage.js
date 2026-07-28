import BasePage from './BasePage.js';

class MobileFocusPage extends BasePage {
  get startBtn() { return $('button*=Start'); }
  get pauseBtn() { return $('button*=Pause'); }
  get resumeBtn() { return $('button*=Resume'); }
  get endBtn() { return $('button*=End'); }
  get duration25m() { return $('button*=25m'); }

  async startFocusSession() {
    if (await this.duration25m.isDisplayed()) {
      await this.duration25m.click();
    }
    await this.startBtn.click();
  }
}

export default new MobileFocusPage();
