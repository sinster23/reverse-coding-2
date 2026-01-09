"use client";
import { useEffect, useState } from "react";
import CodeEditor from "../../components/CodeEditor";
import challenges from "../../lib/challenges";
import CODE_TEMPLATES from "../../lib/templates";
import { useRouter } from "next/navigation";

export default function ChallengePage() {
  const [currentStage, setCurrentStage] = useState(0);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(CODE_TEMPLATES[1].python);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completedStages, setCompletedStages] = useState([]);
  const [rateLimitMessage, setRateLimitMessage] = useState(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(8);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [localCooldown, setLocalCooldown] = useState(0); 
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const router = useRouter();

  const FRONTEND_COOLDOWN_SECONDS = 5; // Configurable cooldown duration

  useEffect(() => {
    const access = sessionStorage.getItem("challenge_access");
    if (access !== "granted") {
      router.push("/");
    }
  }, [router]);

  // Server-side cooldown timer effect (for rate limiting)
  useEffect(() => {
    if (cooldownTimer > 0) {
      const interval = setInterval(() => {
        setCooldownTimer(prev => {
          if (prev <= 1) {
            setRateLimitMessage(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownTimer]);

  // NEW: Frontend cooldown timer effect (to prevent spam)
  useEffect(() => {
    if (localCooldown > 0) {
      const interval = setInterval(() => {
        setLocalCooldown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [localCooldown]);

  useEffect(() => {
  if (completedStages.length === challenges.length && completedStages.length > 0) {
    setShowCompletionModal(true);
  }
}, [completedStages]);

  const currentChallenge = challenges[currentStage];

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const challengeId = currentChallenge.id;
    setCode(CODE_TEMPLATES[challengeId][newLanguage] || CODE_TEMPLATES[1].python);
  };

  const handleStageChange = (newStage) => {
    setCurrentStage(newStage);
    setResult(null);
    setRateLimitMessage(null);
    const challengeId = challenges[newStage].id;
    setCode(CODE_TEMPLATES[challengeId][language] || CODE_TEMPLATES[1][language]);
  };

  const runCode = async () => {
    setIsRunning(true);
    setResult(null);
    setRateLimitMessage(null);
    setLocalCooldown(FRONTEND_COOLDOWN_SECONDS); // NEW: Start frontend cooldown

    try {
      // Get user ID from session storage
      const userId = sessionStorage.getItem("challenge_user_id");

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          code,
          language,
          testCases: currentChallenge.testCases,
          userId // Send userId for rate limiting
        }),
      });

      const data = await res.json();
      
      // Update rate limit remaining from headers
      const remaining = res.headers.get('X-RateLimit-Remaining');
      if (remaining !== null) {
        setRateLimitRemaining(parseInt(remaining, 10));
      }
      
      // Handle rate limit
      if (res.status === 429) {
        const retryAfter = data.retryAfter || 30;
        setCooldownTimer(retryAfter);
        setRateLimitMessage({
          message: data.error || "Rate limit exceeded. Please wait before trying again.",
          retryAfter: retryAfter
        });
        setIsRunning(false);
        return;
      }

      if (!res.ok) {
        // Show error in a more user-friendly way
        if (res.status === 400 && data.details) {
          setResult({
            success: false,
            passed: 0,
            total: currentChallenge.testCases.length,
            results: [],
            error: data.details
          });
        } else {
          alert(`Error: ${data.error || "Failed to evaluate code"}`);
        }
        setIsRunning(false);
        return;
      }

      setResult(data);

      // If all tests pass and stage not completed yet
      if (data.success && !completedStages.includes(currentStage)) {
        setCompletedStages([...completedStages, currentStage]);
      }
    } catch (error) {
      alert("Failed to run code. Please try again.");
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const goToNextStage = () => {
    if (currentStage < challenges.length - 1 && completedStages.includes(currentStage)) {
      handleStageChange(currentStage + 1);
    }
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) {
      handleStageChange(currentStage - 1);
    }
  };

  // NEW: Check if button should be disabled
  const isButtonDisabled = isRunning || cooldownTimer > 0 || localCooldown > 0;

  // NEW: Get button text based on state
  const getButtonText = () => {
    if (isRunning) return "RUNNING...";
    if (cooldownTimer > 0) return `RATE.LIMIT (${cooldownTimer}s)`;
    if (localCooldown > 0) return `COOLDOWN (${localCooldown}s)`;
    return "RUN.TESTS";
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
        }
        
        .pixel-border {
          box-shadow: 
            0 0 0 2px #22d3ee,
            0 0 10px rgba(34, 211, 238, 0.5);
        }
        
        .glow-cyan {
          text-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
          border-left: 1px solid #22d3ee;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22d3ee;
          border-radius: 0px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
      `}</style>

      {/* Header */}
      <div className="bg-black border-b-4 border-cyan-500 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3">
            {challenges.map((challenge, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (idx === 0 || completedStages.includes(idx - 1)) {
                    handleStageChange(idx);
                  }
                }}
                className={`flex-1 p-3 border-2 cursor-pointer transition-all ${
                  idx === currentStage
                    ? "bg-cyan-900 border-cyan-400 pixel-border"
                    : completedStages.includes(idx)
                    ? "bg-cyan-950 border-cyan-600"
                    : "bg-gray-900 border-gray-700"
                } ${
                  idx > 0 && !completedStages.includes(idx - 1)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="text-center">
                  <div
                    className={`pixel-font text-xs mb-1 ${
                      idx === currentStage ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    LVL.{idx + 1}
                  </div>
                  <div
                    className={`pixel-font text-xs ${
                      completedStages.includes(idx)
                        ? "text-cyan-400"
                        : "text-gray-500"
                    }`}
                  >
                    {completedStages.includes(idx) ? "[✓]" : "[ ]"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 border-r-4 border-cyan-500 bg-black overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            {/* Challenge Header */}
            <div className="border-2 border-cyan-500 p-4 bg-gray-900">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 border-2 pixel-font text-xs ${
                    currentChallenge.level === "Easy"
                      ? "border-cyan-400 text-cyan-400"
                      : "border-yellow-400 text-yellow-400"
                  }`}
                >
                  {currentChallenge.level.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl text-cyan-400 pixel-font mb-3 leading-relaxed">
                {currentChallenge.title}
              </h2>
              <p className="text-cyan-300 text-sm leading-relaxed mb-4">
                Decode the pattern by analyzing the sample inputs and outputs
                below. Write a function that produces the same results.
              </p>
              <div className="border-t border-cyan-700 pt-3 mt-3">
                <p className="text-cyan-500 text-xs pixel-font">
                  REVERSE.CODING.MODE
                </p>
                <p className="text-cyan-600 text-xs mt-2">
                  Study the examples to understand the logic, then implement
                  your solution.
                </p>
              </div>
            </div>

            {/* Sample Cases */}
            <div className="border-2 border-cyan-500 bg-gray-900">
              <div className="bg-cyan-900 border-b-2 border-cyan-500 p-3">
                <h3 className="text-cyan-400 pixel-font text-xs">
                  DECODE.THESE.PATTERNS
                </h3>
                <p className="text-cyan-600 text-xs mt-2">
                  Analyze inputs → outputs to find the logic
                </p>
              </div>
              <div className="p-4 space-y-3">
                {currentChallenge.samples.map((s, i) => (
                  <div key={i} className="border border-cyan-700 bg-black p-3">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-cyan-600 pixel-font mb-2 text-xs">
                          INPUT:
                        </div>
                        <div className="text-cyan-400 font-mono bg-gray-900 p-2 border border-cyan-800">
                          {s.input}
                        </div>
                      </div>
                      <div>
                        <div className="text-cyan-600 pixel-font mb-2 text-xs">
                          OUTPUT:
                        </div>
                        <div className="text-cyan-400 font-mono bg-gray-900 p-2 border border-cyan-800">
                          {s.output}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Limit Warning */}
            {rateLimitMessage && (
              <div className="border-2 border-yellow-500 bg-yellow-950 p-4 animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 pixel-font text-xs">
                    ⚠ RATE.LIMIT
                  </span>
                </div>
                <p className="text-yellow-300 text-xs leading-relaxed mb-2">
                  {rateLimitMessage.message}
                </p>
                <p className="text-yellow-400 text-xs pixel-font">
                  COOLDOWN: {cooldownTimer}s
                </p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="border-2 border-cyan-500 bg-gray-900">
                <div
                  className={`p-4 border-b-2 ${
                    result.success
                      ? "bg-green-900 border-green-500"
                      : "bg-red-900 border-red-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 pixel-font text-xs">
                      {result.success ? "[SUCCESS]" : "[FAILED]"}
                    </span>
                    <span className="text-cyan-300 text-xs pixel-font">
                      {result.passed}/{result.total}
                    </span>
                  </div>
                </div>

                {/* Show error message if present */}
                {result.error && (
                  <div className="p-4 bg-red-950 border-b-2 border-red-800">
                    <div className="text-red-400 text-xs pixel-font mb-2">
                      ERROR:
                    </div>
                    <div className="text-red-300 text-xs leading-relaxed">
                      {result.error}
                    </div>
                  </div>
                )}

                <div className="divide-y divide-cyan-800 max-h-96 overflow-y-auto custom-scrollbar">
                  {result.results.slice(0, 10).map((test, i) => (
                    <div key={i} className="p-4 bg-black">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`pixel-font text-xs ${
                            test.passed ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          TEST.{i + 1} {test.passed ? "[✓]" : "[✗]"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-cyan-600 mb-1 text-xs">
                            INPUT
                          </div>
                          <div className="bg-gray-900 p-2 font-mono text-cyan-400 border border-cyan-800">
                            {test.input}
                          </div>
                        </div>
                        <div>
                          <div className="text-cyan-600 mb-1 text-xs">
                            EXPECT
                          </div>
                          <div className="bg-gray-900 p-2 font-mono text-cyan-400 border border-cyan-800">
                            {test.expected}
                          </div>
                        </div>
                        <div>
                          <div className="text-cyan-600 mb-1 text-xs">
                            OUTPUT
                          </div>
                          <div
                            className={`p-2 font-mono border ${
                              test.passed
                                ? "bg-green-950 text-green-400 border-green-600"
                                : "bg-red-950 text-red-400 border-red-600"
                            }`}
                          >
                            {test.actual}
                          </div>
                        </div>
                      </div>
                      {test.error && (
                        <div className="mt-2 text-xs text-red-400 bg-red-950 p-2 border border-red-800">
                          ERROR: {test.error}
                        </div>
                      )}
                    </div>
                  ))}
                  {result.results.length > 10 && (
                    <div className="p-4 bg-gray-900 text-center border-t-2 border-cyan-800">
                      <p className="text-cyan-500 text-xs pixel-font">
                        {result.results.length - 10} MORE TESTS HIDDEN
                      </p>
                      <p className="text-cyan-600 text-xs mt-2">
                        Showing first 10 results only
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={goToPreviousStage}
                disabled={currentStage === 0}
                className="px-4 py-3 border-2 border-cyan-500 text-cyan-400 pixel-font text-xs hover:bg-cyan-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                &lt; PREV
              </button>
              <button
                onClick={goToNextStage}
                disabled={
                  currentStage === challenges.length - 1 ||
                  !completedStages.includes(currentStage)
                }
                className="px-4 py-3 border-2 border-cyan-500 bg-cyan-900 text-cyan-400 pixel-font text-xs hover:bg-cyan-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                NEXT &gt;
              </button>
              {completedStages.length === challenges.length && (
                <div className="ml-auto px-4 py-3 border-2 border-cyan-400 bg-cyan-900 text-cyan-400 pixel-font text-xs pixel-border">
                  QUEST.COMPLETE!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 bg-black flex flex-col">
          <div className="bg-gray-900 border-b-2 border-cyan-500 px-6 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-cyan-400 pixel-font text-xs">CODE.EDITOR</h3>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={handleLanguageChange}
            />
          </div>
          <div className="bg-gray-900 border-t-2 border-cyan-500 p-6">
            <button
              onClick={runCode}
              disabled={isButtonDisabled}
              className="w-full bg-cyan-600 border-2 border-cyan-400 text-black px-6 py-4 pixel-font text-xs hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all pixel-border"
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
      {/* Completion Modal */}
{showCompletionModal && (
  <div className="fixed inset-0 bg-black/60 bg-opacity-90 flex items-center justify-center z-50 pixel-font">
    <div className="border-4 border-cyan-400 bg-black p-8 max-w-md pixel-border">
      <h2 className="text-cyan-400 text-xl mb-4 text-center glow-cyan">
         QUEST.COMPLETE! 
      </h2>
      <p className="text-cyan-300 text-xs mb-6 text-center leading-relaxed">
        Congratulations! You've successfully completed all {challenges.length} challenges!
      </p>
    </div>
  </div>
)}
    </div>
  );
}