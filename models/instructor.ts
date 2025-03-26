import { type PaginatedListResponse } from './base';

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

interface ContactInfo {
  email: string;
  phone?: string;
}

export interface CreateInstructorRequest {
  name: string;
  avatar: string;
  bio: string;
  social: SocialMedia;
  contact: ContactInfo;
  jobTitle: string;
}

export interface UpdateInstructorRequest extends CreateInstructorRequest {
  id: string;
}

export interface DeleteInstructorRequest {
  id: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  social: SocialMedia;
  contact: ContactInfo;
  jobTitle: string;
}

export interface InstructorNode {
  id: string;
  name: string;
  avatar: string;
  jobTitle: string;
}
