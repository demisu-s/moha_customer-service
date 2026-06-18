// components/PMaintenance/WorkOrderStats.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "orange" | "purple" | "gray" | "red";
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "blue",
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);

  const colorConfigs = {
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      gradient: "from-gray-500 to-gray-600",
      shadow: "shadow-gray-100",
      ring: "ring-gray-400",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-100",
      ring: "ring-blue-400",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      gradient: "from-green-500 to-green-600",
      shadow: "shadow-green-100",
      ring: "ring-green-400",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      gradient: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-100",
      ring: "ring-orange-400",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      gradient: "from-red-500 to-red-600",
      shadow: "shadow-red-100",
      ring: "ring-red-400",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-100",
      ring: "ring-purple-400",
    },
  };

  const config = colorConfigs[color];

  const AnimatedValue = ({ value }: { value: string | number }) => {
    const [displayValue, setDisplayValue] = React.useState(0);
    const targetValue = typeof value === "number" ? value : parseInt(value.toString()) || 0;

    React.useEffect(() => {
      let start = 0;
      const duration = 1000;
      const increment = targetValue / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetValue) {
          setDisplayValue(targetValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [targetValue]);

    if (typeof value === "string" && isNaN(parseInt(value))) {
      return <span>{value}</span>;
    }

    return <span>{displayValue.toLocaleString()}</span>;
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-5 relative overflow-hidden transition-all duration-300 cursor-pointer ${isHovered ? 'shadow-2xl' : ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { duration: 0.2, type: "spring", stiffness: 300 }
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 pointer-events-none`}
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {isClicked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: `radial-gradient(circle, ${color === 'gray' ? '#6b7280' : color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'orange' ? '#f59e0b' : color === 'red' ? '#ef4444' : '#8b5cf6'} 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />
      )}

      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </p>
            {trend && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  trend.isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3" />
                )}
                {Math.abs(trend.value)}%
              </motion.div>
            )}
          </div>

          <motion.div
            className="text-3xl font-bold text-gray-800 mt-1"
            animate={{
              scale: isHovered ? 1.05 : 1,
              color: isHovered ? '#1f2937' : '#1f2937',
            }}
            transition={{ duration: 0.2 }}
          >
            <AnimatedValue value={value} />
          </motion.div>

          {subtitle && (
            <motion.p 
              className="text-xs text-gray-500 mt-1"
              animate={{ opacity: isHovered ? 0.8 : 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {icon && (
          <motion.div
            className={`${config.iconBg} rounded-xl p-2.5 flex-shrink-0 relative`}
            animate={{
              rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              rotate: { duration: 0.5, repeat: isHovered ? 1 : 0 },
              scale: { duration: 0.2 }
            }}
          >
            <div className={`w-5 h-5 ${config.iconColor}`}>
              {icon}
            </div>

            {isHovered && (
              <motion.div
                className={`absolute inset-0 rounded-xl border-2 ${config.ring}`}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>
        )}
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${config.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : "60%" }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {isHovered && (
        <motion.div
          className="absolute -inset-1 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: `0 0 30px rgba(59, 130, 246, 0.1)`,
            borderRadius: '12px',
          }}
        />
      )}
    </motion.div>
  );
};

// ─── WorkOrderStats ────────────────────────────────────────────────────────────

interface WorkOrderStatsProps {
  total: number;
  planned: number;
  inProgress: number;
  completed: number;
  cancelled?: number;
  isLoading?: boolean;
  currentPlantName?: string;
}

export const WorkOrderStats: React.FC<WorkOrderStatsProps> = ({
  total,
  planned,
  inProgress,
  completed,
  cancelled = 0,
  isLoading = false,
  currentPlantName = "",
}) => {
  // Calculate completion percentage
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Mock trends (you can replace with real data)
  const trends = {
    total: { value: 12, isPositive: true },
    planned: { value: 5, isPositive: true },
    inProgress: { value: 8, isPositive: true },
    completed: { value: 15, isPositive: true },
    cancelled: { value: 3, isPositive: false },
  };

  const stats: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ReactNode;
    color: StatCardProps["color"];
    trend: { value: number; isPositive: boolean };
    delay: number;
  }[] = [
    {
      title: "Total Work Orders",
      value: total,
      subtitle: `${completionRate}% completion rate`,
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      color: "blue",
      trend: trends.total,
      delay: 0,
    },
    {
      title: "Planned",
      value: planned,
      subtitle: "Awaiting execution",
      icon: <ClockIcon className="w-5 h-5" />,
      color: "orange",
      trend: trends.planned,
      delay: 1,
    },
    {
      title: "In Progress",
      value: inProgress,
      subtitle: "Currently being worked on",
      icon: <PlayCircleIcon className="w-5 h-5" />,
      color: "purple",
      trend: trends.inProgress,
      delay: 2,
    },
    {
      title: "Completed",
      value: completed,
      subtitle: `Total tasks: ${total}`,
      icon: <CheckCircleIcon className="w-5 h-5" />,
      color: "green",
      trend: trends.completed,
      delay: 3,
    },
  ];

  if (cancelled > 0) {
    stats.push({
      title: "Cancelled",
      value: cancelled,
      subtitle: "Work orders cancelled",
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      color: "red" as const,
      trend: trends.cancelled,
      delay: 4,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            delay={index}
          />
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            {currentPlantName ? `Progress for ${currentPlantName}` : "Overall Progress"}
          </h3>
          <span className="text-sm font-medium text-gray-500">
            {completionRate}% Complete
          </span>
        </div>

        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0%</span>
          <span>{Math.round(completionRate / 2)}%</span>
          <span>{completionRate}%</span>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500">Planned</div>
            <div className="text-sm font-semibold text-orange-600">
              {planned}
            </div>
            <div className="text-[10px] text-gray-400">
              {total > 0 ? Math.round((planned / total) * 100) : 0}%
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500">In Progress</div>
            <div className="text-sm font-semibold text-purple-600">
              {inProgress}
            </div>
            <div className="text-[10px] text-gray-400">
              {total > 0 ? Math.round((inProgress / total) * 100) : 0}%
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500">Completed</div>
            <div className="text-sm font-semibold text-green-600">
              {completed}
            </div>
            <div className="text-[10px] text-gray-400">
              {total > 0 ? Math.round((completed / total) * 100) : 0}%
            </div>
          </div>

          {cancelled > 0 && (
            <div className="text-center">
              <div className="text-xs text-gray-500">Cancelled</div>
              <div className="text-sm font-semibold text-red-600">
                {cancelled}
              </div>
              <div className="text-[10px] text-gray-400">
                {total > 0 ? Math.round((cancelled / total) * 100) : 0}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderStats;