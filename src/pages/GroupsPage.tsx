import { Link } from "react-router-dom";
import { useGroups } from "../hooks/useGroup";
import GroupCard from "../components/GroupCard";
import CreateGroupForm from "../components/CreateGroupForm";
import { Group } from "../types";

export default function GroupsPage() {          
  const { groups, loading, error, reload } = useGroups();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="flex justify-center
 text-3xl font-bold mb-6">Your Groups</h1>

      <section className="mb-8">
        <CreateGroupForm onGroupCreated={reload} />
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </section>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600" />
        </div>
      ) : groups.length === 0 ? (
        <p className="text-center text-gray-500">No groups found. Create one above!</p>
      ) : (
        <ul className="space-y-4">
          {groups.map((group: Group) => (
            <li key={group.id}>
              <Link to={`/groups/${group.id}`}>
                <GroupCard group={group} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
