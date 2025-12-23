import { Search } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { CategoryFilterType } from "../data/categories";
import { Link, useLocation } from "react-router-dom";

type HeaderProps = {
  favoriteCount: number;
  input: string;
  setInput: (value: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  categoryFilter: CategoryFilterType;
  setCategoryFilter: Dispatch<SetStateAction<CategoryFilterType>>;
  tripName: string;
  tripNameLoading: boolean;
  tripNameError: string | null;
  onSaveTripName: (newName: string) => Promise<void>;
};

const Header = ({
  favoriteCount,
  input,
  setInput,
  handleSearch,
  categoryFilter,
  setCategoryFilter,
  tripName,
  tripNameLoading,
  tripNameError,
  onSaveTripName,
}: HeaderProps) => {
  const [isEditingTripName, setIsEditingTripName] = useState(false);
  const [newTripName, setNewTripName] = useState(tripName);
  const [newTripNameSaving, setNewTripNameSaving] = useState(false);
  const [tripNameSaveError, settripNameSaveError] = useState<string | null>(
    null
  );

  useEffect(() => {
    setNewTripName(tripName);
  }, [tripName]);

  const { pathname, search } = useLocation();

  return (
    <header className="w-full max-w-5xl mx-auto gap-2">
      <div className="mt-2 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center  gap-2 mb-2">
          {tripNameLoading ? (
            <span>trip名を読み込み中...</span>
          ) : isEditingTripName ? (
            <>
              <input
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                className="border border-yellow-900 rounded px-2 py-1 bg-white text-sm w-56"
                maxLength={40}
              />
              <button
                type="button"
                disabled={newTripNameSaving}
                onClick={async () => {
                  try {
                    setNewTripNameSaving(true);
                    settripNameSaveError(null);
                    await onSaveTripName(newTripName);
                    setIsEditingTripName(false);
                  } catch (e: any) {
                    settripNameSaveError(e?.message ?? "保存に失敗しました。");
                  } finally {
                    setNewTripNameSaving(false);
                  }
                }}
                className="text-sm px-3 py-1 rounded border border-yellow-900 bg-yellow-900 text-white disabeld:opacity-60"
              >
                {newTripNameSaving ? "保存中..." : "保存"}
              </button>
              <button
                type="button"
                disabled={newTripNameSaving}
                onClick={() => {
                  setNewTripName(tripName);
                  setIsEditingTripName(false);
                  settripNameSaveError(null);
                }}
                className="text-xs px-3 py-1 rounded border border-slate-400 text-slate-700 disabled:opacity-60"
              >
                キャンセル
              </button>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-slate-900 relative left-2">
                {tripName || "Your Trip"}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setNewTripName(tripName);
                  setIsEditingTripName(true);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-yellow-900 text-yellow-900 hover:bg-yellow-100 relative top-1 left-2"
              >
                変更
              </button>
            </>
          )}
        </div>
        {tripNameError && (
          <div className="text-xs text-red-600 mt-1">{tripNameError}</div>
        )}
        {tripNameSaveError && (
          <div className="text-xs text-red-600 mt-1">{tripNameSaveError}</div>
        )}

        {favoriteCount > 0 && (
          <div className="flex items-center">
            <span className="text-sm px-3.5 pb-1.5 pt-1 mb-3 rounded-full bg-yellow-900 text-white">
              お気に入り数： {favoriteCount}
            </span>
          </div>
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
      <div className="mt-0.5 flex justify-center">
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
