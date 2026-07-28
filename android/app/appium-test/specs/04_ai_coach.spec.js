import AiCoachPage from '../pageobjects/AiCoachPage.js';

describe('Appium E2E Suite - 04: AI Focus Coach & OpenRouter Assistant', () => {
  it('TC-COACH-001: Should send prompt to AI coach and render response bubble', async () => {
    await AiCoachPage.sendMessage('How can I eliminate distractions while studying?');
    const messages = await AiCoachPage.chatMessages;
    expect(messages.length).toBeGreaterThan(0);
  });
});
