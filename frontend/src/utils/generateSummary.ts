// src/utils/generateSummary.ts

export interface ReportRow {
  requestedBy: string;
  requestedDate: string;
  plant: string;
  problemCategory: string;
  deviceType: string;
  problemType: string;
  priority: string;
  solvedBy: string;
  solution: string;
  status: string;
}

export const generateSummaryData = (data: ReportRow[]) => {
  const plantMap: Record<string, any> = {};

  data.forEach((row) => {
    const plant = row.plant || "Unknown";

    if (!plantMap[plant]) {
      plantMap[plant] = {
        plant,

        // Hardware
        Desktops: 0,
        Laptops: 0,
        Servers: 0,
        Switches: 0,
        AccessPoints: 0,
        Cameras: 0,
        CameraRelated: 0,
        Biometric: 0,
        Printer: 0,      // ✅ ADDED
        UPS: 0,          // ✅ ADDED
        TV: 0,           // ✅ ADDED

        // Software
        ERP: 0,
        Peachtree: 0,
        Canteen: 0,
        Overtime: 0,
        OtherSoftware: 0,

        // Network
        Network: 0,
        NetworkRelated: 0,
        InternetRelated: 0,

        // Other
        ProjectRelated: 0,
        OtherServices: 0,
      };
    }

    const p = plantMap[plant];

    // Hardware - by device type
    if (row.deviceType === "Desktop") p.Desktops++;
    else if (row.deviceType === "Laptop") p.Laptops++;
    else if (row.deviceType === "Server") p.Servers++;
    else if (row.deviceType === "Switch") p.Switches++;
    else if (row.deviceType === "Access Point") p.AccessPoints++;
    else if (row.deviceType === "Camera") p.Cameras++;
    else if (row.deviceType === "Biometric") p.Biometric++;
    else if (row.deviceType === "Printer") p.Printer++;
    else if (row.deviceType === "UPS") p.UPS++;
    else if (row.deviceType === "TV") p.TV++;

    // Hardware - by problem category
    if (row.problemCategory === "Camera Related") p.CameraRelated++;

    // Software
    if (row.problemCategory === "ERP") p.ERP++;
    else if (row.problemCategory === "Peachtree") p.Peachtree++;
    else if (row.problemCategory === "Canteen") p.Canteen++;
    else if (row.problemCategory === "Overtime") p.Overtime++;
    else if (row.problemCategory === "Other Software") p.OtherSoftware++;

    // Network
    if (row.deviceType === "Network") p.Network++;
    else if (row.problemCategory === "Network Related") p.NetworkRelated++;
    else if (row.problemCategory === "Internet Related") p.InternetRelated++;

    // Other
    if (row.problemCategory === "Project Related") p.ProjectRelated++;
    else if (row.problemCategory === "Other Services") p.OtherServices++;
  });

  return Object.values(plantMap).map((item: any) => {
    const hwTotal =
      item.Desktops +
      item.Laptops +
      item.Servers +
      item.Switches +
      item.AccessPoints +
      item.Cameras +
      item.CameraRelated +
      item.Biometric +
      item.Printer +
      item.UPS +
      item.TV;

    const swTotal =
      item.ERP +
      item.Peachtree +
      item.Canteen +
      item.Overtime +
      item.OtherSoftware;

    const ntTotal =
      item.Network +
      item.NetworkRelated +
      item.InternetRelated;

    const total =
      hwTotal +
      swTotal +
      ntTotal +
      item.ProjectRelated +
      item.OtherServices;

    return {
      Plant: item.plant,

      // For the table summary (aggregated)
      HWTotal: hwTotal,
      SWTotal: swTotal,
      NetworkRelated: item.NetworkRelated,
      InternetRelated: item.InternetRelated,
      ProjectRelated: item.ProjectRelated,
      OtherServices: item.OtherServices,
      Total: total,

      // Individual columns for Excel export
      Desktops: item.Desktops,
      Laptops: item.Laptops,
      Servers: item.Servers,
      Switches: item.Switches,
      AccessPoints: item.AccessPoints,
      Cameras: item.Cameras,
      CameraRelated: item.CameraRelated,
      Biometric: item.Biometric,
      Printer: item.Printer,
      UPS: item.UPS,
      TV: item.TV,
      ERP: item.ERP,
      Peachtree: item.Peachtree,
      Canteen: item.Canteen,
      Overtime: item.Overtime,
      OtherSoftware: item.OtherSoftware,
      Network: item.Network,
    };
  });
};