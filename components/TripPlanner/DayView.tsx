'use client';

import { Day, Activity } from '@/lib/types';
import { format } from 'date-fns';
import ActivityCard from './ActivityCard';
import Button from '../UI/Button';
import { Plus } from 'lucide-react';

interface DayViewProps {
  day: Day;
  onActivityEdit: (activity: Activity) => void;
  onActivityDelete: (activityId: string) => void;
  onActivityAdd: () => void;
  onActivityReorder?: (activities: Activity[]) => void;
}

export default function DayView({
  day,
  onActivityEdit,
  onActivityDelete,
  onActivityAdd,
}: DayViewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6 text-gray-900 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {format(new Date(day.date), 'EEEE, MMMM d')}
          </h2>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
            </div>
          </div>
        </div>
        <Button variant="primary" onClick={onActivityAdd} className="flex items-center gap-2">
          <Plus size={18} />
          Add Activity
        </Button>
      </div>

      {day.activities.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <div className="text-gray-400 mb-3">
            <Plus size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-gray-600 font-medium mb-2">No activities planned for this day</p>
          <p className="text-sm text-gray-500 mb-4">Start building your itinerary</p>
          <Button variant="primary" onClick={onActivityAdd} className="flex items-center gap-2 mx-auto">
            <Plus size={16} />
            Add your first activity
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {day.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={onActivityEdit}
              onDelete={onActivityDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

