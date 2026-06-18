// src/components/dashboardComponents/DeviceCard2.tsx
import React, { useState } from "react";
import * as Label from "@radix-ui/react-label";
import deviceImage from "../../assets/device 1.png";
import { Pencil1Icon, TrashIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { getImageUrl } from "../../utils/image";
import { motion, AnimatePresence } from "framer-motion";

type DeviceCard2Props = {
  id: string;
  image?: string;
  deviceType: string;
  serialNo: string;
  department?: string;
  plant?: string;
  userName?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDetails?: (id: string) => void;
};

const DeviceCard2: React.FC<DeviceCard2Props> = ({
  id,
  image,
  deviceType,
  serialNo,
  department,
  plant,
  userName,
  onEdit,
  onDelete,
  onDetails,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete?.(id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <motion.div
        className="w-full bg-white rounded-xl shadow-xl p-3 space-y-3 text-sm border border-gray-100 relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          y: -4,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.2 }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with Device ID - Removed "Click for options" */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-mono">{id.slice(0, 8)}</span>
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
          <Field label="Department" value={department || "N/A"} />
          <Field label="Plant" value={plant || "N/A"} />
          <Field label="User" value={userName || "Unassigned"} />
        </div>

        <div className="flex justify-between items-center mt-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onDetails?.(id)}
              className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
            >
              <EyeOpenIcon className="w-2.5 h-2.5" />
              Details
            </Button>
          </motion.div>

          <div className="flex gap-0.5">
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                className="px-1.5 text-gray-600 hover:text-primary-400 transition-colors duration-200"
                onClick={() => onEdit?.(id)}
              >
                <Pencil1Icon className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                className="px-1.5 text-gray-600 hover:text-red-600 transition-colors duration-200"
                onClick={handleDelete}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Device</h3>
              <p className="text-gray-600 text-sm mb-4">
                Are you sure you want to delete device <span className="font-mono font-semibold">{deviceType}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-1 rounded transition-colors"
                >
                  Cancel
                </Button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={confirmDelete}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded transition-colors"
                  >
                    Delete
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
    <Label.Root className="w-[40%] text-[11px] font-bold text-gray-700">
      {label}:
    </Label.Root>

    <span className="w-[60%] text-xs px-2 py-[3px] border border-gray-200 rounded bg-gray-50 text-gray-800 transition-colors duration-200 hover:border-primary-400">
      {value}
    </span>
  </motion.div>
);

export default DeviceCard2;