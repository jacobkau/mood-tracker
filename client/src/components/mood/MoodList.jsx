import axios from "axios";

export default function MoodList({ moods, setMoods }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/moods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoods(moods.filter((mood) => mood._id !== id));
    } catch (err) {
      console.error("Failed to delete mood", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Mood History</h2>
      {moods.length === 0 ? (
        <p className="text-gray-500">No moods logged yet.</p>
      ) : (
        <ul className="space-y-3">
          {moods.map((mood) => (
            <li
              key={mood._id}
              className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
            >
              <div>
                <span className="font-medium">{mood.mood}</span>
                {mood.notes && (
                  <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(mood.date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(mood._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}