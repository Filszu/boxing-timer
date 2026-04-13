import React from 'react';
import { Settings as SettingsIcon, Bell, Circle, Zap } from 'lucide-react';
import type { ActiveTrainingMode } from '../types';

interface SettingsProps {
  roundTime: number;
  restTime: number;
  totalRounds: number;
  roundEndWarning: number;
  restEndWarning: number;
  preRoundTime: number;
  notificationsEnabled: boolean;
  showProgress: boolean;
  activeTrainingMode: ActiveTrainingMode;
  accelDurationFixed: number;
  accelDurationRandom: boolean;
  accelDurationMin: number;
  accelDurationMax: number;
  accelBreakFixed: number;
  accelBreakRandom: boolean;
  accelBreakMin: number;
  accelBreakMax: number;
  beepGapMin: number;
  beepGapMax: number;
  showAccelSubtimer: boolean;
  onSettingsChange: (setting: string, value: string | number | boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  roundTime,
  restTime,
  totalRounds,
  roundEndWarning,
  restEndWarning,
  preRoundTime,
  notificationsEnabled,
  showProgress,
  activeTrainingMode,
  accelDurationFixed,
  accelDurationRandom,
  accelDurationMin,
  accelDurationMax,
  accelBreakFixed,
  accelBreakRandom,
  accelBreakMin,
  accelBreakMax,
  beepGapMin,
  beepGapMax,
  showAccelSubtimer,
  onSettingsChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full transition-colors duration-200">
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

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Pre-round countdown (seconds before round 1)
          </label>
          <input
            type="number"
            value={preRoundTime}
            onChange={(e) => onSettingsChange('preRoundTime', parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:text-white transition-colors"
            min="0"
            max="120"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set to 0 to start round 1 immediately.</p>
        </div>

        <div className="pt-4 border-t dark:border-gray-700">
          <div className="flex items-center mb-3">
            <Bell size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</span>
          </div>
          <div className="flex items-center mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={(e) => onSettingsChange('notificationsEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Browser notifications</span>
            </label>
          </div>
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
            <Zap size={16} className="mr-2 text-amber-500 dark:text-amber-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active training</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Work rounds only. Accelerations turn the ring red and mute countdown ticks/warnings for those seconds.
            Active beep mode only plays random beeps; the round stays normal.
          </p>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Mode</label>
          <select
            value={activeTrainingMode}
            onChange={(e) =>
              onSettingsChange('activeTrainingMode', e.target.value as ActiveTrainingMode)
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-amber-500 focus:border-amber-500 dark:text-white transition-colors mb-4"
          >
            <option value="off">Off</option>
            <option value="acceleration">Random accelerations</option>
            <option value="beep">Active beep mode</option>
          </select>

          {activeTrainingMode === 'acceleration' && (
            <div className="space-y-4 mb-2">
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={accelDurationRandom}
                    onChange={(e) => onSettingsChange('accelDurationRandom', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Random acceleration length</span>
                </label>
              </div>
              {!accelDurationRandom ? (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Acceleration duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={accelDurationFixed}
                    onChange={(e) => onSettingsChange('accelDurationFixed', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                    min="1"
                    max="60"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Min (s)</label>
                    <input
                      type="number"
                      value={accelDurationMin}
                      onChange={(e) => onSettingsChange('accelDurationMin', parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Max (s)</label>
                    <input
                      type="number"
                      value={accelDurationMax}
                      onChange={(e) => onSettingsChange('accelDurationMax', parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={accelBreakRandom}
                    onChange={(e) => onSettingsChange('accelBreakRandom', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Random gap between accelerations</span>
                </label>
              </div>
              {!accelBreakRandom ? (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Gap between accelerations (seconds)
                  </label>
                  <input
                    type="number"
                    value={accelBreakFixed}
                    onChange={(e) => onSettingsChange('accelBreakFixed', parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                    min="0"
                    max="300"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Gap min (s)</label>
                    <input
                      type="number"
                      value={accelBreakMin}
                      onChange={(e) => onSettingsChange('accelBreakMin', parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                      min="1"
                      max="300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Gap max (s)</label>
                    <input
                      type="number"
                      value={accelBreakMax}
                      onChange={(e) => onSettingsChange('accelBreakMax', parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                      min="1"
                      max="300"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center pt-2 border-t border-gray-200 dark:border-gray-600 mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showAccelSubtimer}
                    onChange={(e) => onSettingsChange('showAccelSubtimer', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show small acceleration countdown
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTrainingMode === 'beep' && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Min delay (s)
                </label>
                <input
                  type="number"
                  value={beepGapMin}
                  onChange={(e) => onSettingsChange('beepGapMin', parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                  min="1"
                  max="600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Max delay (s)
                </label>
                <input
                  type="number"
                  value={beepGapMax}
                  onChange={(e) => onSettingsChange('beepGapMax', parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                  min="1"
                  max="600"
                />
              </div>
            </div>
          )}
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