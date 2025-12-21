import React from "react";

export default function CreditsModal({ setShowCredits }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .pixelated { font-family: 'Press Start 2P', monospace; }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        .glow-cyan {
          text-shadow: 
            0 0 10px rgba(34, 211, 238, 0.8),
            0 0 20px rgba(34, 211, 238, 0.6);
        }
      `}</style>

      <div className="relative z-10 text-center space-y-8 max-w-2xl w-full">
        <div className="border-4 border-cyan-400 p-8 bg-black shadow-[0_0_30px_rgba(34,211,238,0.5)]">
          <h1 className="text-4xl mb-8 text-cyan-400 pixelated glow-cyan">
            CREDITS
          </h1>

          <div className="space-y-6 text-cyan-300 text-sm pixelated">
            <div>
              <p className="mb-2 text-cyan-500">GAME DESIGN</p>
              <p className="text-white">REVERSE CODING CHALLENGE</p>
            </div>

            <div>
              <p className="mb-2 text-cyan-500">DEVELOPED BY</p>
              <p className="text-white">UPAYAN</p>
            </div>

            <div>
              <p className="mb-2 text-cyan-500">SPECIAL THANKS</p>
              <p className="text-white">ALL PARTICIPANTS</p>
            </div>

            <div className="pt-4 border-t-2 border-cyan-800">
              <p className="text-xs text-cyan-600">© 2025 REVERSE CODING</p>
              <p className="text-xs text-cyan-700 mt-2">POWERED BY KINETEX</p>
            </div>
          </div>

          <button
            onClick={() => setShowCredits(false)}
            className="mt-8 px-8 py-3 bg-cyan-600 border-2 border-cyan-400 text-black font-bold hover:bg-cyan-500 transition-all pixelated shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          >
            [ BACK ]
          </button>
        </div>
      </div>
    </div>
  );
}