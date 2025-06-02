import { motion } from 'framer-motion';

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 rounded-[32px] border border-gray-200 flex items-center justify-center bg-black/30">
      {/* Loader spinner */}
      <motion.div
        className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
    </div>
  );
}
