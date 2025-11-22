import { Search } from "lucide-react";
import Map from "./components/Map";
import { useState } from "react";
import { locations } from "./data/locations";

function App() {
  const [input, setInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(locations);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (input.trim() === "") {
      setFilteredLocations(locations);
      return;
    }

    const lowerKeyword = input.toLowerCase();
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(lowerKeyword)
    );

    setFilteredLocations(filtered);

    console.log("search word is:", filtered);
  }

  return (
    <main className="min-h-screen bg-yellow-50 flex flex-col items-center py-8 px-2">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">Travel Guide</h1>
      <form onSubmit={handleSearch} className="flex w-full max-w-sm mx-auto">
        <input
          type="text"
          placeholder="Search"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="flex-1 border-2 border-yellow-900 rounded-s-md px-2 py-1.5 bg-white"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-e-md bg-yellow-950 text-white hover:bg-yellow-900 px-2"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      <Map locations={filteredLocations} />
    </main>
  );
}

export default App;
