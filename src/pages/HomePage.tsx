import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreLogo from '../components/ScoreLogo';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [currentTitle, setCurrentTitle] = useState(0);
  const titles = [
    "Enregistrer une dette",
    "Suivre vos créances",
    "Optimiser vos recouvrements"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-home-start to-home-end flex flex-col">
      <nav className="p-4 flex justify-between items-center">
        <ScoreLogo variant="horizontal" size="small" />
        <Link to="/login" className="btn bg-accent text-secondary hover:bg-accent-dark">
          Se connecter
        </Link>
      </nav>

      <div className="flex-1 flex">
        <div className="w-1/2 flex flex-col justify-center px-16">
          <div className="h-20"> {/* Fixed height container for smooth transitions */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-5xl font-bold text-white mb-4"
              >
                {titles[currentTitle]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="text-white/80 text-lg mb-8">
            Avec SCORE, diminuez vos impayés et facilitez le recouvrement de vos créances.
          </p>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Contact"
              className="form-input bg-white/10 text-white placeholder-white/50 border-white/20"
            />
            <button className="btn bg-accent text-secondary hover:bg-accent-dark">
              Send
            </button>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <motion.img
            src="/src/assets/score_phone.png"
            alt="Score App Preview"
            className="w-[400px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 0.5,
              y: 0,
              rotate: [30, -15, 30] // Animation de rotation : 30° ➝ -15° ➝ 30°
            }}
            transition={{
              delay: 0.5,
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;