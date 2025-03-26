/**
 * User profile response interface
 */
export interface UserProfile {
  /** User ID */
  id: string;
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's full name */
  fullName: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** User's phone number */
  phone?: string;
  /** User's date of birth */
  dateOfBirth?: string;
  /** User's address */
  address?: string;
  /** User's bio/description */
  bio?: string;
  /** User's job title */
  jobTitle?: string;
  /** User's company/organization */
  company?: string;
  /** Account creation date */
  createdAt: string;
  /** Account last update date */
  updatedAt: string;
  /** User roles */
  roles: string[];
}

/**
 * Update profile request interface
 */
export interface UpdateProfileRequest {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's phone number */
  phone?: string;
  /** User's date of birth */
  dateOfBirth?: string;
  /** User's address */
  address?: string;
  /** User's bio/description */
  bio?: string;
  /** User's job title */
  jobTitle?: string;
  /** User's company/organization */
  company?: string;
}

/**
 * Update avatar request interface
 */
export interface UpdateAvatarRequest {
  /** Avatar file */
  file: File;
}
