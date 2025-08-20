import React, { useState, useCallback } from 'react';
import { MapPinIcon, ShieldCheckIcon } from './icons';

const Map: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'pending' | 'granted' | 'denied'>('idle');

  const requestPermissions = useCallback(async () => {
    setPermissionStatus('pending');
    try {
      // In a real web app, you'd use navigator.geolocation.getCurrentPosition
      // and for camera, navigator.mediaDevices.getUserMedia.
      // Since this is a simulation, we'll just mock the flow.
      await new Promise(res => setTimeout(res, 1500));
      
      // Simulate random grant/deny
      if (Math.random() > 0.3) {
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
      }
    } catch (error) {
      console.error("Permission request error:", error);
      setPermissionStatus('denied');
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 max-w-2xl">
        <MapPinIcon className="w-20 h-20 text-purple-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">The World is Your Network</h1>
        <p className="text-lg text-gray-400 mb-8">
          Coming soon: Explore your surroundings to find digital artifacts, uncover hidden networks, and engage in location-based cyber battles with other players in augmented reality.
        </p>
        
        {permissionStatus === 'idle' && (
          <button
            onClick={requestPermissions}
            className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-transform hover:scale-105"
          >
            Enable Location & Camera to Play
          </button>
        )}

        {permissionStatus === 'pending' && (
            <p className="text-purple-400 animate-pulse">Awaiting permissions...</p>
        )}

        {permissionStatus === 'granted' && (
          <div className="text-green-400 flex items-center justify-center space-x-2">
            <ShieldCheckIcon className="w-6 h-6"/>
            <span>Permissions granted! The AR map will be available soon.</span>
          </div>
        )}

        {permissionStatus === 'denied' && (
            <p className="text-red-400">Permissions denied. You'll need to grant camera and location access in your browser settings to use this feature.</p>
        )}

        <p className="text-xs text-gray-600 mt-8">
          Your location data is only used for gameplay and is never stored or shared.
        </p>
      </div>
    </div>
  );
};

export default Map;
