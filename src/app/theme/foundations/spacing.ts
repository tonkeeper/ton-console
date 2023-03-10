const space = {
    0: '0',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    10: '40px',
    11: '44px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px'
} as const;

export type Space = typeof space;
export default space;
