export default function AddFavorites({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-white bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded"
    >
      ❤️ Add to Favorites
    </button>
  );
}

