type SkillItem = {
  title: string;
  items: string[];
};

type EducationItem = {
  title: string;
  subtitle?: string;
  items: string[];
};

type ValueItem = {
  emoji: string;
  title: string;
  description: string;
};

export type SectionData = {
  id: string;
  title: string;
  type: 'intro' | 'skills' | 'education' | 'values' | 'contact';
  backgroundColor?: string;
  textColor?: string;
  content?: {
    description?: string;
    skills?: SkillItem[];
    education?: EducationItem[];
    values?: ValueItem[];
  };
};
