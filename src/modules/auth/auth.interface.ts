export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "TECHNICIAN";
  phone?: string;
  address?: string;
  avatarUrl?: string;

  technicianProfile?: {
    bio?: string;
    experience?: number;
    location: string;
    profilePicture?: string;
  };
}