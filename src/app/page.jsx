"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreditsModal from "@/components/CreditsModal";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  // Set your password here or use environment variable
  const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_CHALLENGE_PASSWORD || "REVERSE2025";

  // Generate unique user ID
  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      // Generate unique user ID and store it
      const userId = generateUserId();
      sessionStorage.setItem("challenge_access", "granted");
      sessionStorage.setItem("challenge_user_id", userId);
      router.push("/challenge");
    } else {
      setPasswordError("ACCESS DENIED!");
      setTimeout(() => setPasswordError(""), 2000);
      setPassword("");
    }
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
        }
        
        .glow-cyan {
          text-shadow: 
            0 0 10px rgba(34, 211, 238, 0.8),
            0 0 20px rgba(34, 211, 238, 0.6),
            0 0 30px rgba(34, 211, 238, 0.4);
        }
        
        .pixel-border {
          box-shadow: 
            0 0 0 2px #22d3ee,
            0 0 15px rgba(34, 211, 238, 0.6),
            inset 0 0 15px rgba(34, 211, 238, 0.2);
        }
        
        .bg-image {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),
            url('/bg.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        
        .menu-button {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .menu-button:hover {
          transform: translateX(10px);
        }
        
        .menu-button::before {
          content: '►';
          position: absolute;
          left: -30px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .menu-button:hover::before {
          opacity: 1;
        }
        
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            transparent 50%,
            rgba(34, 211, 238, 0.05) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
          animation: scanline 8s linear infinite;
        }
        
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        
        .flicker {
          animation: flicker 3s infinite;
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          41%, 43% { opacity: 0.8; }
          45%, 47% { opacity: 1; }
        }
      `}</style>

      {/* Background with image */}
      <div className="bg-image absolute inset-0 z-0"></div>
      
      {/* Scanline effect */}
      <div className="scanline z-10"></div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center space-y-12 px-8">
        
        {/* Game Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl text-cyan-400 pixel-font glow-cyan flicker leading-relaxed">
            REVERSE
          </h1>
          <h2 className="text-3xl md:text-4xl text-cyan-500 pixel-font glow-cyan leading-relaxed">
            CODING.CHALLENGE
          </h2>
          <div className="mt-4 text-cyan-600 text-xs pixel-font">
            [ DECODE • ANALYZE • SOLVE ]
          </div>
        </div>

        {/* Menu Options */}
        <div className="flex flex-col space-y-6 mt-12">
          
          {/* Begin Challenge */}
          <button 
            onClick={() => setShowPassword(true)}
            className="menu-button w-80 bg-black border-2 border-cyan-500 text-cyan-400 px-8 py-4 pixel-font text-sm hover:bg-cyan-900 hover:border-cyan-400 transition-all pixel-border"
          >
            BEGIN.CHALLENGE
          </button>

          {/* Credits */}
          <button 
            onClick={() => setShowCredits(true)}
            className="menu-button w-80 bg-black border-2 border-cyan-500 text-cyan-400 px-8 py-4 pixel-font text-sm hover:bg-cyan-900 hover:border-cyan-400 transition-all pixel-border"
          >
            CREDITS
          </button>

          {/* Exit Game */}
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to exit?')) {
                window.close();
              }
            }}
            className="menu-button w-80 bg-black border-2 border-cyan-700 text-cyan-600 px-8 py-4 pixel-font text-sm hover:bg-gray-900 hover:border-cyan-600 hover:text-cyan-500 transition-all"
          >
            EXIT.GAME
          </button>
        </div>
      </div>

      {/* Credits Modal */}
      {showCredits && (
        <CreditsModal setShowCredits={setShowCredits} />
      )}

      {/* Password Modal */}
      {showPassword && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative z-10 w-full max-w-md">
            <div className="border-4 border-cyan-400 p-8 bg-black shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              <h2 className="text-2xl mb-6 text-cyan-400 text-center pixel-font glow-cyan">
                ENTER.PASSWORD
              </h2>
              
              <div className="space-y-6">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handlePasswordKeyPress}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-900 border-2 border-cyan-400 text-cyan-300 text-sm focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(34,211,238,0.5)] pixel-font placeholder:text-cyan-800"
                    autoFocus
                  />
                </div>
                
                {passwordError && (
                  <div className="text-red-500 text-xs text-center animate-pulse pixel-font">
                    {passwordError}
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button
                    onClick={handlePasswordSubmit}
                    className="flex-1 px-6 py-3 bg-cyan-600 border-2 border-cyan-400 text-black font-bold hover:bg-cyan-500 transition-all text-sm pixel-font shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                  >
                    [ ENTER ]
                  </button>
                  <button
                    onClick={() => {
                      setShowPassword(false);
                      setPassword("");
                      setPasswordError("");
                    }}
                    className="flex-1 px-6 py-3 bg-red-600 border-2 border-red-400 text-white font-bold hover:bg-red-500 transition-all text-sm pixel-font"
                  >
                    [ CANCEL ]
                  </button>
                </div>

                <div className="text-center text-cyan-700 text-xs pixel-font pt-2">
                  HINT: CHECK WITH ORGANIZERS
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}