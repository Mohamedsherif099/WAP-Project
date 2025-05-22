const adjectives = [
    'Happy', 'Clever', 'Brave', 'Swift', 'Bright',
    'Calm', 'Eager', 'Fierce', 'Gentle', 'Jolly',
    'Kind', 'Lively', 'Merry', 'Noble', 'Proud',
    'Quick', 'Royal', 'Smart', 'Tender', 'Wise'
];

const nouns = [
    'Panda', 'Tiger', 'Eagle', 'Dolphin', 'Lion',
    'Wolf', 'Hawk', 'Bear', 'Fox', 'Deer',
    'Shark', 'Whale', 'Falcon', 'Lynx', 'Owl',
    'Horse', 'Dragon', 'Phoenix', 'Griffin', 'Unicorn'
];

export const generateUsername = (): string => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adjective}${noun}${number}`;
};

// Store username in localStorage to maintain consistency across sessions
export const getStoredUsername = (): string => {
    const stored = localStorage.getItem('username');
    if (stored) return stored;

    const newUsername = generateUsername();
    localStorage.setItem('username', newUsername);
    return newUsername;
}; 