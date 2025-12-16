export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "student";
  profileImage?: {
    location: string;
    key: string;
  };
  university?: string;
  address?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
}
