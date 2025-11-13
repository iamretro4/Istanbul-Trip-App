'use client';

import { useState, useEffect } from 'react';
import { Activity, ActivityCategory } from '@/lib/types';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

interface ActivityEditorProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

const categories: { value: ActivityCategory; label: string }[] = [
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'food', label: 'Food' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'bazaar', label: 'Bazaar' },
  { value: 'landmark', label: 'Landmark' },
  { value: 'museum', label: 'Museum' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'bar', label: 'Bar' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Other' },
];

export default function ActivityEditor({ activity, isOpen, onClose, onSave }: ActivityEditorProps) {
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    description: '',
    category: 'sightseeing',
    startTime: '',
    endTime: '',
    duration: undefined,
    notes: '',
    cost: undefined,
    location: { lat: 0, lng: 0 },
  });

  useEffect(() => {
    if (activity) {
      setFormData(activity);
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'sightseeing',
        startTime: '',
        endTime: '',
        duration: undefined,
        notes: '',
        cost: undefined,
        location: { lat: 0, lng: 0 },
      });
    }
  }, [activity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      alert('Name and location are required');
      return;
    }

    const savedActivity: Activity = {
      id: activity?.id || `activity-${Date.now()}`,
      name: formData.name!,
      description: formData.description,
      category: formData.category || 'sightseeing',
      location: formData.location!,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: formData.duration,
      notes: formData.notes,
      cost: formData.cost,
      photo: formData.photo,
      website: formData.website,
      neighborhood: formData.neighborhood,
    };

    onSave(savedActivity);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activity ? 'Edit Activity' : 'Add Activity'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category || 'sightseeing'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ActivityCategory })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime || ''}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime || ''}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.cost || ''}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location (Lat, Lng)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={formData.location?.lat || ''}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location!, lat: parseFloat(e.target.value) || 0, lng: formData.location?.lng || 0 }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={formData.location?.lng || ''}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location!, lat: formData.location?.lat || 0, lng: parseFloat(e.target.value) || 0 }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={formData.location?.address || ''}
            onChange={(e) => setFormData({
              ...formData,
              location: { ...formData.location!, address: e.target.value }
            })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all text-gray-700"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

