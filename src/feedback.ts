interface CoverageFeedback {
  sprite: string;
  message: string;
}

interface FeedbackRange {
  min: number;
  max: number;
  sprites: string[];
  messages: string[];
}

const FEEDBACK_RANGES: FeedbackRange[] = [
  {
    min: 0,
    max: 0,
    sprites: ['0.png'],
    messages: [
      "💀 Your code coverage is deader than a doornail! Time to write some tests!",
      "🔥 0% coverage? That's not testing, that's just wishful thinking!",
      "😱 No tests detected. Your code is running naked in production!"
    ]
  },
  {
    min: 1,
    max: 19,
    sprites: ['10.png'],
    messages: [
      "🤦‍♂️ Single digit coverage? Come on, you can do better than this!",
      "😬 Your tests are as rare as unicorns. Write more!",
      "🚨 This coverage level is giving me anxiety. Please test more!"
    ]
  },
  {
    min: 20,
    max: 39,
    sprites: ['30.png'],
    messages: [
      "😕 Getting warmer, but still pretty chilly in here. More tests needed!",
      "🌡️ Your coverage is like lukewarm coffee - not quite there yet.",
      "📈 Progress! But let's keep climbing that coverage mountain."
    ]
  },
  {
    min: 40,
    max: 59,
    sprites: ['40.png', '50.png'],
    messages: [
      "🤔 Half-way there! Your code is 50% protected, 50% vulnerable.",
      "⚖️ Balanced, as all things should be... but let's tip the scales toward more tests!",
      "🎯 You're in the zone! Keep pushing toward better coverage."
    ]
  },
  {
    min: 60,
    max: 79,
    sprites: ['60.png', '70.png'],
    messages: [
      "👍 Not bad! Your code is feeling more confident with each test.",
      "🚀 Good coverage! You're building trust with every test case.",
      "💪 Strong coverage game! Your future self will thank you."
    ]
  },
  {
    min: 80,
    max: 94,
    sprites: ['80.png', '90.png'],
    messages: [
      "🎉 Excellent coverage! Your code is well-protected and battle-tested.",
      "⭐ Outstanding! You're setting a great example for test-driven development.",
      "🏆 High-quality coverage! Your code confidence level is through the roof!"
    ]
  },
  {
    min: 95,
    max: 100,
    sprites: ['100.png'],
    messages: [
      "🥇 LEGENDARY! Your code coverage is absolutely pristine!",
      "👑 Coverage royalty! You've achieved testing nirvana.",
      "🚀 To infinity and beyond! Perfect coverage achieved, you testing wizard!"
    ]
  }
];

export function getCoverageFeedback(
  percentage: number, 
  githubContext?: { owner: string; repo: string; ref: string }
): CoverageFeedback {
  // Find the appropriate range
  const range = FEEDBACK_RANGES.find(r => percentage >= r.min && percentage <= r.max);
  
  if (!range) {
    // Fallback for unexpected values
    return {
      sprite: generateSpriteUrl('50.png', githubContext),
      message: "🤖 Coverage data processed! Keep up the good work!"
    };
  }

  // Randomly select sprite and message from the range
  const randomSprite = range.sprites[Math.floor(Math.random() * range.sprites.length)];
  const randomMessage = range.messages[Math.floor(Math.random() * range.messages.length)];

  return {
    sprite: generateSpriteUrl(randomSprite, githubContext),
    message: randomMessage
  };
}

function generateSpriteUrl(
  spriteFile: string,
  githubContext?: { owner: string; repo: string; ref: string }
): string {
  const owner = githubContext?.owner || 'seuros';
  const repo = githubContext?.repo || 'lcov-summary-action';
  const ref = githubContext?.ref || 'master';
  
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/sprites/${spriteFile}`;
}

export function generateCoverageSpriteWithFeedback(
  percentage: number,
  githubContext?: { owner: string; repo: string; ref: string },
  includeFeedback: boolean = false
): string {
  const feedback = getCoverageFeedback(percentage, githubContext);
  const sprite = `<img src="${feedback.sprite}" alt="Coverage ${percentage}%" width="48" height="48" style="vertical-align: middle; margin-right: 8px;" />`;
  
  if (includeFeedback) {
    return `${sprite}\n\n> ${feedback.message}`;
  }
  
  return sprite;
}

export function getCoverageFeedbackMessage(
  percentage: number,
  githubContext?: { owner: string; repo: string; ref: string }
): string {
  const feedback = getCoverageFeedback(percentage, githubContext);
  return feedback.message;
}