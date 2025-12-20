import { Types } from "mongoose";

export interface ICollege {
  name: string;
  image: {
    location: string;
    key: string;
  }; 
  rating?: number; 
  admissionDates: {
    startDate: Date;
    endDate: Date;
    session: string; 
  };
  events: IEvent[];
  researchHistory: IResearch[];
  sports: ISport[];
  location: {
    city: string;
    country: string;
  };
  description: string;
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
}

export interface IEvent {
  name: string;
  description: string;
  date: Date;
  venue: string;
  category: 'cultural' | 'academic' | 'sports' | 'technical' | 'other';
}

export interface IResearch {
  title: string;
  authors: Types.ObjectId[];
  description: string;
  publicationDate: Date;
  paperLink: string;
  department: string;
}

export interface ISport {
  name: string;
  category: string; 
  achievements: string[];
  coachName?: string;
}
