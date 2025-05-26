import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGroupById } from "../services/api";
import { Group, SplitDetail, NewTransactionPayload } from "../types";
import { useCreateTransaction } from "../hooks/useCreateTransaction";
import Stepper from "../components/Stepper";

type SplitType = "equally" | "percentage" | "dynamic";

export default function NewTransaction() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [payerId, setPayerId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [splitType, setSplitType] = useState<SplitType>("equally");
  const [splitDetails, setSplitDetails] = useState<SplitDetail[]>([]);

  const {
    submit,
    loading: submitting,
    error: submitError,
  } = useCreateTransaction(() => navigate(`/groups/${groupId}`));

  const steps = ["Payer & Amount", "Split Details", "Review"];

  const initializeSplits = (
    groupData: Group,
    totalAmount: number,
    type: SplitType
  ) => {
    const nMembers = groupData.members.length;
    const initialSplits = groupData.members.map((member) => {
      if (type === "equally") {
        return {
          memberId: member.id,
          amount: totalAmount / nMembers,
          percentage: 100 / nMembers,
        };
      }
      if (type === "percentage") {
        return {
          memberId: member.id,
          amount: 0,
          percentage: 0,
        };
      }
      return {
        memberId: member.id,
        amount: 0,
        percentage: 0,
      };
    });
    setSplitDetails(initialSplits);
  };

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    fetchGroupById(+groupId)
      .then((res) => {
        const fetchedGroup = res.data;
        setGroup(fetchedGroup);
        initializeSplits(fetchedGroup, amount, splitType);
      })
      .catch(() => alert("Failed to load group data"))
      .finally(() => setLoading(false));
  }, [groupId]);

  const handleSplitTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as SplitType;
    setSplitType(selected);
    if (group) initializeSplits(group, amount, selected);
  };

  useEffect(() => {
    if (group && splitType === "equally") {
      initializeSplits(group, amount, splitType);
    }
  }, [amount, splitType, group]);

  const updateSplitDetail = (
    memberId: number,
    field: "amount" | "percentage",
    value: number
  ) => {
    setSplitDetails((prev) =>
      prev.map((sd) =>
        sd.memberId === memberId ? { ...sd, [field]: value } : sd
      )
    );
  };

  const canProceedStep1 = payerId !== null && amount > 0;

  const canProceedStep2 = useMemo(() => {
    if (!group) return false;

    if (splitType === "equally") return true;

    const reducer = splitType === "percentage"
      ? (sum: number, sd: SplitDetail) => sum + (sd.percentage || 0)
      : (sum: number, sd: SplitDetail) => sum + (sd.amount || 0);

    const total = splitDetails.reduce(reducer, 0);

    return splitType === "percentage"
      ? Math.abs(total - 100) < 0.01
      : Math.abs(total - amount) < 0.01;
  }, [splitDetails, amount, splitType, group]);

  const getMemberName = (id: number) =>
    group?.members.find((m) => m.id === id)?.name || "Unknown";

  const renderSplitInput = (memberId: number) => {
    const detail = splitDetails.find((sd) => sd.memberId === memberId);
    const value =
      splitType === "percentage" ? detail?.percentage : detail?.amount;

    return (
      <input
        type="number"
        min={0}
        max={splitType === "percentage" ? 100 : undefined}
        step="0.01"
        value={value ?? ""}
        onChange={(e) =>
          updateSplitDetail(
            memberId,
            splitType === "percentage" ? "percentage" : "amount",
            +e.target.value
          )
        }
        className="border border-gray-300 rounded-md px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
    );
  };

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600 text-lg font-medium">
        Loading...
      </p>
    );
  if (!group)
    return (
      <p className="p-6 text-center text-red-600 text-lg font-semibold">
        Group not found
      </p>
    );

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
        New Transaction - {group.title}
      </h1>

      <Stepper
        steps={steps}
        currentStep={step}
        onStepClick={(clickedStep) => {
          if (clickedStep < step) setStep(clickedStep);
        }}
      />

      {step === 1 && (
        <div className="space-y-6 mt-8">
          <label className="block">
            <span className="block text-gray-700 font-semibold mb-2">Payer</span>
            <select
              value={payerId ?? ""}
              onChange={(e) => setPayerId(+e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="" disabled>
                Select payer
              </option>
              {group.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-gray-700 font-semibold mb-2">Amount (€)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </label>

          <label className="block">
            <span className="block text-gray-700 font-semibold mb-2">Split Type</span>
            <select
              value={splitType}
              onChange={handleSplitTypeChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="equally">Equally</option>
              <option value="percentage">By Percentage</option>
              <option value="dynamic">Dynamic Amounts</option>
            </select>
          </label>

          <button
            disabled={!canProceedStep1}
            onClick={() => setStep(2)}
            className={`w-full py-3 rounded-md text-white text-lg font-semibold transition ${
              canProceedStep1
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Split Details</h2>
          {splitType === "equally" ? (
            <p className="text-gray-600 italic">
              The amount will be split equally among {group.members.length} members.
            </p>
          ) : (
            <div className="space-y-4 max-h-72 overflow-y-auto border border-gray-200 rounded-md p-4 shadow-inner bg-gray-50">
              {group.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-6 justify-between"
                >
                  <span className="font-medium text-gray-900 w-32">{m.name}</span>
                  {renderSplitInput(m.id)}
                  <span className="text-gray-700 font-semibold">
                    {splitType === "percentage" ? "%" : "€"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              disabled={!canProceedStep2}
              onClick={() => setStep(3)}
              className={`px-6 py-2 rounded-md text-white font-semibold transition ${
                canProceedStep2
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Review & Submit</h2>
          <div className="space-y-3 text-gray-800">
            <p>
              <strong>Payer:</strong> {getMemberName(payerId!)}
            </p>
            <p>
              <strong>Amount:</strong> {amount.toFixed(2)} €
            </p>
            <p>
              <strong>Split Type:</strong>{" "}
              {splitType.charAt(0).toUpperCase() + splitType.slice(1)}
            </p>

            {splitType !== "equally" && (
              <div className="mt-4">
                <strong>Split Details:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                  {splitDetails.map((sd) => (
                    <li key={sd.memberId}>
                      {getMemberName(sd.memberId)}:{" "}
                      {splitType === "percentage"
                        ? `${sd.percentage?.toFixed(2)}%`
                        : `${sd.amount?.toFixed(2)} €`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              disabled={submitting}
              onClick={() => {
                if (!groupId || !payerId) return;

                const payload: NewTransactionPayload = {
                  payerId,
                  amount,
                  splitType,
                  splitDetails: splitType === "equally" ? undefined : splitDetails,
                };

                submit(+groupId, payload);
              }}
              className={`px-6 py-2 rounded-md text-white font-semibold transition ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {submitError && (
            <p className="mt-4 text-red-600 font-medium">{submitError}</p>
          )}
        </div>
      )}
    </div>
  );
}
