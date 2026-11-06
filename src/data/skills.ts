import type { SkillGroup } from './types';

/** Single source for every skill list on the site; the resume shows the flattened list. */
export const skillGroups: SkillGroup[] = [
  {
    title: { en: 'Languages', vi: 'Ngôn ngữ' },
    skills: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'TypeScript'],
  },
  {
    title: { en: 'Frontend & Mobile', vi: 'Frontend & Mobile' },
    skills: ['React JS', 'React Native', 'Flutter', 'Redux Toolkit', 'Zustand', 'Axios'],
  },
  {
    title: { en: 'VoIP & Real-time', vi: 'VoIP & Real-time' },
    skills: ['PJSIP', 'WebSocket', 'Socket.io', 'Firebase Cloud Messaging'],
  },
  {
    title: { en: 'Backend & Database', vi: 'Backend & Cơ sở dữ liệu' },
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Strapi', 'Realm'],
  },
  {
    title: { en: 'Testing & Automation', vi: 'Kiểm thử & Automation' },
    skills: ['Playwright', 'Appium', 'WebDriverIO', 'Tesseract.js'],
  },
  {
    title: { en: 'Tools & Integrations', vi: 'Công cụ & Tích hợp' },
    skills: [
      'Git',
      'GitHub',
      'Bitbucket',
      'Postman',
      'Figma',
      'CodePush',
      'Rocket.Chat API',
      'Cloudinary',
      'VNPay',
    ],
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
