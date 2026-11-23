'use client';

import React, { useState, useEffect, useRef } from 'react';

const PRODUCTION_URL = 'https://brain-battery-three.vercel.app';
const BATTERY_ICON = String.fromCharCode(0xd83d, 0xdd0b); // 🔋
const ZAP_ICON = String.fromCharCode(0x26a1); // ⚡
const TARGET_ICON = String.fromCharCode(0xd83c, 0xdcaf); // 🎯
const BRAIN_ICON = String.fromCharCode(0xd83e, 0xdde0); // 🧠

export default function BrainBatteryDemo() {
  const [step, setStep] = useState('intro'); // intro | reflex | stroop | memory | result
  const [reflexState, setReflexState] = useState('waiting'); // waiting | ready | go | early
  const [reflexTimes, setReflexTimes] = useState([]);
  const [stroopIndex, setStroopIndex] = useState(0);
  const [stroopScore, setStroopScore] = useState(0);
  const [memoryPhase, setMemoryPhase] = useState('show'); // show | guess
  const [targetTiles, setTargetTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [targetScore, setTargetScore] = useState(null);
  const [challengerName, setChallengerName] = useState('A friend');
  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);

  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  const stroopRounds = [
    { word: 'RED', ink: 'BLUE', options: ['RED', 'BLUE', 'GREEN'] },
    { word: 'GREEN', ink: 'RED', options: ['RED', 'BLUE', 'GREEN'] },
    { word: 'BLUE', ink: 'GREEN', options: ['RED', 'BLUE', 'GREEN'] },
    { word: 'YELLOW', ink: 'RED', options: ['YELLOW', 'RED', 'BLUE'] },
  ];

  // Read incoming challenge params (?beat=84&from=Rohan) & saved player name
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const beatParam = params.get('beat');
    const fromParam = params.get('from');

    if (beatParam !== null) {
      const parsed = Number(beatParam);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        setTargetScore(parsed);
      }
    }
    if (fromParam && fromParam.trim()) {
      setChallengerName(fromParam.trim().slice(0, 24));
    }

    const savedName = window.localStorage.getItem('bb_player_name');
    if (savedName) setPlayerName(savedName);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value.slice(0, 20);
    setPlayerName(val);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('bb_player_name', val);
    }
  };

  // --- ROUND 1: REFLEX ---
  const startReflexRound = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setReflexState('ready');
    const delay = 1200 + Math.random() * 2000;
    timerRef.current = setTimeout(() => {
      setReflexState('go');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleReflexTap = () => {
    if (reflexState === 'ready') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setReflexState('early');
      return;
    }
    if (reflexState === 'go') {
      const rt = Math.round(performance.now() - startTimeRef.current);
      const updated = [...reflexTimes, rt];
      setReflexTimes(updated);
      if (updated.length >= 2) {
        setStep('stroop');
      } else {
        startReflexRound();
      }
    }
  };

  // --- ROUND 2: STROOP ---
  const handleStroopAnswer = (choice) => {
    if (choice === stroopRounds[stroopIndex].ink) {
      setStroopScore((s) => s + 1);
    }
    if (stroopIndex + 1 < stroopRounds.length) {
      setStroopIndex((i) => i + 1);
    } else {
      startMemoryRound();
    }
  };

  // --- ROUND 3: MEMORY ---
  const startMemoryRound = () => {
    setStep('memory');
    setMemoryPhase('show');
    const pool = Array.from({ length: 16 }, (_, i) => i);
    const chosen = pool.sort(() => 0.5 - Math.random()).slice(0, 5);
    setTargetTiles(chosen);
    setSelectedTiles([]);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMemoryPhase('guess'), 1400);
  };

  const toggleTile = (idx) => {
    if (memoryPhase !== 'guess' || selectedTiles.includes(idx)) return;
    const next = [...selectedTiles, idx];
    setSelectedTiles(next);
    if (next.length === targetTiles.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStep('result'), 350);
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setReflexTimes([]);
    setReflexState('waiting');
    setStroopIndex(0);
    setStroopScore(0);
    setTargetTiles([]);
    setSelectedTiles([]);
    setCopied(false);
    setStep('reflex');
    startReflexRound();
  };

  // --- SCORING ---
  const avgReflex = reflexTimes.length
    ? Math.round(reflexTimes.reduce((a, b) => a + b, 0) / reflexTimes.length)
    : 250;
  const memoryHits = selectedTiles.filter((t) => targetTiles.includes(t)).length;
  const batteryScore = Math.min(
    99,
    Math.max(40, Math.round(100 - (avgReflex - 180) / 8 + stroopScore * 4 + memoryHits * 4))
  );
  const mentalAge = Math.max(18, Math.round(52 - batteryScore * 0.32));

  const hasChallenge = targetScore !== null;
  const beatFriend = hasChallenge && batteryScore > targetScore;
  const tiedFriend = hasChallenge && batteryScore === targetScore;

  const cleanName = playerName.trim();
  const queryString = cleanName
    ? `?beat=${batteryScore}&from=${encodeURIComponent(cleanName)}`
    : `?beat=${batteryScore}`;

  const challengeLink = `${PRODUCTION_URL}${queryString}`;

  const headlinePrefix = cleanName
    ? `${BATTERY_ICON} ${cleanName}'s Brain Battery today: ${batteryScore}%`
    : `${BATTERY_ICON} My Brain Battery today: ${batteryScore}%`;

  const shareText =
    `${headlinePrefix} (Mental Age: ${mentalAge})\n` +
    `${ZAP_ICON} Reflex: ${avgReflex}ms | ${TARGET_ICON} Focus: ${stroopScore}/4 | ${BRAIN_ICON} Memory: ${memoryHits}/5\n` +
    `Can you beat ${batteryScore}% in 45s? Try here: ${challengeLink}`;

  const whatsappHref = `https://wa.me/?${new URLSearchParams({ text: shareText }).toString()}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(challengeLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        {step === 'intro' && (
          <div className="text-center space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
              45-SECOND COGNITIVE CHECK
            </div>

            {hasChallenge && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium">
                {TARGET_ICON} <span className="font-bold">{challengerName}</span> set a Brain Battery of{' '}
                <span className="font-extrabold text-amber-400">{targetScore}%</span>. Can you beat it?
              </div>
            )}

            <h1 className="text-3xl font-extrabold tracking-tight">Brain Battery™</h1>
            <p className="text-zinc-400 text-sm">
              Test your reflex speed, impulse control, and working memory. See your Mental Age & challenge friends.
            </p>
            <button
              onClick={resetGame}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-lg transition"
            >
              {hasChallenge ? `Beat ${targetScore}%` : 'Start Test'}
            </button>
          </div>
        )}

        {step === 'reflex' && (
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              1/3 • Reflex Speed ({reflexTimes.length}/2)
            </p>
            <div
              onClick={handleReflexTap}
              className={`h-64 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none transition ${reflexState === 'go'
                  ? 'bg-emerald-500 text-zinc-950'
                  : reflexState === 'early'
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-rose-600 text-white'
                }`}
            >
              <span className="text-2xl font-black">
                {reflexState === 'ready' && 'WAIT FOR GREEN...'}
                {reflexState === 'go' && 'TAP NOW!'}
                {reflexState === 'early' && 'TOO EARLY! Tap to retry'}
              </span>
              {reflexState === 'early' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startReflexRound();
                  }}
                  className="mt-3 px-4 py-1.5 bg-zinc-950 text-white rounded-lg text-xs"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'stroop' && (
          <div className="space-y-6 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              2/3 • Tap the INK COLOR ({stroopIndex + 1}/{stroopRounds.length})
            </p>
            <div className="h-36 rounded-2xl bg-zinc-950 flex items-center justify-center">
              <span
                className="text-5xl font-black tracking-wider"
                style={{ color: stroopRounds[stroopIndex].ink.toLowerCase() }}
              >
                {stroopRounds[stroopIndex].word}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {stroopRounds[stroopIndex].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleStroopAnswer(opt)}
                  className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'memory' && (
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              3/3 • {memoryPhase === 'show' ? 'Memorize Glowing Tiles' : 'Tap the 5 Tiles'}
            </p>
            <div className="grid grid-cols-4 gap-2 aspect-square">
              {Array.from({ length: 16 }).map((_, idx) => {
                const isLit = memoryPhase === 'show' && targetTiles.includes(idx);
                const isPicked = selectedTiles.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleTile(idx)}
                    className={`rounded-xl transition ${isLit
                        ? 'bg-emerald-400 shadow-lg shadow-emerald-500/40'
                        : isPicked
                          ? 'bg-sky-500'
                          : 'bg-zinc-800'
                      }`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4">
            {hasChallenge && (
              <div
                className={`p-3 rounded-2xl border text-center text-xs font-bold ${beatFriend
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : tiedFriend
                      ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}
              >
                {beatFriend &&
                  `You beat ${challengerName}'s ${targetScore}% by +${batteryScore - targetScore}%!`}
                {tiedFriend && `Tied with ${challengerName} at ${targetScore}%!`}
                {!beatFriend &&
                  !tiedFriend &&
                  `${challengerName} still leads (${targetScore}% vs your ${batteryScore}%).`}
              </div>
            )}

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-zinc-950 border border-emerald-500/30 text-center space-y-2">
              <p className="text-xs text-emerald-400 font-semibold">
                {cleanName ? `${cleanName.toUpperCase()}'S BRAIN BATTERY` : "TODAY'S BRAIN BATTERY"}
              </p>
              <div className="text-5xl font-black text-white">{batteryScore}%</div>
              <p className="text-sm text-zinc-300">
                Estimated Mental Age:{' '}
                <span className="font-bold text-emerald-400">{mentalAge} yrs</span>
              </p>
              <div className="grid grid-cols-3 gap-2 pt-3 text-xs border-t border-zinc-800">
                <div>
                  <span className="text-zinc-400 block">Reflex</span>
                  <span className="font-bold">{avgReflex}ms</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Focus</span>
                  <span className="font-bold">{stroopScore}/4</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Memory</span>
                  <span className="font-bold">{memoryHits}/5</span>
                </div>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={playerName}
                onChange={handleNameChange}
                placeholder="Add your name to challenge link (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none text-xs text-white placeholder-zinc-500"
              />
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-center text-sm transition"
            >
              Challenge Friends on WhatsApp
            </a>

            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition truncate px-2"
              >
                {copied ? 'Link Copied' : `Copy ${queryString}`}
              </button>
              <button
                onClick={resetGame}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
              >
                Play Again
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-400">PRO REPORT + GROUP ROOMS</span>
                <span className="text-xs font-bold bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded">
                  ₹299
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Unlock your peak daily focus hours, 14-day cognitive recovery plan, and live Office/College Group Leaderboards.
              </p>
              <button className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white">
                Unlock Full Profile & Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}