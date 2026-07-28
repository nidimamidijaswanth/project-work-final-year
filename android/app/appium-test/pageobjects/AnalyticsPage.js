import Page from './Page.js';

class AnalyticsPage extends Page {
  get streakCounter() { return $('.streak-badge, .streak-count'); }
  get focusTimeChart() { return $('.focus-analytics-chart, canvas'); }
  get sessionHistoryRows() { return $$('.history-item-row'); }
  get exportDataBtn() { return $('button*=Export'); }

  async getStreakCount() {
    const text = await this.streakCounter.getText();
    return parseInt(text.replace(/\D/g, ''), 10) || 0;
  }
}

export default new AnalyticsPage();
