
export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  userId: string;
  password: string;
}


export interface IPlant {
  _id?: string;
  Name: string; 
  City: string;
  Area: string;
}

export interface IDepartment {
  _id?: string;
  Name: string; 
  Block: string;
  Floor: string;
}
export interface IDevice {
  _id?: string;
  Name: string;
  Type: string;
  Plant: IPlant;
  Department: IDepartment;
  User: IUser;
  SerialNumber: string;
  Image: Buffer | string;
}

export interface IServiceRequest {
  _id?: string;
  deviceId: IDevice;
  deviceSerial: string;
  requestedBy: IUser;
  requestedDate: string;
  description: string;
  Plant: IPlant;  
  department: IDepartment;
  userId?: IUser;
  phone?: string;
  resolvedDate?: string;
  attachments: string;
  createdAt: string;
  status: RequestStatus;
  assignedTo?: IUser;
  notes?: string;
  solution?: string;
  issues?: Issues;
  supervisorId?: IUser;
  assignedDate?: string;
  urgency?: string;
  problemCategory?: String;
}