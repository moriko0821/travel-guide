import { Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { CategoryFilterType } from "../data/categories";
import { Link, useLocation } from "react-router-dom";

type HeaderProps = {
  favoriteCount: number;
  input: string;
  setInput: (value: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  categoryFilter: CategoryFilterType;
  setCategoryFilter: Dispatch<SetStateAction<CategoryFilterType>>;
};

const { pathname, search } = useLocation();

const Header = ({
  favoriteCount,
  input,
  setInput,
  handleSearch,
  categoryFilter,
  setCategoryFilter,
}: HeaderProps) => {
  return (
    <header className="w-full max-w-5xl mx-auto text-center">
      <div className="flex items-center justify-center  gap-3 mb-4">
        <h1 className="text-4xl font-bold text-slate-800 leading-none">
          Travel Map Guide
        </h1>
        {favoriteCount > 0 && (
          <span className="text-xs px-2.5 py-1.5 mt-1.5 rounded-full bg-yellow-900 text-white">
            お気に入り： {favoriteCount}
          </span>
        )}
      </div>

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
          className="flex items-center justify-center rounded-e-md bg-yellow-900 text-white hover:bg-yellow-900 px-2"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      <div className="mt-3 flex justify-center">
        <div className="mt-4 flex justify-center gap-2">
          <Link
            to={`/${search}`}
            className={`px-4 py-1 text-sm rounded-full border-2 ${
              pathname === "/"
                ? "bg-yellow-900 text-white border-yellow-900"
                : "bg-white text-slate-700 border-yellow-800"
            }`}
          >
            地図
          </Link>
          <Link
            to={`/favorites${search}`}
            className={`px-3 py-1 text-sm rounded-full border-2 ${
              pathname === "/favorites"
                ? "bg-yellow-900 text-white border-yellow-900"
                : "bg-white text-slate-700 border-yellow-800"
            }`}
          >
            お気に入り一覧
          </Link>
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as CategoryFilterType)
            }
            className="border-2 border-yellow-900 rounded-xl px-2 py-1 bg-white text-sm"
          >
            <option value="all">all</option>
            <option value="city">city</option>
            <option value="nature">nature</option>
            <option value="restaurant">restaurant</option>
            <option value="museum">museum</option>
            <option value="hotel">museum</option>
            <option value="other">other</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
