// src/components/dashboardComponents/DeviceCardUser.tsx
import React, { useState } from "react";
import * as Label from "@radix-ui/react-label";
import deviceImage from "../../assets/device 1.png";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/image";
import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

type DeviceCardProps = {
  id: string;
  deviceType: string;
  serialNo: string;
  department: string;
  plant: string;
  image?: string;
  isOnline?: boolean;
};

const DeviceCardUser: React.FC<DeviceCardProps> = ({
  id,
  deviceType,
  serialNo,
  department,
  plant,
  image,
  isOnline = true,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <>
      <motion.div
        className="w-[250px] bg-white rounded-xl shadow-xl p-3 space-y-3 text-sm border border-gray-100 relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          y: -4,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.2 }
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Status Indicator */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5">
            <motion.div
              className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
              animate={isOnline ? {
                scale: [1, 1.2, 1],
                transition: { repeat: Infinity, duration: 2 }
              } : {}}
            />
            <span className="text-[10px] text-gray-500">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">{id.slice(0, 6)}</span>
        </div>

        <motion.div
          className="relative overflow-hidden rounded"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={image ? getImageUrl(image) : deviceImage}
            alt="Device"
            className={`w-full h-28 object-contain rounded transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
          )}
        </motion.div>

        <div className="space-y-2">
          <Field label="Device type" value={deviceType} />
          <Field label="Serial No" value={serialNo} />
          <Field label="Department" value={department} />
          <Field label="Plant" value={plant} />
        </div>

        <div className="flex justify-between mt-2 gap-1.5">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate(`/client-dashboard/device/${id}`)}
              className="w-full bg-primary-400 hover:bg-primary-500 hover:shadow-md text-white text-[9px] font-semibold px-3 py-[2px] rounded transition-all duration-200 flex items-center justify-center gap-0.5"
            >
              <EyeIcon className="w-2.5 h-2.5" />
              Details
            </Button>
          </motion.div>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowHelpModal(true)}
              className="w-full bg-primary-400 hover:bg-primary-500 hover:shadow-md text-white text-[9px] font-semibold px-3 py-[2px] rounded transition-all duration-200 flex items-center justify-center gap-0.5"
            >
              <ChatBubbleLeftRightIcon className="w-2.5 h-2.5" />
              Help
            </Button>
          </motion.div>
        </div>

        {/* Status Badge - Shows on hover but doesn't cover anything */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] px-2 py-1 rounded-full shadow-lg"
        >
          <CheckCircleIcon className="w-3 h-3" />
        </motion.div>
      </motion.div>

      {/* Help Request Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Request Help</h3>
              <p className="text-gray-600 text-sm mb-4">
                You are about to request help for <span className="font-semibold">{deviceType}</span>.
                A technician will be notified immediately.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowHelpModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-1 rounded transition-colors"
                >
                  Cancel
                </Button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => {
                      navigate(`/client-dashboard/help/${id}`);
                      setShowHelpModal(false);
                    }}
                    className="bg-primary-400 hover:bg-primary-500 text-white text-sm px-4 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    <ChatBubbleLeftRightIcon className="w-3 h-3" />
                    Send Request
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <motion.div
    className="flex items-center"
    whileHover={{ x: 2 }}
    transition={{ duration: 0.2 }}
  >
    <Label.Root className="w-[35%] text-[11px] font-bold text-gray-700">
      {label}:
    </Label.Root>
    <input
      type="text"
      value={value}
      readOnly
      className="w-[65%] text-xs px-2 py-[3px] border border-gray-200 rounded bg-gray-50 text-gray-800 transition-colors duration-200 hover:border-primary-400 focus:outline-none"
    />
  </motion.div>
);

export default DeviceCardUser;