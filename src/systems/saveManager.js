const SAVE_KEY = 'mindfuck-save';

const DEFAULT_SAVE = {
  gameStarted: false,
  highestChapter: 0,
  endingComplete: false,
  achievements: [],
  equippedHat: null,

  // Audio settings
  musicVolume: 0.5,
  sfxVolume: 0.7,
};

function load() {
  try {
    const stored =
      localStorage.getItem(SAVE_KEY);

    if (!stored) {
      return {
        ...DEFAULT_SAVE,
        achievements: [],
      };
    }

    return {
      ...DEFAULT_SAVE,
      ...JSON.parse(stored),
    };
  } catch (error) {
    console.warn(
      'Could not load save:',
      error
    );

    return {
      ...DEFAULT_SAVE,
      achievements: [],
    };
  }
}

function save(data) {
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(data)
  );
}

function update(changes) {
  const current = load();

  const updated = {
    ...current,
    ...changes,
  };

  save(updated);

  return updated;
}

function reachChapter(number) {
  const current = load();

  update({
    gameStarted: true,
    highestChapter: Math.max(
      current.highestChapter,
      number
    ),
  });
}

function completeEnding() {
  update({
    gameStarted: true,
    highestChapter: 6,
    endingComplete: true,
  });
}

function unlockAchievement(id) {
  const current = load();

  if (current.achievements.includes(id)) {
    return false;
  }

  const achievements = [
    ...current.achievements,
    id,
  ];

  update({
    achievements,
  });

  return true;
}

function hasAchievement(id) {
  const current = load();

  return current.achievements.includes(id);
}

function equipHat(id) {
  update({
    equippedHat: id,
  });
}

function unequipHat() {
  update({
    equippedHat: null,
  });
}

function isHatEquipped(id) {
  const current = load();

  return current.equippedHat === id;
}

function reset() {
  localStorage.removeItem(
    SAVE_KEY
  );
}

function resetAchievement(id) {
  const data = load();

  data.achievements =
    data.achievements.filter(
      (achievementId) =>
        achievementId !== id
    );

  // If we're resetting the raccoon hat,
  // don't leave it equipped.
  if (
    id === 'raccoon_hat' &&
    data.equippedHat === 'raccoon_hat'
  ) {
    data.equippedHat = null;
  }

  save(data);

  return data;
}

export default {
  load,
  save,
  update,
  reachChapter,
  completeEnding,
  unlockAchievement,
  hasAchievement,
  resetAchievement,
  reset,
};