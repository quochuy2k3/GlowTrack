export interface SkillLevel {
  id: string;
  rank: number;
  title: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  levels: SkillLevel[];
  default: boolean;
  is_used: boolean;
}
