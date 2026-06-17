import { useState, useEffect } from "react";
import { Lock, Clock } from "lucide-react";
import { pointsAPI } from "../utils/api";

export const DailyRewards = ({ theme }) => {
  const [dailyRewardsData, setDailyRewardsData] = useState(null);
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState("");

  const rewardAmounts = [50, 50, 50, 50, 50, 50, 100];

  useEffect(() => {
    fetchRewardsData();
    const interval = setInterval(fetchRewardsData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!dailyRewardsData?.canClaimAt) return;

    const updateTimer = () => {
      const now = new Date();
      const canClaimAt = new Date(dailyRewardsData.canClaimAt);
      const diff = canClaimAt - now;

      if (diff <= 0) {
        setTimeUntilNext("Ready to claim!");
        fetchRewardsData(); // Refresh data
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dailyRewardsData]);

  const fetchRewardsData = async () => {
    try {
      const response = await pointsAPI.getInfo();
      setDailyRewardsData(response.data.dailyRewards);
    } catch (error) {
      console.error('Error fetching rewards data:', error);
    }
  };

  const handleClaim = async (dayIndex) => {
    if (claiming) return;
    if (dailyRewardsData.currentDay !== dayIndex) return;
    if (dailyRewardsData.canClaimAt && new Date() < new Date(dailyRewardsData.canClaimAt)) return;

    setClaiming(true);
    setMessage("");

    try {
      const response = await pointsAPI.claimDaily();
      setMessage(`+${response.data.reward} XP Points!`);
      
      // Trigger points update event
      window.dispatchEvent(new Event('pointsUpdated'));
      
      // Refresh data
      await fetchRewardsData();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Error claiming reward:', error);
      setMessage(error.response?.data?.message || 'Error claiming reward');
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setClaiming(false);
    }
  };

  const getDayStatus = (dayIndex) => {
    if (!dailyRewardsData) return 'locked';
    
    const currentDay = dailyRewardsData.currentDay;
    
    if (dayIndex < currentDay) {
      return 'claimed';
    } else if (dayIndex === currentDay) {
      if (dailyRewardsData.canClaimAt && new Date() < new Date(dailyRewardsData.canClaimAt)) {
        return 'waiting';
      }
      return 'ready';
    } else {
      return 'locked';
    }
  };

  return (
    <div className="rounded-2xl p-6 shadow-md"
      style={{
        background: "rgba(8, 8, 12, 0.85)",
        border: `1px solid ${theme.accent}25`,
        backdropFilter: "blur(16px)",
        boxShadow: `0 16px 45px rgba(0, 0, 0, 0.6)`
      }}>
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="font-techno text-sm font-bold uppercase" 
          style={{ color: theme.accent, letterSpacing: "0.1em" }}
        >
          Daily Rewards
        </h3>
        {dailyRewardsData?.canClaimAt && new Date() < new Date(dailyRewardsData.canClaimAt) && (
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Clock className="w-4 h-4" />
            <span>{timeUntilNext}</span>
          </div>
        )}
      </div>

      {message && (
        <div 
          className="mb-4 p-3 rounded-lg text-center font-techno text-sm font-bold"
          style={{ 
            background: `${theme.accent}20`,
            color: theme.accent 
          }}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {rewardAmounts.map((reward, index) => {
          const status = getDayStatus(index);
          const isActive = status === 'ready';
          const isClaimed = status === 'claimed';
          const isWaiting = status === 'waiting';
          const isLocked = status === 'locked';

          return (
            <button
              key={index}
              onClick={() => handleClaim(index)}
              disabled={!isActive || claiming}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300
                ${isActive ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                ${isClaimed ? 'opacity-50' : ''}
              `}
              style={{
                borderColor: isActive ? theme.accent : isWaiting ? `${theme.accent}50` : 'rgba(255,255,255,0.08)',
                background: isActive ? `${theme.accent}15` : isClaimed ? 'rgba(255,255,255,0.02)' : isWaiting ? `${theme.accent}05` : 'rgba(255,255,255,0.01)',
              }}
            >
              {/* Day Label */}
              <div className="text-xs font-techno font-bold text-white/70 mb-1">
                D{index + 1}
              </div>

              {/* Icon/Status */}
              <div className="mb-1">
                {isClaimed ? (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: theme.accent }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : isLocked ? (
                  <Lock className="w-6 h-6 text-white/30" />
                ) : isWaiting ? (
                  <Clock className="w-6 h-6" style={{ color: `${theme.accent}80` }} />
                ) : (
                  <svg 
                    className="w-6 h-6 animate-pulse" 
                    viewBox="0 0 24 24" 
                    fill={theme.accent}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                    <path d="M2 12L12 17L22 12" />
                  </svg>
                )}
              </div>

              {/* Reward Amount */}
              <div 
                className="text-xs font-bold"
                style={{ 
                  color: isActive ? theme.accent : isClaimed ? 'rgba(255,255,255,0.7)' : isWaiting ? `${theme.accent}80` : 'rgba(255,255,255,0.6)' 
                }}
              >
                +{reward}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-white/50 text-center">
        Claim daily rewards to earn XP Points!
      </div>
    </div>
  );
};
