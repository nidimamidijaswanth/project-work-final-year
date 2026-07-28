import Page from './Page.js';

class AiCoachPage extends Page {
  get chatInput() { return $('textarea.coach-input, input[placeholder*="Ask Focus Coach" i]'); }
  get sendBtn() { return $('button[type="submit"].send-coach-btn'); }
  get chatMessages() { return $$('.chat-message-bubble'); }
  get quickSuggestionChips() { return $$('.suggestion-chip'); }

  async sendMessage(message) {
    await this.chatInput.setValue(message);
    await this.sendBtn.click();
  }

  async clickChip(index = 0) {
    const chips = await this.quickSuggestionChips;
    if (chips.length > index) {
      await chips[index].click();
    }
  }
}

export default new AiCoachPage();
