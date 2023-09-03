const calculateCombatLevel = (skills) => {
    const {Attack, Strength, Defence, Hitpoints, Prayer, Ranged, Magic} = skills;

    const base = 0.25 * (Defence + Hitpoints + Math.floor(Prayer / 2));
    const melee = 0.325 * (Attack + Strength);
    const range = 0.325 * (Math.floor(3 * Ranged / 2));
    const mage = 0.325 * (Math.floor(3 * Magic / 2));

    return base + Math.max(melee, range, mage);
};

export default calculateCombatLevel;