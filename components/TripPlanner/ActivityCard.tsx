'use client';

import { Activity, ActivityCategory } from '@/lib/types';
import { Clock, MapPin, Edit2, Trash2, DollarSign } from 'lucide-react';
import Button from '../UI/Button';

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  isDragging?: boolean;
}

const categoryColors: Record<ActivityCategory, string> = {
  sightseeing: 'bg-blue-100 text-blue-800',
  food: 'bg-orange-100 text-orange-800',
  nightlife: 'bg-purple-100 text-purple-800',
  shopping: 'bg-pink-100 text-pink-800',
  bazaar: 'bg-yellow-100 text-yellow-800',
  landmark: 'bg-red-100 text-red-800',
  museum: 'bg-indigo-100 text-indigo-800',
  restaurant: 'bg-orange-100 text-orange-800',
  cafe: 'bg-amber-100 text-amber-800',
  bar: 'bg-purple-100 text-purple-800',
  transport: 'bg-gray-100 text-gray-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function ActivityCard({ activity, onEdit, onDelete, isDragging }: ActivityCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md border-l-4 p-5 mb-4 transition-all duration-200 ${
        categoryColors[activity.category]
      } ${isDragging ? 'opacity-50' : 'hover:scale-[1.01]'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2 text-gray-900">{activity.name}</h3>
          {activity.description && (
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{activity.description}</p>
          )}
          
          <div className="flex flex-wrap gap-3 text-xs font-medium">
            {activity.startTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{activity.startTime}</span>
              </div>
            )}
            {activity.location.address && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{activity.location.address}</span>
              </div>
            )}
            {activity.cost && (
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                <span>${activity.cost}</span>
              </div>
            )}
          </div>

          {activity.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 italic">{activity.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            className="p-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600"
            onClick={() => onEdit(activity)}
            title="Edit activity"
          >
            <Edit2 size={18} />
          </Button>
          <Button
            variant="ghost"
            className="p-2.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              if (confirm('Delete this activity?')) {
                onDelete(activity.id);
              }
            }}
            title="Delete activity"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

