import React from 'react';
import { Settings as SettingsIcon, Bell, Circle } from 'lucide-react';

interface SettingsProps {
  roundTime: number;
  restTime: number;
  totalRounds: number;
  roundEndWarning: number;
  restEndWarning: number;
  showProgress: boolean;
  onSettingsChange: (setting: string, value: number | boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  roundTime,
  restTime,
  totalRounds,
  roundEndWarning,
  restEndWarning,
  showProgress,
  onSettingsChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full max-w-md transition-colors duration-200">
      <div className="flex items-center mb-4">
        <SettingsIcon className="mr-2 text-gray-600 dark:text-gray-400" size={20} />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Round Duration (seconds)
          </label>
          <input
            type="number"
            value={roundTime}
            onChange={(e) => onSettingsChange('roundTime', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            min="10"
            max="300"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Rest Duration (seconds)
          </label>
          <input
            type="number"
            value={restTime}
            onChange={(e) => onSettingsChange('restTime', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            min="5"
            max="120"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Number of Rounds
          </label>
          <input
            type="number"
            value={totalRounds}
            onChange={(e) => onSettingsChange('totalRounds', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            min="1"
            max="12"
          />
        </div>

        <div className="pt-4 border-t dark:border-gray-700">
          <div className="flex items-center mb-3">
            <Bell size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Countdown Warnings</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Round End Warning (seconds)
              </label>
              <input
                type="number"
                value={roundEndWarning}
                onChange={(e) => onSettingsChange('roundEndWarning', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
                min="0"
                max="30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Rest End Warning (seconds)
              </label>
              <input
                type="number"
                value={restEndWarning}
                onChange={(e) => onSettingsChange('restEndWarning', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
                min="0"
                max="30"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t dark:border-gray-700">
          <div className="flex items-center mb-3">
            <Circle size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Options</span>
          </div>
          
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showProgress}
                onChange={(e) => onSettingsChange('showProgress', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Show Progress Ring</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;