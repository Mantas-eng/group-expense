import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGroupDetail } from "../hooks/useGroupDetail";

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const {
    group,
    transactions,
    loading,
    error,
    addMember,
    removeMember,
    settle,
  } = useGroupDetail(Number(groupId));

  const [newMemberName, setNewMemberName] = useState("");

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500 italic select-none">
        Loading group details...
      </p>
    );
  if (error)
    return (
      <p className="p-6 text-center text-red-600 font-medium">{error}</p>
    );
  if (!group)
    return (
      <p className="p-6 text-center text-gray-500 font-medium">
        Group not found
      </p>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-3xl shadow-xl">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-900 border-b border-gray-200 pb-5">
        {group.title}
      </h1>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-5 text-gray-800 border-b border-gray-300 pb-3">
          Members
        </h2>
        <ul className="divide-y divide-gray-300 max-h-96 overflow-y-auto mb-8 rounded-lg border border-gray-200 shadow-sm">
          {group.members.map((member) => (
            <li
              key={member.id}
              className="flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition"
            >
              <span className="font-medium text-gray-900">{member.name}</span>
              <span
                className={`font-semibold ${
                  member.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {member.balance.toFixed(2)} €
              </span>
              {member.balance !== 0 ? (
                <button
                  onClick={() => settle(member.id)}
                  className="ml-6 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white px-4 py-2 rounded-lg shadow-md transition font-semibold"
                  aria-label={`Settle balance for ${member.name}`}
                >
                  Settle
                </button>
              ) : (
                <button
                  onClick={() => removeMember(member.id)}
                  className="ml-6 bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 text-white px-4 py-2 rounded-lg shadow-md transition font-semibold"
                  aria-label={`Remove member ${member.name}`}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newMemberName.trim()) return;
            addMember(newMemberName);
            setNewMemberName("");
          }}
          className="flex gap-4"
        >
          <input
            type="text"
            placeholder="New member name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="flex-grow border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
            aria-label="New member name"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 text-white font-semibold px-6 rounded-xl shadow-lg transition"
          >
            Add Member
          </button>
        </form>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-5 text-gray-800 border-b border-gray-300 pb-3">
          Transactions
        </h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 italic select-none">No transactions yet.</p>
        ) : (
          <ul className="space-y-5 max-h-[28rem] overflow-y-auto rounded-lg border border-gray-200 shadow-sm p-4">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="bg-gray-50 rounded-lg p-5 shadow hover:shadow-md transition"
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="font-semibold text-gray-900 text-lg">
                    Payer ID:{" "}
                    <span className="text-indigo-600 font-bold">{tx.payerId}</span>
                  </span>
                  <span className="text-green-700 font-semibold text-lg">
                    {tx.amount.toFixed(2)} €
                  </span>
                </div>
                <small className="text-gray-600 mt-2 block">
                  Split method: {tx.splitMethod}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="text-center">
        <Link to={`/groups/${groupId}/new-transaction`}>
          <button className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white px-8 py-3 rounded-2xl font-semibold shadow-xl transition">
            New Transaction
          </button>
        </Link>
      </div>
    </div>
  );
}
