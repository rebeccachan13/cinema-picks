export default function SearchBox({ value, onChange, onClear }) {
    const handleChange = (event) => {
      if (onChange) {
        onChange(event.target.value);
      }
    };
  
    return (
      <div>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:border-orange-600 "
          value={value}
          onChange={handleChange}
          placeholder="Please enter a movie title"
        />

        <button
        type="button"
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        onClick={onClear}
            > Clear
        </button>
      </div>
    );
  };
