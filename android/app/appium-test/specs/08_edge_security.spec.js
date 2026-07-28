describe('Appium E2E Suite - 08: Edge Cases, Security & Resilience', () => {
  it('TC-EDGE-001: Should prevent XSS injection in input fields', async () => {
    const input = await $('input[type="email"]');
    if (await input.isDisplayed()) {
      await input.setValue('<script>alert("xss")</script>');
      expect(await input.getValue()).not.toContain('alert');
    }
  });
});
