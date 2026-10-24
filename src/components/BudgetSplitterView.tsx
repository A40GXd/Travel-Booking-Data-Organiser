import React, { useState } from 'react';
import { ExpenseItem } from '../types';

interface BudgetSplitterProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id' | 'date'>) => void;
}

export const BudgetSplitterView: React.FC<BudgetSplitterProps> = ({
  expenses,
  onAddExpense,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('Mira Vance');
  const [category, setCategory] = useState('Food & Dine');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([
    'Mira Vance',
    'Kenji Sato',
    'Sarah Chen',
    'Leo Tanaka',
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  const members = ['Mira Vance', 'Kenji Sato', 'Sarah Chen', 'Leo Tanaka'];
  const memberColors: Record<string, string> = {
    'Mira Vance': '#c3f400', // Lime
    'Kenji Sato': '#ddb7ff', // Violet
    'Sarah Chen': '#7df4ff', // Cyan
    'Leo Tanaka': '#ffb4ab', // Coral
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount_jpy, 0);
  const rateUsd = 152.4;
  const totalUsd = Math.round(totalSpent / rateUsd);

  // Compute breakdown per member
  const paidTotals: Record<string, number> = {};
  const owedTotals: Record<string, number> = {};
  members.forEach((m) => {
    paidTotals[m] = 0;
    owedTotals[m] = 0;
  });

  expenses.forEach((item) => {
    const amt = item.amount_jpy;
    paidTotals[item.paid_by] = (paidTotals[item.paid_by] || 0) + amt;
    const splitCount = item.split_with.length || 1;
    const share = amt / splitCount;
    item.split_with.forEach((p) => {
      owedTotals[p] = (owedTotals[p] || 0) + share;
    });
  });

  const toggleMemberSelection = (m: string) => {
    if (selectedMembers.includes(m)) {
      if (selectedMembers.length === 1) return; // Keep at least one
      setSelectedMembers(selectedMembers.filter((item) => item !== m));
    } else {
      setSelectedMembers([...selectedMembers, m]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim()) {
      setErrorMsg('Expense description cannot be empty');
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setErrorMsg('Amount must be a positive number');
      return;
    }
    if (selectedMembers.length === 0) {
      setErrorMsg('Select at least one participant');
      return;
    }

    onAddExpense({
      title: title.trim(),
      amount_jpy: parsedAmount,
      paid_by: paidBy,
      split_with: selectedMembers,
      category,
    });

    setTitle('');
    setAmount('');
    setErrorMsg('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1540px] mx-auto">
      {/* Overview Deck */}
      <div className="bg-[#1a1c20] p-6 rounded-2xl border border-[#282a2e] flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-['Space_Mono'] text-xs text-[#c3f400] font-bold uppercase tracking-wider">
              TREASURY ENGINE // EXPEDITION LEDGER
            </span>
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#e2e2e8] mt-1">
              Group Budget &amp; Equal Splitter
            </h2>
            <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#c4c9ac] mt-1">
              Multi-currency tracking, real-time bill distribution, and net settlement reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#c3f400] block leading-none">
                ¥{totalSpent.toLocaleString()}
              </span>
              <span className="font-['Space_Mono'] text-xs text-[#c4c9ac] mt-1 block">
                ≈ ${totalUsd.toLocaleString()} USD
              </span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_16px_rgba(195,244,0,0.25)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">add</span>
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Split Bill Meter: High-energy progress bar divided into multi-color segments */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between text-xs font-['Space_Mono'] text-[#c4c9ac]">
            <span>MEMBER CONTRIBUTION RATIOS</span>
            <span>100% BALANCED</span>
          </div>
          <div className="h-3 w-full bg-[#0c0e12] rounded-full overflow-hidden flex border border-[#282a2e]">
            {members.map((m) => {
              const pct = totalSpent > 0 ? (paidTotals[m] / totalSpent) * 100 : 25;
              return (
                <div
                  key={m}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: memberColors[m],
                  }}
                  className="h-full transition-all duration-500 relative group"
                  title={`${m}: ¥${(paidTotals[m] || 0).toLocaleString()} (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 font-['Space_Mono'] text-xs">
            {members.map((m) => {
              const pct = totalSpent > 0 ? Math.round((paidTotals[m] / totalSpent) * 100) : 25;
              return (
                <div key={m} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: memberColors[m] }}
                  ></span>
                  <span className="text-[#e2e2e8]">{m.split(' ')[0]}</span>
                  <span className="text-[#c4c9ac]">({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Member Net Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.map((m) => {
          const paid = paidTotals[m] || 0;
          const owed = owedTotals[m] || 0;
          const net = paid - owed;
          const isPositive = net >= 0;

          return (
            <div
              key={m}
              className="bg-[#1a1c20] p-5 rounded-2xl border border-[#282a2e] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] font-bold text-base text-[#e2e2e8]">
                  {m}
                </span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: memberColors[m] }}
                ></span>
              </div>

              <div className="my-3 flex flex-col gap-1 font-['Space_Mono'] text-xs">
                <div className="flex justify-between text-[#c4c9ac]">
                  <span>Paid out:</span>
                  <span>¥{Math.round(paid).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#c4c9ac]">
                  <span>Fair share:</span>
                  <span>¥{Math.round(owed).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#282a2e] flex items-center justify-between">
                <span className="font-['Space_Mono'] text-[11px] text-[#c4c9ac]">NET SETTLEMENT</span>
                <span
                  className={`font-['Space_Mono'] text-sm font-bold ${
                    isPositive ? 'text-[#c3f400]' : 'text-[#ffb4ab]'
                  }`}
                >
                  {isPositive ? '+' : ''}¥{Math.round(net).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expenses History Table */}
      <div className="bg-[#1a1c20] rounded-2xl border border-[#282a2e] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#282a2e] flex items-center justify-between">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2e8]">
            Recorded Shared Transactions
          </h3>
          <span className="font-['Space_Mono'] text-xs text-[#c4c9ac]">
            {expenses.length} Records Logged
          </span>
        </div>

        <div className="divide-y divide-[#282a2e]">
          {expenses.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1e2024] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0c0e12] border border-[#282a2e] flex items-center justify-center text-[#c3f400]">
                  <span className="material-symbols-outlined text-lg">receipt_long</span>
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] font-semibold text-[#e2e2e8] text-sm">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#c4c9ac] mt-0.5">
                    <span className="font-['Space_Mono'] text-[11px]">{item.date}</span>
                    <span>·</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#282a2e] text-[10px] font-['Space_Mono']">
                      {item.category}
                    </span>
                    <span>·</span>
                    <span>
                      Paid by <strong className="text-white">{item.paid_by}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <span className="font-['Space_Mono'] text-base font-bold text-[#e2e2e8] block">
                    ¥{item.amount_jpy.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-['Space_Mono'] text-[#c4c9ac]">
                    Split with {item.split_with.length} ppl
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1c20] border border-[#333539] w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#282a2e]">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2e8]">
                Log New Shared Expense
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#c4c9ac] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-[#93000a]/30 border border-[#93000a] text-[#ffdad6] text-xs font-['Space_Mono']">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-['DM_Sans'] text-xs">
              <div>
                <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                  Expense Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Glitch Coffee Geisha Flight Tasting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                    Amount (JPY ¥)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 8400"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm font-['Space_Mono'] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm focus:outline-hidden"
                  >
                    <option value="Food & Dine">Food &amp; Dine</option>
                    <option value="Lodging">Lodging</option>
                    <option value="Transit">Transit</option>
                    <option value="Activities">Activities</option>
                    <option value="Supplies">Supplies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                  Paid By
                </label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-[#282a2e] focus:border-[#c3f400] rounded-xl px-3 py-2 text-[#e2e2e8] text-sm focus:outline-hidden"
                >
                  {members.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#c4c9ac] font-['Space_Mono'] text-[10px] uppercase mb-1">
                  Split With
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {members.map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => toggleMemberSelection(m)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        selectedMembers.includes(m)
                          ? 'bg-[#282a2e] border-[#c3f400] text-[#c3f400]'
                          : 'bg-[#0c0e12] border-[#282a2e] text-[#c4c9ac]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {selectedMembers.includes(m) ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-[#282a2e] text-[#e2e2e8] hover:bg-[#333539] font-['DM_Sans'] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#c3f400] text-[#161e00] font-['DM_Sans'] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_12px_rgba(195,244,0,0.3)]"
                >
                  Confirm Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
