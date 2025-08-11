// src/data/mockdata.ts
import device1Img from "../assets/device 1.png";
import device1Side from "../assets/device1_side.jpg";
import device1Back from "../assets/device1_back.jpg";
import screenshot1 from "../assets/screenshot_1.png";
import screenshot2 from "../assets/screenshot_2.jpg";

export const maintenanceRequests = [
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
      name: "Abebe Kebede",
      location: "Kaliti",
      department: "Marketing",
      phone: "+251911111111",
    },
    issue: {
      description:
        "The laptop screen is flickering frequently. If you want, I can also give you a system architecture diagram showing how an Alumni Management System works from backend to frontend. If you want, I can also give you a system architecture diagram showing how an Alumni Management System works from backend to frontend. That would make it easier to visualize. That would make it easier to visualize.",
      urgency: "High",
      attachments: [screenshot1, screenshot2], 
    },
  },
  {
    id: "2",
    device: {
      image: "/device-image.png",
      extraImages: [
        "/device-image-side.png",
        "/device-image-back.png"
      ],
      name: "Latitude 7420 Laptop",
      type: "Printer",
      serial: "CN-7876-9597",
      submissionDate: "2024-05-07",
      status: "Assigned",
    },
    requester: {
      name: "Alem Kebede",
      location: "Kaliti",
      department: "Marketing",
      phone: "+251911111111",
    },
    issue: {
      description: "The laptop screen is flickering...",
      urgency: "High",
      attachments: [screenshot1, screenshot2],
    },
  },
  // more entries...
];
