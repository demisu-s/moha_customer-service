// src/components/dashboardComponents/SupervisorCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

interface SupervisorCardProps {
  name: string;
  plant: string;
  workload: number;
  totalSolved: number;
  avatarUrl?: string;
}

const SupervisorCard: React.FC<SupervisorCardProps> = ({
  name,
  plant,
  workload,
  totalSolved,
  avatarUrl = "https://i.pravatar.cc/100?img=1",
}) => {
  const completionRate = totalSolved + workload > 0 
    ? Math.round((totalSolved / (totalSolved + workload)) * 100) 
    : 0;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-300"
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={avatarUrl}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary-100"
          />
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-sm text-gray-800 truncate">
              {name}
            </h4>
          </div>
          
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs text-gray-500">📍</span>
            <span className="text-xs text-gray-600 font-medium truncate">
              {plant}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-gray-700">
                {workload}
              </span>
              <span className="text-[10px] text-gray-400">tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-semibold text-gray-700">
                {totalSolved}
              </span>
              <span className="text-[10px] text-gray-400">solved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
          <span>Completion Rate</span>
          <span>{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="bg-primary-400 rounded-full h-1.5"
            initial={{ width: 0 }}
            animate={{ 
              width: `${completionRate}%` 
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SupervisorCard;