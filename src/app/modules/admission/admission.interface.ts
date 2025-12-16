import { Types } from "mongoose";

export interface IAdmission {
  userId: Types.ObjectId;
  collegeId: Types.ObjectId;
  candidateName: string;
  subject: string;
  candidateEmail: string;
  candidatePhone: string;
  address: string;
  dateOfBirth: Date;
  candidateImage: {
    location: string;
    key: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: Date;
}
