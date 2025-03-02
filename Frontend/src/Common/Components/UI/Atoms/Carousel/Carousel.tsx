import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Carousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <motion.div
        className="absolute w-full h-full flex"
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }} 
      >
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </motion.div>
    </div>
  );
};

export const App = () => {
  const images = [
    "https://img.freepik.com/vector-gratis/concepto-recepcion-estilo-flat_23-2147975994.jpg",
    "https://img.freepik.com/free-photo/modern-office-building_1150-14194.jpg",
    "https://img.freepik.com/free-photo/modern-office-interior_1150-16204.jpg"
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Carousel images={images} />
    </div>
  );
};
