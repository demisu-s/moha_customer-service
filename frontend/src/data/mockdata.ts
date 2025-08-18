import device1Img from "../assets/device 1.png";
import device1Side from "../assets/device1_side.jpg";
import device1Back from "../assets/device1_back.jpg";
import screenshot1 from "../assets/screenshot_1.png";
import screenshot2 from "../assets/screenshot_2.jpg";

export type Status = "Pending" | "Assigned" | "Resolved";


export interface MaintenanceRequest {
  id: string;
  device: {
    image: string;
    extraImages: string[];
    name: string;
    type: string;
    serial: string;
    submissionDate: string;
    status: Status;
  };
  requester: {
    userId: string;   
    name: string;
    location: string;
    department: string;
    phone: string;
  };
  supervisor?: {
    id: string;       
    name: string;
    department: string;
    phone: string;
  };
  assignedTo?: string; 
  issue: {
    description: string;
    recommendation?: string;
    urgency: string;
    attachments: string[];
    solution?: string;
  };
}


export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: "1",
    device: {
      image: device1Img,
      extraImages: [device1Side, device1Back],
      name: "Latitude 7420 Laptop",
      type: "Laptop",
      serial: "CN-9576-9597",
      submissionDate: "2024-05-07",
      status: "Pending",
    },
    requester: {
      userId: "u1", 
      name: "Abebe Kebede",
      location: "Kaliti",
      department: "Marketing",
      phone: "+251911111111",
    },
    issue: {
      description: "The laptop screen is flickering frequently...",
      recommendation: "Replace or check display cable.",
      solution: "",
      urgency: "High",
      attachments: [screenshot1, screenshot2],
    },
  },
  {
    id: "2",
    device: {
      image: device1Img,
      extraImages: [device1Side, device1Back],
      name: "Latitude 7420 Laptop",
      type: "Laptop",
      serial: "CN-9576-9597",
      submissionDate: "2024-05-07",
      status: "Resolved",
    },
    requester: {
      userId: "u1",  
      name: "Abebe Kebede",
      location: "Kaliti",
      department: "Marketing",
      phone: "+251911111111",
    },
    supervisor: {
      id: "s1", 
      name: "Supervisor One",
      department: "IT",
      phone: "+251922222222",
    },
    assignedTo: "s1", 
    issue: {
      description: "The laptop screen is flickering frequently...",
      recommendation: "Replace or check display cable.",
      solution: "Replaced screen cable.",
      urgency: "High",
      attachments: [screenshot1, screenshot2],
    },
  },
  {
    id: "3",
    device: {
      image: "/device-image.png",
      extraImages: ["/device-image-side.png", "/device-image-back.png"],
      name: "Latitude 7420 Laptop",
      type: "Printer",
      serial: "CN-7876-9597",
      submissionDate: "2024-05-07",
      status: "Assigned",
    },
    requester: {
      userId: "u2",  
      name: "Alem Kebede",
      location: "Kaliti",
      department: "Marketing",
      phone: "+251911111111",
    },
    supervisor: {
      id: "s2",
      name: "Supervisor Two",
      department: "IT",
      phone: "+251933333333",
    },
    assignedTo: "s2", 
    issue: {
      description: "The printer is not connecting to the network...",
      recommendation: "Check network configuration.",
      solution: "",
      urgency: "Medium",
      attachments: [screenshot1, screenshot2],
    },
  },
];
