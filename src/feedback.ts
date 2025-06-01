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

const FEEDBACK_RANGES = [
  {
    min: 0,
    max: 0,
    sprites: ['0.png'],
    messages: [
      "💀 Your code coverage is deader than a doornail! Time to write some tests!",
      "🔥 0% coverage? That's not testing, that's just wishful thinking!",
      "😱 No tests detected. Your code is running naked in production!",
      "🚫 Tests? What tests? This is the wild west out here.",
      "📉 Your coverage graph is a flatline. RIP.",
      "🧨 Deploying this is like lighting a match in a fireworks factory.",
      "👻 Your tests are ghosts. I can feel them... but they’re not real.",
      "🛑 This code is legally uninsurable.",
      "🤷‍♂️ Why test something when you can just *believe* in it, right?",
      "😵 Zero percent? That’s a round number, I’ll give you that.",
      "🏚️ Your test suite is a haunted house. Empty, spooky, and full of regrets.",
      "🗑️ It's not that your code is untested. It’s that it’s *actively resisting* being tested.",
      "📵 You've reached the 'No Service' area of the test network.",
      "🔮 No tests, only vibes.",
      "🎲 Shipping untested code is like gambling. Except the house always wins.",
      "🦴 Bare bones coverage. Actually, just the bones. No meat.",
      "🙈 Even your rubber duck is concerned.",
      "🥴 I ran the coverage report and it cried.",
      "👎 This coverage is setting new *low* standards.",
      "🧹 You’ve swept testing completely under the rug.",
      "🐍 Even the snake (your CI) is hissing in disapproval."
    ]
  },
  {
    min: 1,
    max: 19,
    sprites: ['10.png'],
    messages: [
      "🤦‍♂️ Single digit coverage? Come on, you can do better than this!",
      "😬 Your tests are as rare as unicorns. Write more!",
      "🚨 This coverage level is giving me anxiety. Please test more!",
      "📉 Barely breathing. This coverage needs CPR.",
      "🎭 These tests are just for show, right?",
      "🧊 Your testing effort is chillingly minimal.",
      "🫥 You technically *have* tests, but like, not really.",
      "🥶 That’s some cold, cold coverage. Where’s the warmth?",
      "📡 Signal detected... just barely.",
      "🦗 Test results came back and it was just crickets.",
      "🔎 I had to squint to find your tests.",
      "💸 This coverage is costing you more than it’s saving.",
      "🎯 You’re aiming at quality, but you haven’t hit it yet.",
      "🫣 Your tests peek out, then immediately hide again.",
      "🧯 Fire hazard. There’s not enough coverage to prevent damage.",
      "🎢 Low and wild. Your code’s future is a rollercoaster.",
      "🥱 This test suite is not pulling its weight.",
      "😔 This could be the beginning of a beautiful test suite... but it’s not.",
      "🧪 There are *some* experiments happening here... we think.",
      "🤕 One test walks into prod. It doesn’t end well.",
      "👀 I see your tests. Blink and they’re gone."
    ]
  },
  {
    min: 20,
    max: 39,
    sprites: ['30.png'],
    messages: [
      "😕 Getting warmer, but still pretty chilly in here. More tests needed!",
      "🌡️ Your coverage is like lukewarm coffee - not quite there yet.",
      "📈 Progress! But let's keep climbing that coverage mountain.",
      "🧗 You're testing, but the summit's still far off.",
      "🌱 A seedling of coverage. Needs more sunshine and effort.",
      "🚧 Under construction. Wear a hard hat.",
      "🧃 This coverage is juice, not yet power.",
      "📚 Looks like a syllabus, not the full course.",
      "🏃 You’ve started the race. Don't slow down now.",
      "⚙️ The gears are turning, but the machine’s still stalling.",
      "🎬 Scene one. Testing has entered the chat.",
      "🎓 Baby’s first test suite.",
      "💼 Some business logic is covered. The rest is on vacation.",
      "📦 You've packed *some* test cases. Don’t forget the essentials.",
      "🌫️ Foggy coverage. We need more clarity.",
      "📡 Receiving test signals. They’re weak, but they’re there.",
      "🧱 Foundation poured. Now build it up.",
      "💤 Coverage is awake, but still sleepy.",
      "📉 Your graph looks like it sneezed and gave up.",
      "🤹 Some test juggling happening. Just don't drop it all.",
      "🔦 A little test coverage shines through the darkness."
    ]
  },
  {
    min: 40,
    max: 59,
    sprites: ['40.png', '50.png'],
    messages: [
      "🤔 Half-way there! Your code is 50% protected, 50% vulnerable.",
      "⚖️ Balanced, as all things should be... but let's tip the scales toward more tests!",
      "🎯 You're in the zone! Keep pushing toward better coverage.",
      "🔄 This is the testing limbo zone. Dance your way out of it.",
      "🛡️ Half armor is still a liability.",
      "📉 That’s not bad... but also not great.",
      "📊 Coverage report looks like an awkward shrug.",
      "💡 You've discovered tests exist. Now use that power.",
      "🎢 This is the middle of the ride. Don't puke yet.",
      "🏗️ A solid frame, but still needs walls, roof, and maybe plumbing.",
      "🎭 Half your app has an understudy.",
      "⏳ You've tested the past. The future’s wide open.",
      "🔧 Half-covered code is like a wrench missing its handle.",
      "🚪 You've opened the door. Please walk through it.",
      "🧩 Some pieces of the puzzle are still missing.",
      "🧮 Numbers look okay, but numbers lie.",
      "🕳️ Your test net still has holes. Big ones.",
      "🥽 Safety goggles on, but you’re still missing gloves.",
      "🕰️ A fine start. But the testing times are still a-changin'.",
      "👟 You're halfway across the bridge. Don’t turn around.",
      "🌗 Half moon coverage. We want full moon energy."
    ]
  },
  {
    min: 60,
    max: 79,
    sprites: ['60.png', '70.png'],
    messages: [
      "👍 Not bad! Your code is feeling more confident with each test.",
      "🚀 Good coverage! You're building trust with every test case.",
      "💪 Strong coverage game! Your future self will thank you.",
      "🧠 Smart testing detected. Keep flexing that brain.",
      "🌟 You're becoming someone your code can rely on.",
      "🧵 Things are stitched together nicely, but there’s room for embroidery.",
      "🔍 Most of your logic is under scrutiny. Good work, detective.",
      "📘 Your test story is interesting. We’re just missing the last chapter.",
      "🧰 You've opened the toolbox and you're actually using the tools.",
      "🏗️ That test scaffolding is looking solid.",
      "🎨 Your test suite is turning into art.",
      "🌄 Beautiful landscape of tests. But we can still paint the corners.",
      "🧭 You know where you're headed. Don’t get distracted.",
      "🛡️ Solid protection. Add a helmet and you’re golden.",
      "🚧 You’re nearly out of the construction zone.",
      "🎮 The boss fight is ahead. You’re nearly ready.",
      "🕹️ You’ve unlocked ‘competent dev mode’. Keep playing.",
      "🧪 Your experiments are producing reliable results.",
      "📦 This package is nearly sealed. Just tape up the edges.",
      "📶 Strong signal. Just a little interference left.",
      "📈 Almost at greatness. Just a few more steps."
    ]
  },
  {
    min: 80,
    max: 94,
    sprites: ['80.png', '90.png'],
    messages: [
      "🎉 Excellent coverage! Your code is well-protected and battle-tested.",
      "⭐ Outstanding! You're setting a great example for test-driven development.",
      "🏆 High-quality coverage! Your code confidence level is through the roof!",
      "💼 You could frame this test suite and show it to recruiters.",
      "📜 These tests deserve to be read aloud in the town square.",
      "📈 You're trending in the right direction. Strong and stable.",
      "🧪 A well-oiled testing machine.",
      "🧠 Sharp, thoughtful coverage. It shows.",
      "🧰 This toolset is nearly complete.",
      "🧵 Every function stitched together with care.",
      "🎤 Your test suite just dropped a mic.",
      "🌟 That coverage star is burning bright.",
      "🪄 Your testing spells are working wonders.",
      "🪜 You’re on the second-to-last rung. Glory is near.",
      "🎯 Bullseye-level testing.",
      "💥 The code is tested and it shows.",
      "🌠 Coverage dreams do come true.",
      "👩‍🚀 Astronomical quality confirmed.",
      "🧊 Cool, calm, and carefully tested.",
      "🫡 Your tests salute you.",
      "📚 Your code base is practically a textbook example."
    ]
  },
  {
    min: 95,
    max: 100,
    sprites: ['100.png'],
    messages: [
      "🥇 LEGENDARY! Your code coverage is absolutely pristine!",
      "👑 Coverage royalty! You've achieved testing nirvana.",
      "🚀 To infinity and beyond! Perfect coverage achieved, you testing wizard!",
      "🧼 So clean you could eat off this code.",
      "🎖️ Medal-worthy test suite. Salute!",
      "✨ Nothing escapes your tests. Nothing.",
      "🛡️ Your coverage is titanium-plated.",
      "🌐 The whole system is under control. The matrix approves.",
      "🧙‍♂️ You cast 100% coverage like a true mage.",
      "🎩 That’s some real testing magic.",
      "🧬 Your test suite has DNA-level accuracy.",
      "🎮 You've reached the final level. Test boss defeated.",
      "📦 Fully sealed, tamper-evident codebase.",
      "🛰️ Your coverage scans the galaxy.",
      "🧊 Ice cold perfection.",
      "🥂 Here’s to spotless execution.",
      "💾 You’ve saved the testing world.",
      "📢 Loud and proud: 100% verified.",
      "🧼 Code squeaky clean. Mr. Clean is impressed.",
      "🏁 Flawless finish."
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