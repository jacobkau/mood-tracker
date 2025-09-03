import { useTheme } from '../context/useTheme';

export default function MoodStats({ moods }) {
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];
  
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`p-6 rounded-lg shadow-md ${currentTheme.cardBg}`}>
      <h2 className={`text-xl font-semibold mb-4 ${currentTheme.bodyText}`}>Mood Analytics</h2>
      {Object.keys(moodCounts).length === 0 ? (
        <p className={currentTheme.bodySecondary}>No data yet.</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(moodCounts).map(([mood, count]) => (
            <div key={mood} className="flex items-center">
              <span className={`w-24 font-medium ${currentTheme.bodyText}`}>{mood}</span>
              <div className={`flex-1 h-4 rounded-full ${currentTheme.bodyBg}`}>
                <div
                  className={`h-4 rounded-full ${currentTheme.btnPrimary}`}
                  style={{ width: `${(count / moods.length) * 100}%` }}
                />
              </div>
              <span className={`ml-2 text-sm ${currentTheme.bodySecondary}`}>{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
