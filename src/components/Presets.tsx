import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { Preset } from '../types';

interface PresetsProps {
  presets: Preset[];
  currentSettings: Omit<Preset, 'id' | 'name'>;
  onPresetSelect: (preset: Preset) => void;
  onPresetSave: (preset: Omit<Preset, 'id'>) => void;
  onPresetDelete: (id: string) => void;
}

const Presets: React.FC<PresetsProps> = ({
  presets,
  currentSettings,
  onPresetSelect,
  onPresetSave,
  onPresetDelete,
}) => {
  const [newPresetName, setNewPresetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSavePreset = () => {
    if (newPresetName.trim()) {
      onPresetSave({
        name: newPresetName,
        ...currentSettings,
      });
      setNewPresetName('');
      setShowSaveForm(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full max-w-md transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Presets</h2>
        <button
          onClick={() => setShowSaveForm(!showSaveForm)}
          className="btn btn-secondary dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <Plus size={18} className="mr-1" />
          New Preset
        </button>
      </div>

      {showSaveForm && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Preset Name"
            className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md mb-2 dark:text-white transition-colors"
          />
          <button
            onClick={handleSavePreset}
            className="btn btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 w-full"
          >
            <Save size={18} className="mr-1" />
            Save Current Settings
          </button>
        </div>
      )}

      <div className="space-y-2">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <button
              onClick={() => onPresetSelect(preset)}
              className="flex-1 text-left"
            >
              <div className="font-medium text-gray-800 dark:text-white">{preset.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {preset.roundTime}s work / {preset.restTime}s rest / {preset.totalRounds} rounds
              </div>
            </button>
            <button
              onClick={() => onPresetDelete(preset.id)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Presets;