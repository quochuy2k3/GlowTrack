/**
 * User profile response interface
 */
export interface UserProfile {
  email: string;
  fullname: string;
  avatar: string;
  phone: string;
  gender: string;
  role: string;
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
