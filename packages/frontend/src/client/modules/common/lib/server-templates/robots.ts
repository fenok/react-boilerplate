export const robots = `User-agent: *
Disallow:

User-agent: YandexBot
Disallow:
Host: ${global.CANONICAL_ROBOTS_HOST.replace('http://', '') /* Preserving https is OK */}
`;
