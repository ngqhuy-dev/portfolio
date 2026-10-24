import type { SkillGroup } from './types';

/** Single source for every skill list on the site; the resume shows the flattened list. */
export const skillGroups: SkillGroup[] = [
  {
    title: { en: 'Frontend', vi: 'Frontend' },
    skills: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'TypeScript', 'React JS'],
  },
  {
    title: { en: 'Mobile & State', vi: 'Mobile & State' },
    skills: ['React Native', 'Redux Toolkit', 'Zustand', 'Axios'],
  },
  {
    title: { en: 'Backend & Data', vi: 'Backend & Dữ liệu' },
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Strapi', 'WebSocket', 'Socket.io'],
  },
  {
    title: { en: 'Integrations & Tools', vi: 'Tích hợp & Công cụ' },
    skills: [
      'Firebase',
      'Rocket.Chat API',
      'Cloudinary',
      'VNPay',
      'Git',
      'Bitbucket',
      'Postman',
      'Figma',
    ],
  },
  {
    title: { en: 'Testing & Automation', vi: 'Kiểm thử & Automation' },
    skills: ['Playwright', 'Appium', 'WebDriverIO', 'Tesseract.js', 'Realm'],
  },
];

export const allSkills: string[] = skillGroups.flatMap((group) => group.skills);

export const knowsAbout = [
  'React',
  'React Native',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Redux Toolkit',
  'Zustand',
  'Playwright',
  'Appium',
  'Firebase',
];
