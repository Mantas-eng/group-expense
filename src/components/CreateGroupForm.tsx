import { useState } from "react";
import { useCreateGroup } from "../hooks/useCreateGroup";

interface Props {
  onGroupCreated: () => void;
}

export default function CreateGroupForm({ onGroupCreated }: Props) {
  const [title, setTitle] = useState("");
  const { create, loading, error } = useCreateGroup(onGroupCreated);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await create(title);
    setTitle("");
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="bg-white rounded-2xl shadow-md p-6 mx-auto m-5 space-y-6"
  style={{ width: '700px', minHeight: '350px' }}
>
  <h2 className="text-2xl font-semibold text-gray-800">Create New Group</h2>
  <input
    type="text"
    placeholder="New group title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    disabled={loading}
    className="w-full px-5 py-5 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    disabled={loading}
    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
  >
    {loading ? "Creating..." : "Create Group"}
  </button>
  {error && <p className="text-red-600 text-sm">{error}</p>}
</form>

  );
}
