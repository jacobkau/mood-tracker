export default function MoodStats({ moods }) {
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Mood Analytics</h2>
      {Object.keys(moodCounts).length === 0 ? (
        <p className="text-gray-500">No data yet.</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(moodCounts).map(([mood, count]) => (
            <div key={mood} className="flex items-center">
              <span className="w-24 font-medium">{mood}</span>
              <div className="flex-1 bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${(count / moods.length) * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}