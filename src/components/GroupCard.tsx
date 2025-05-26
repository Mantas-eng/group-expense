import { Group } from "../types";

interface Props {
  group: Group;
}

export default function GroupCard({ group }: Props) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 mb-6  mx-auto hover:shadow-xl transition-shadow duration-300"
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-2 truncate">{group.title}</h3>
      <p className="text-lg">
        Balance:{" "}
        <span className={group.balance >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
          {group.balance} €
        </span>
      </p>
    </div>
  );
}
