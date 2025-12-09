import { Star } from "lucide-react";
import type { Location } from "../data/locations";
import { useEffect, useState } from "react";
import { CATEGORY_OPTIONS } from "./MapSection";

type SidebarProps = {
  selectedLocation: Location | null;
  isSelectedFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteLocations: Location[];
  onSetSelectedLocation: (loc: Location) => void;
  onDeleteLocation: (id: number) => void;
  onClearSelectedLocation: () => void;
  onUpdateLocation: (loc: Location) => void;
};

const Sidebar = ({
  selectedLocation,
  isSelectedFavorite,
  onToggleFavorite,
  favoriteLocations,
  onSetSelectedLocation,
  onDeleteLocation,
  onClearSelectedLocation,
  onUpdateLocation,
}: SidebarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (selectedLocation) {
      setEditName(selectedLocation.name);
      setEditCategory(selectedLocation.category);
      setEditDescription(selectedLocation.description);
    }
  }, [selectedLocation]);

  return (
    <aside className="md:w-1/3 w-full">
      {selectedLocation ? (
        <div className="bg-white border-2 border-yellow-900 rounded-md px-4 py-3 shadow-sm">
          {!isEditing ? (
            <>
              <h2 className="font-semibold text-lg">{selectedLocation.name}</h2>
              {selectedLocation.imageUrl && (
                <img
                  src={selectedLocation.imageUrl}
                  alt={selectedLocation.name}
                  className="my-2.5 w-full rounded-md max-h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;

                    e.currentTarget.src = "/no-image.png";

                    onUpdateLocation({
                      ...selectedLocation,
                      imageUrl: "",
                    });
                  }}
                />
              )}
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
              <div className="mt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-sm px-3 py-1 rounded-full bg-yellow-900 text-white hover:bg-yellow-800"
                >
                  スポットを編集
                </button>
                <button
                  type="button"
                  onClick={onClearSelectedLocation}
                  className="text-sm px-3 py-1 rounded-full bg-yellow-900 text-white hover:bg-yellow-800"
                >
                  地図全体を表示
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(`${selectedLocation.name}を削除しますか？`)
                    ) {
                      onDeleteLocation(selectedLocation.id);
                    }
                  }}
                  className="text-xs px-3 py-1 rounded-full border-2 border-slate-500 text-slate-600 hover:bg-red-100"
                >
                  スポットを削除
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-semibold text-lg mb-2">編集</h2>
              <input
                type="text"
                className="border rounded px-2 py-1 text-sm w-full mb-2.5"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="border rounded px-2 py-1 text-sm mb-2.5"
              >
                <option value="">カテゴリを選択</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
              <textarea
                className="border rounded px-2 py-1 text-sm w-full mb-2"
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-3 py-1 rounded-full bg-slate-300"
                  onClick={() => setIsEditing(false)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="text-sm px-3 py-1 rounded-full bg-yellow-900 text-white hover:bg-yellow-800"
                  onClick={() => {
                    onUpdateLocation({
                      ...selectedLocation,
                      name: editName,
                      category: editCategory,
                      description: editDescription,
                    });
                    setIsEditing(false);
                  }}
                >
                  保存
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p>マーカーを選択すると、場所の情報が表示されます。</p>
      )}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">
          お気に入り一覧
        </h3>
        {favoriteLocations.length === 0 ? (
          <p className="text-xs text-slate-500">まだお気に入りはありません</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {favoriteLocations.map((loc) => {
              const isActive =
                selectedLocation && selectedLocation.id === loc.id;
              return (
                <li
                  key={loc.id}
                  className={`flex items-center justify-between text-sm rounded-md px-3 py-2 cursor-pointer border ${
                    isActive
                      ? "bg-yellow-100 border-yellow-900"
                      : "bg-white border-yellow-600 hover:bg-yellow-50"
                  }`}
                  onClick={() => onSetSelectedLocation(loc)}
                >
                  {loc.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
