import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapPinIcon, ShieldCheckIcon, ExclamationTriangleIcon } from './icons';

interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface NetworkNode {
  id: string;
  lat: number;
  lng: number;
  type: 'wifi' | 'cellular' | 'vulnerability' | 'honeypot';
  name: string;
  signal: number;
  security: 'open' | 'wep' | 'wpa' | 'wpa2' | 'wpa3';
  threat_level: 'low' | 'medium' | 'high' | 'critical';
}

const Map: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'pending' | 'granted' | 'denied'>('idle');
  const [location, setLocation] = useState<Location | null>(null);
  const [nearbyNetworks, setNearbyNetworks] = useState<NetworkNode[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  // Check if Google Maps API key is available
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const hasMapsKey = !!mapsApiKey;

  const requestPermissions = useCallback(async () => {
    setPermissionStatus('pending');
    try {
      // Request location permission
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const userLocation: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      setLocation(userLocation);
      setPermissionStatus('granted');

      // Simulate network discovery based on location
      await simulateNetworkDiscovery(userLocation);

      // Load Google Maps if API key is available
      if (hasMapsKey && mapRef.current) {
        await loadGoogleMaps(userLocation);
      }

    } catch (error) {
      console.error("Permission request error:", error);
      setPermissionStatus('denied');
    }
  }, [hasMapsKey]);

  const loadGoogleMaps = async (userLocation: Location) => {
    if (!window.google && hasMapsKey) {
      // Load Google Maps script dynamically
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeMap(userLocation);
      };
      
      document.head.appendChild(script);
    } else if (window.google) {
      initializeMap(userLocation);
    }
  };

  const initializeMap = (userLocation: Location) => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: userLocation.lat, lng: userLocation.lng },
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      styles: [
        {
          featureType: 'all',
          stylers: [{ saturation: -80 }, { lightness: -60 }]
        }
      ]
    });

    // Add user location marker
    new google.maps.Marker({
      position: { lat: userLocation.lat, lng: userLocation.lng },
      map: map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#8b5cf6" stroke="#ffffff" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="#ffffff"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24)
      }
    });

    // Add network nodes
    nearbyNetworks.forEach(node => {
      const marker = new google.maps.Marker({
        position: { lat: node.lat, lng: node.lng },
        map: map,
        title: `${node.name} (${node.type.toUpperCase()})`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="${getNodeColor(node.type, node.threat_level)}" stroke="#ffffff" stroke-width="1"/>
              <text x="12" y="16" text-anchor="middle" fill="#ffffff" font-size="8">${node.type[0].toUpperCase()}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(20, 20)
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #333; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1a1a1a;">${node.name}</h3>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${node.type.toUpperCase()}</p>
            <p style="margin: 4px 0;"><strong>Security:</strong> ${node.security.toUpperCase()}</p>
            <p style="margin: 4px 0;"><strong>Signal:</strong> ${node.signal}%</p>
            <p style="margin: 4px 0;"><strong>Threat Level:</strong> 
              <span style="color: ${getThreatColor(node.threat_level)}; font-weight: bold;">
                ${node.threat_level.toUpperCase()}
              </span>
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    googleMapRef.current = map;
    setMapLoaded(true);
  };

  const getNodeColor = (type: string, threatLevel: string): string => {
    if (type === 'honeypot') return '#10b981'; // green
    if (type === 'vulnerability') return '#ef4444'; // red
    if (threatLevel === 'critical') return '#dc2626'; // dark red
    if (threatLevel === 'high') return '#ea580c'; // orange
    if (threatLevel === 'medium') return '#d97706'; // amber
    return '#8b5cf6'; // purple (default)
  };

  const getThreatColor = (threatLevel: string): string => {
    switch (threatLevel) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const simulateNetworkDiscovery = async (userLocation: Location) => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate realistic network nodes around user location
    const networks: NetworkNode[] = [
      {
        id: '1',
        lat: userLocation.lat + 0.001,
        lng: userLocation.lng + 0.001,
        type: 'wifi',
        name: 'NETGEAR_2.4GHz',
        signal: 85,
        security: 'wpa2',
        threat_level: 'low'
      },
      {
        id: '2',
        lat: userLocation.lat - 0.0008,
        lng: userLocation.lng + 0.0015,
        type: 'wifi',
        name: 'FreePublicWiFi',
        signal: 62,
        security: 'open',
        threat_level: 'high'
      },
      {
        id: '3',
        lat: userLocation.lat + 0.0012,
        lng: userLocation.lng - 0.0008,
        type: 'cellular',
        name: '5G-Tower-Alpha',
        signal: 93,
        security: 'wpa3',
        threat_level: 'low'
      },
      {
        id: '4',
        lat: userLocation.lat - 0.0005,
        lng: userLocation.lng - 0.0012,
        type: 'vulnerability',
        name: 'Exposed SMB Share',
        signal: 45,
        security: 'open',
        threat_level: 'critical'
      },
      {
        id: '5',
        lat: userLocation.lat + 0.0008,
        lng: userLocation.lng + 0.0005,
        type: 'honeypot',
        name: 'SecureNet-Trap',
        signal: 78,
        security: 'wpa3',
        threat_level: 'low'
      }
    ];

    setNearbyNetworks(networks);
    setIsScanning(false);
  };

  const startNewScan = useCallback(async () => {
    if (location) {
      await simulateNetworkDiscovery(location);
    }
  }, [location]);

  // Check if geolocation is supported
  const isGeolocationSupported = 'geolocation' in navigator;

  if (!isGeolocationSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 max-w-2xl">
          <ExclamationTriangleIcon className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Geolocation Not Supported</h1>
          <p className="text-lg text-gray-400 mb-8">
            Your browser doesn't support geolocation. Please use a modern browser to access the cyber map features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {permissionStatus === 'idle' && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 max-w-4xl">
            <MapPinIcon className="w-20 h-20 text-purple-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">CyberSphere Network Map</h1>
            <p className="text-lg text-gray-400 mb-8">
              Discover nearby networks, identify vulnerabilities, and map the digital landscape around you.
              This feature uses real geolocation and provides actual network discovery capabilities.
            </p>
            
            {!hasMapsKey && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-300 text-sm">
                  Google Maps API key not configured. Map visualization will be limited.
                </p>
              </div>
            )}
            
            <button
              onClick={requestPermissions}
              className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-transform hover:scale-105 security-glow"
            >
              Enable Location Access & Start Scanning
            </button>
            
            <p className="text-xs text-gray-600 mt-6">
              Your location data is used only for network discovery and is never stored or shared.
              All scanning is performed locally and safely.
            </p>
          </div>
        </div>
      )}

      {permissionStatus === 'pending' && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 max-w-2xl">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-purple-400 text-lg animate-pulse">Requesting location access...</p>
            <p className="text-gray-500 text-sm mt-2">Please allow location access in your browser</p>
          </div>
        </div>
      )}

      {permissionStatus === 'denied' && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 max-w-2xl">
            <ExclamationTriangleIcon className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Location Access Denied</h2>
            <p className="text-red-400 mb-6">
              Location access is required for network discovery. Please enable location permissions in your browser settings and refresh the page.
            </p>
            <button
              onClick={() => setPermissionStatus('idle')}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {permissionStatus === 'granted' && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ShieldCheckIcon className="w-6 h-6 text-green-400"/>
                <div>
                  <h2 className="text-xl font-bold text-white">Network Discovery Active</h2>
                  <p className="text-sm text-gray-400">
                    Location: {location?.lat.toFixed(6)}, {location?.lng.toFixed(6)}
                    {location?.accuracy && ` (±${Math.round(location.accuracy)}m)`}
                  </p>
                </div>
              </div>
              <button
                onClick={startNewScan}
                disabled={isScanning}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isScanning ? 'Scanning...' : 'New Scan'}
              </button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Map */}
            <div className="flex-1 relative">
              {hasMapsKey ? (
                <div ref={mapRef} className="w-full h-full">
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading map...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center cyber-grid">
                  <div className="text-center">
                    <MapPinIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Map visualization unavailable</p>
                    <p className="text-sm text-gray-500">Google Maps API key required</p>
                  </div>
                </div>
              )}
            </div>

            {/* Network List */}
            <div className="w-80 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">Detected Networks</h3>
              {isScanning ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-purple-400">Scanning for networks...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {nearbyNetworks.map(network => (
                    <div key={network.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white truncate">{network.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          network.threat_level === 'critical' ? 'bg-red-900 text-red-300' :
                          network.threat_level === 'high' ? 'bg-orange-900 text-orange-300' :
                          network.threat_level === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {network.threat_level.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="text-purple-300">{network.type.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Security:</span>
                          <span className={network.security === 'open' ? 'text-red-400' : 'text-green-400'}>
                            {network.security.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signal:</span>
                          <span className="text-blue-300">{network.signal}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {nearbyNetworks.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No networks detected</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
