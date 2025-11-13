'use client';

import { useState } from 'react';
import { Expense, Activity } from '@/lib/types';
import { format } from 'date-fns';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

interface BudgetTrackerProps {
  expenses: Expense[];
  activities: Activity[];
  totalBudget: number;
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onBudgetChange: (budget: number) => void;
}

export default function BudgetTracker({
  expenses,
  activities,
  totalBudget,
  onAddExpense,
  onDeleteExpense,
  onBudgetChange,
}: BudgetTrackerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Expense>>({
    description: '',
    amount: 0,
    category: 'food',
    date: new Date().toISOString().split('T')[0],
  });

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: `expense-${Date.now()}`,
      description: formData.description || '',
      amount: formData.amount || 0,
      category: formData.category || 'other',
      date: formData.date || new Date().toISOString(),
      activityId: formData.activityId,
    };
    onAddExpense(expense);
    setIsModalOpen(false);
    setFormData({
      description: '',
      amount: 0,
      category: 'food',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const categories = ['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
          <DollarSign size={22} className="text-green-600" />
          Budget Tracker
        </h3>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Add Expense
        </Button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget ($)</label>
        <input
          type="number"
          value={totalBudget}
          onChange={(e) => onBudgetChange(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Spent: ${totalSpent.toFixed(2)}</span>
          <span>Remaining: ${remaining.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {expenses.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-gray-500 text-sm font-medium">No expenses yet</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium">{expense.description}</p>
                <p className="text-xs text-gray-500">
                  {expense.category} • {format(new Date(expense.date), 'MMM d')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity (optional)</label>
            <select
              value={formData.activityId || ''}
              onChange={(e) => setFormData({ ...formData, activityId: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>{activity.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

