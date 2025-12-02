export const GRADE_POINTS: { [key: string]: number } = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'F': 0
};

export const COURSE_TYPES = {
    THEORY: 'Theory',
    PRACTICAL: 'Practical',
    JOINT: 'Joint'
} as const;
