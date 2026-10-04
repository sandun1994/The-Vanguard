// Autonomous Newsroom Engine Service
// Continuously scans Google search pattern breakouts and automatically publishes articles

import { runAgentPipeline } from './agentPipeline';
import { getArticles, getSettings, saveArticle } from './storage';
import { getTrendingKeywords, analyzeSearchPattern, fetchLiveGoogleTrends } from './trendsService';

const ENGINE_STORAGE_KEY = 'novum_autonomous_engine_state_v1';

// Dynamic pool of emerging breakout topics when all primary trends are exhausted
const ROTATING_EMERGING_TOPICS = [
  'Neuromorphic Computing Spiking Neural Networks 2026',
  'Photonic Silicon Quantum Processors Room Temperature',
  'CRISPR Prime Editing Multi-Base In Vivo Delivery',
  'Nuclear Fusion Magnetohydrodynamic Stellarator Milestones',
  'Zero-Knowledge Proofs Hardware Acceleration ASICs',
  'Next-Generation Sodium-Ion Battery Commercial Storage',
  'Atmospheric Carbon Mineralization Direct Air Capture 2026',
  'Synthetic Human Micro-Organoids Drug Screening Efficacy'
];

let engineIntervalTimer = null;
let currentRunningPromise = null;
let statusListeners = new Set();

export const getAutonomousEngineState = () => {
  try {
    const raw = localStorage.getItem(ENGINE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load autonomous engine state', e);
  }
  return {
    isRunning: false,
    lastRunAt: null,
    nextRunAt: null,
    totalAutoPublished: 0,
    lastPublishedArticle: null,
    recentLogs: []
  };
};

const saveAutonomousEngineState = (state) => {
  try {
    localStorage.setItem(ENGINE_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save autonomous engine state', e);
  }
};

const notifyListeners = (state) => {
  statusListeners.forEach(fn => {
    try {
      fn(state);
    } catch (e) {
      console.error(e);
    }
  });
};

export const subscribeAutonomousEngine = (callback) => {
  statusListeners.add(callback);
  callback(getAutonomousEngineState());
  return () => statusListeners.delete(callback);
};

/**
 * Finds the highest-velocity trending keyword that has not yet been written about
 */
export const findNextUnpublishedTrend = async () => {
  const existingArticles = getArticles();

  // Helper: Token overlap checker to prevent duplicate article topics
  const isTopicAlreadyCovered = (topicStr) => {
    if (!topicStr) return false;
    const cleanWords = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3);
    const targetWords = cleanWords(topicStr);
    if (targetWords.length === 0) return false;

    return existingArticles.some(article => {
      const articleWords = cleanWords((article.title || '') + ' ' + (article.summary || ''));
      const matches = targetWords.filter(w => articleWords.includes(w));
      return (matches.length / targetWords.length) >= 0.5;
    });
  };

  // 1. Check Admin-configured Scheduled Topic Queries from Settings first
  const settings = getSettings();
  if (settings.topics && Array.isArray(settings.topics)) {
    const activeTopics = settings.topics.filter(t => t.active !== false);
    for (const top of activeTopics) {
      if (top.query && !isTopicAlreadyCovered(top.query)) {
        return await analyzeSearchPattern(top.query);
      }
    }
  }

  // 2. Fetch fresh Live Google Trends before checking breakouts
  try {
    await fetchLiveGoogleTrends();
  } catch (e) {
    // Non-fatal, fallback to cached
  }

  // 3. Check Today's Breakouts from Trends Service (Live signals take top priority)
  const todayTrends = getTrendingKeywords({ timeframe: 'today' });
  for (const trend of todayTrends) {
    if (!isTopicAlreadyCovered(trend.keyword)) {
      return trend;
    }
  }

  // 3. Check This Week's & Month's Rising Trends
  const weekTrends = getTrendingKeywords({ timeframe: 'week' });
  for (const trend of weekTrends) {
    if (!isTopicAlreadyCovered(trend.keyword)) {
      return trend;
    }
  }

  // 4. Fallback: Select an emerging topic from the rotating pool
  for (const topic of ROTATING_EMERGING_TOPICS) {
    if (!isTopicAlreadyCovered(topic)) {
      return await analyzeSearchPattern(topic);
    }
  }

  // 5. Dynamic timestamped innovation fallback ensuring infinite non-duplicating topics
  const randomId = Math.floor(Math.random() * 9000 + 1000);
  return await analyzeSearchPattern(`Autonomous Scientific Breakthrough Discovery Vol-${randomId}`);
};

export const executeAutonomousNewsroomCycle = async (onStepProgress = () => {}) => {
  if (currentRunningPromise) {
    return currentRunningPromise;
  }

  const settings = getSettings();
  const state = getAutonomousEngineState();

  const cyclePromise = (async () => {
    state.isRunning = true;
    notifyListeners(state);

    try {
      // 1. Identify breakout trend pattern
      const targetTrend = await findNextUnpublishedTrend();
      const logEntry = `[${new Date().toLocaleTimeString()}] Autonomous Engine identified breakout trend: "${targetTrend.keyword}" (${targetTrend.velocity})`;
      state.recentLogs = [logEntry, ...(state.recentLogs || []).slice(0, 19)];
      saveAutonomousEngineState(state);
      notifyListeners(state);

      // 2. Run multi-agent newsroom pipeline
      const generatedArticle = await runAgentPipeline(
        targetTrend.keyword,
        (progress) => {
          onStepProgress(progress);
        },
        targetTrend
      );

      // 3. Update engine state with newly published article
      state.lastRunAt = new Date().toISOString();
      state.totalAutoPublished = (state.totalAutoPublished || 0) + 1;
      state.lastPublishedArticle = {
        id: generatedArticle.id,
        title: generatedArticle.title,
        keyword: targetTrend.keyword,
        velocity: targetTrend.velocity,
        category: generatedArticle.category,
        publishedAt: generatedArticle.publishedAt
      };
      
      const finishLog = `[${new Date().toLocaleTimeString()}] Successfully published article "${generatedArticle.title}" (Status: ${generatedArticle.status})`;
      state.recentLogs = [finishLog, ...(state.recentLogs || []).slice(0, 19)];
      
      // Calculate next run timestamp based on configured frequency
      const freqMinutes = parseInt(settings.autonomousFrequencyMinutes, 10) || 30;
      state.nextRunAt = Date.now() + (freqMinutes * 60 * 1000);
      state.isRunning = false;

      saveAutonomousEngineState(state);
      notifyListeners(state);

      // Trigger window event for instant live blog updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('the_vanguard_autonomous_article_published', {
          detail: { article: generatedArticle, trend: targetTrend }
        }));
      }

      return generatedArticle;
    } catch (err) {
      console.error('Autonomous cycle error:', err);
      state.isRunning = false;
      state.recentLogs = [`[${new Date().toLocaleTimeString()}] ERROR: ${err.message}`, ...(state.recentLogs || []).slice(0, 19)];
      saveAutonomousEngineState(state);
      notifyListeners(state);
      throw err;
    } finally {
      currentRunningPromise = null;
    }
  })();

  currentRunningPromise = cyclePromise;
  return cyclePromise;
};

