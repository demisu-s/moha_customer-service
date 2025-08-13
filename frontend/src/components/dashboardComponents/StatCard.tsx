import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  bgColor = "bg-primary-900",
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-sm text-black`}>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-sm font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-700 mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
