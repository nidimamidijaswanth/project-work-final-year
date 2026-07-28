const academicWords = ['assignment', 'exam', 'test', 'deadline', 'class', 'lecture', 'quiz', 'mentor', 'teacher', 'college'];
const socialWords = ['instagram', 'reel', 'whatsapp', 'snap', 'chat', 'meme', 'youtube', 'shorts', 'game', 'gaming', 'discord'];

export function buildFocusPlan(user = {}) {
  const hours = Number(user.dailyFocusHours || user.daily_focus_hours || 4);
  const examType = user.examType || user.exam_type || 'Academic goals';
  const studyGoal = user.studyGoal || user.study_goal || 'Complete today study plan';
  const studyWindow = user.studyWindow || user.study_window || 'your best study window';
  const distraction = user.biggestDistraction || user.biggest_distraction || 'social apps';
  const intense = hours >= 6 || /jee|neet|gate|upsc|cat|exam|placement|interview/i.test(examType);
  const socialHeavy = socialWords.some((word) => distraction.toLowerCase().includes(word));

  const focusScore = Math.min(98, 80 + hours * 2 + (intense ? 6 : 0) + (socialHeavy ? 2 : 0));
  const blockedAlerts = socialHeavy ? 24 + hours * 3 : 15 + hours * 2;
  const breakCount = Math.max(2, Math.ceil(hours * (intense ? 1 : 0.75)));

  return {
    mode: intense ? 'Exam Sprint' : 'Deep Work',
    focusScore,
    blockedAlerts,
    priorityAccuracy: intense ? 98 : 94,
    breakCount,
    blockLength: intense ? 50 : 40,
    breakLength: intense ? 10 : 8,
    studyGoal,
    examType,
    studyWindow,
    biggestDistraction: distraction,
    allowedAlerts: [`${examType} deadlines`, 'calendar reminders', 'teacher or mentor messages'],
    mutedSources: [distraction, 'low-priority social apps', 'promotional notifications'],
    recommendation: socialHeavy
      ? `Protect ${studyWindow}. Batch ${distraction} until breaks, and allow only ${examType} deadlines during focus blocks.`
      : `Use a ${hours}-hour target with ${intense ? 'exam sprint' : 'deep work'} blocks. Review summaries after each break.`,
    resetRitual: socialHeavy ? 'Phone away, 2-minute breathing, restart timer' : 'Stand, water, one-page recap',
  };
}

export function analyzeNotification({ appName = 'Unknown app', message = '', context = 'Deep Work' }, user = {}) {
  const plan = buildFocusPlan(user);
  const text = `${appName} ${message}`.toLowerCase();
  const academic = academicWords.some((word) => text.includes(word)) || text.includes(plan.examType.toLowerCase());
  const distracting = socialWords.some((word) => text.includes(word)) || text.includes(plan.biggestDistraction.toLowerCase());
  const urgent = /urgent|today|tomorrow|due|deadline|starts|exam|test/i.test(message);

  let priority = 'medium';
  let decision = 'summarize';
  let importance = 62;
  let interruptionCost = context === 'Exam Sprint' ? 84 : 70;

  if (academic && urgent) {
    priority = 'urgent';
    decision = 'allow';
    importance = 96;
    interruptionCost = 18;
  } else if (academic) {
    priority = 'high';
    decision = 'summarize';
    importance = 82;
    interruptionCost = 35;
  } else if (distracting) {
    priority = 'low';
    decision = context === 'Break' ? 'summarize' : 'batch';
    importance = 26;
    interruptionCost = 91;
  }

  return {
    appName,
    message,
    context,
    priority,
    decision,
    importance,
    interruptionCost,
    suggestedAction:
      decision === 'allow'
        ? 'Show immediately with a deadline badge.'
        : decision === 'batch'
          ? `Hold until the next ${plan.breakLength}-minute break.`
          : 'Convert into a short focus-safe summary.',
  };
}

export function buildInsights({ plan, sessions = [], notifications = [] }) {
  const completedSessions = sessions.filter((session) => session.ended_at || session.endedAt);
  const avgScore =
    sessions.length > 0
      ? Math.round(sessions.reduce((sum, session) => sum + Number(session.focus_score || session.focusScore || plan.focusScore), 0) / sessions.length)
      : plan.focusScore;
  const blockedTotal = notifications.filter((item) => ['batch', 'mute', 'summarize'].includes(item.decision)).length + plan.blockedAlerts;

  return {
    averageFocusScore: avgScore,
    completedSessions: completedSessions.length,
    notificationsManaged: notifications.length,
    blockedTotal,
    bestMode: plan.mode,
    recoveryTime: plan.blockLength >= 50 ? '6m' : '4m',
    weeklyRhythm: [72, 80, avgScore - 8, avgScore, avgScore - 3, avgScore + 2, avgScore - 5].map((value) =>
      Math.max(45, Math.min(99, value)),
    ),
  };
}

