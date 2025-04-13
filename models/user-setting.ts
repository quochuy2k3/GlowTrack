import { type Skill as Skill } from './base';

export interface Position {
  id: string;
  name: string;
  description: string;
}

export interface UserSetting {
  skills: string[];
  skillsObj: Skill[];
  rolesInterested: string[];
  rolesInterestedObj: Position[];
  careerFocus: 'inRole' | 'beyondRole' | 'all';
  weeklyGoal: number;
}

export interface UserSettingSummary {
  totalSkills: number;
  totalRolesInterested: number;
  careerFocus: 'inRole' | 'beyondRole' | 'all';
  weeklyGoal: number;
}

export interface UpdateUserSettingRequest {
  skills: string[];
  rolesInterested: string[];
  careerFocus: 'inRole' | 'beyondRole' | 'all';
}
