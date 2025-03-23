export interface SkillObject {
  id: string;
  name: string;
}

export interface DataObject {
  id: string;
  title: string;
  coverImage?: string;
  coverImageUrl: string | null;
  type: "course" | "training";
  status: "completed" | "inProgress" | "readyToStart";
}

export interface UserPlan {
  id?: string;
  name: string;
  description?: string;
  skill?: string;
  skillObj: SkillObject | Record<string, never>;
  dataObj: DataObject[];
}
