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

export const generateSummaryData = (
  data: ReportRow[]
) => {
  const plantMap: Record<string, any> = {};

  data.forEach((row) => {
    const plant = row.plant || "Unknown";

    if (!plantMap[plant]) {
      plantMap[plant] = {
        plant,

        desktops: 0,
        laptops: 0,
        servers: 0,
        cameras: 0,
        cameraRelated: 0,
        network: 0,
        biometric: 0,

        erp: 0,
        peachtree: 0,
        canteen: 0,
        overtime: 0,
        otherSoftware: 0,

        networkRelated: 0,
        internetRelated: 0,

        projectRelated: 0,

        otherServices: 0,
      };
    }

    const p = plantMap[plant];

    // Hardware

    if (row.deviceType === "Desktop")
      p.desktops++;

    if (row.deviceType === "Laptop")
      p.laptops++;

    if (row.deviceType === "Server")
      p.servers++;

    if (row.deviceType === "Camera")
      p.cameras++;

    if (
      row.problemCategory ===
      "Camera Related"
    )
      p.cameraRelated++;

    if (row.deviceType === "Network")
      p.network++;

    if (row.deviceType === "Biometric")
      p.biometric++;

    // Software

    if (row.problemCategory === "ERP")
      p.erp++;

    if (
      row.problemCategory ===
      "Peachtree"
    )
      p.peachtree++;

    if (
      row.problemCategory ===
      "Canteen"
    )
      p.canteen++;

    if (
      row.problemCategory ===
      "Overtime"
    )
      p.overtime++;

    if (
      row.problemCategory ===
      "Other Software"
    )
      p.otherSoftware++;

    // Network

    if (
      row.problemCategory ===
      "Network Related"
    )
      p.networkRelated++;

    if (
      row.problemCategory ===
      "Internet Related"
    )
      p.internetRelated++;

    // Project

    if (
      row.problemCategory ===
      "Project Related"
    )
      p.projectRelated++;

    // Other

    if (
      row.problemCategory ===
      "Other Services"
    )
      p.otherServices++;
  });

  return Object.values(plantMap).map(
    (item: any) => {
      const hwTotal =
        item.desktops +
        item.laptops +
        item.servers +
        item.cameras +
        item.cameraRelated +
        item.network +
        item.biometric;

      const swTotal =
        item.erp +
        item.peachtree +
        item.canteen +
        item.overtime +
        item.otherSoftware;

      const total =
        hwTotal +
        swTotal +
        item.networkRelated +
        item.internetRelated +
        item.projectRelated +
        item.otherServices;

      return {
        Plant: item.plant,

        Desktops: item.desktops,
        Laptops: item.laptops,
        Servers: item.servers,
        Cameras: item.cameras,
        CameraRelated:
          item.cameraRelated,
        Network: item.network,
        Biometric: item.biometric,

        HWTotal: hwTotal,

        ERP: item.erp,
        Peachtree: item.peachtree,
        Canteen: item.canteen,
        Overtime: item.overtime,
        OtherSoftware:
          item.otherSoftware,

        SWTotal: swTotal,

        NetworkRelated:
          item.networkRelated,

        InternetRelated:
          item.internetRelated,

        ProjectRelated:
          item.projectRelated,

        OtherServices:
          item.otherServices,

        Total: total,
      };
    }
  );
};