/**
 * Starts or synchronizes the autonomous background scheduler
 */
export const syncAutonomousEngine = () => {
  const settings = getSettings();
  const isAutonomousMode = settings.governanceMode === 'autonomous';

  if (engineIntervalTimer) {
    clearInterval(engineIntervalTimer);
    engineIntervalTimer = null;
  }

  const state = getAutonomousEngineState();

  if (!isAutonomousMode) {
    state.isRunning = false;
    state.nextRunAt = null;
    saveAutonomousEngineState(state);
    notifyListeners(state);
    return;
  }

  // Autonomous mode is enabled: schedule interval
  const freqMinutes = parseInt(settings.autonomousFrequencyMinutes, 10) || 30;
  const intervalMs = Math.max(1, freqMinutes) * 60 * 1000;

  if (!state.nextRunAt || state.nextRunAt < Date.now()) {
    state.nextRunAt = Date.now() + intervalMs;
    saveAutonomousEngineState(state);
    notifyListeners(state);
  }

  // Periodic heartbeat timer checking if it's time to run
  engineIntervalTimer = setInterval(async () => {
    const currentState = getAutonomousEngineState();
    const currentSettings = getSettings();

    if (currentSettings.governanceMode !== 'autonomous') {
      clearInterval(engineIntervalTimer);
      engineIntervalTimer = null;
      return;
    }

    if (!currentState.isRunning && (!currentState.nextRunAt || Date.now() >= currentState.nextRunAt)) {
      try {
        await executeAutonomousNewsroomCycle();
      } catch (e) {
        console.error('Background auto-cycle execution failed', e);
      }
    }
  }, 10000); // Check heartbeat every 10 seconds
};
