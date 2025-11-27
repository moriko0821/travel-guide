import { Star } from "lucide-react";
import type { Location } from "../data/locations";

type SidebarProps = {
  selectedLocation: Location | null;
  isSelectedFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteLocations: Location[];
  onSetSelectedLocation: (loc: Location) => void;
};

const Sidebar = ({
  selectedLocation,
  isSelectedFavorite,
  onToggleFavorite,
  favoriteLocations,
  onSetSelectedLocation,
}: SidebarProps) => {
  return (
    <aside className="md:w-1/3 w-full">
      {selectedLocation ? (
        <div className="bg-white border-2 border-yellow-900 rounded-md px-4 py-3 shadow-sm">
          <h2 className="font-semibold text-lg">{selectedLocation.name}</h2>
          <p className="text-sm text-slate-600 mt-1">
            {selectedLocation.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs bg-yellow-200 px-2 py-1 rounded">
              #{selectedLocation.category}
            </p>
            <button
              type="button"
              onClick={onToggleFavorite}
              className="inline-flex items-center justify-center px-2.5 py-1 border border-yellow-900 rounded-full bg-white hover:bg-yellow-50"
            >
              <Star
                className={`w-4 h-4 ${
                  isSelectedFavorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-600"
                }`}
              />
            </button>
          </div>
        </div>
      ) : (
        <p>マーカーをクリックすると、ここに場所の情報が表示されます。</p>
      )}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">
          お気に入り一覧
        </h3>
        {favoriteLocations.length === 0 ? (
          <p className="text-xs text-slate-500">まだお気に入りはありません</p>
        ) : (
          <ul className="space-y-1">
            {favoriteLocations.map((loc) => (
              <li
                key={loc.id}
                className="text-sm text-slate-700 cursor-pointer hover:bg-yellow-50 rounded px-2 py-1"
                onClick={() => onSetSelectedLocation(loc)}
              >
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
