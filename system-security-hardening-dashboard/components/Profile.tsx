import React, { useState, useRef } from 'react';
import type { UserProfile } from '../types';
import { UserRole } from '../types';
import { PhotoIcon, FireIcon, ShieldCheckIcon } from './icons';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, setUserProfile }) => {
  const [username, setUsername] = useState(userProfile.username);
  const [avatar, setAvatar] = useState(userProfile.avatarUrl);
  const [selectedRole, setSelectedRole] = useState(userProfile.role);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUserProfile(prev => ({ ...prev, username, avatarUrl: avatar, role: selectedRole }));
    // Here you would typically make an API call to save the profile
    alert("Profile saved!");
  };

  const RoleCard: React.FC<{role: UserRole, icon: React.ReactNode, description: string}> = ({ role, icon, description }) => (
      <div 
        onClick={() => setSelectedRole(role)}
        className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${selectedRole === role ? (role === UserRole.HACKER ? 'border-red-500 bg-red-500/10' : 'border-purple-500 bg-purple-500/10') : 'border-gray-800 bg-gray-900 hover:border-gray-700'}`}
      >
        <div className="flex items-center space-x-4 mb-2">
            {icon}
            <h3 className="text-xl font-bold text-white">{role}</h3>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Your Profile</h1>
        <p className="text-gray-400 mt-1">Customize your identity in the CyberSphere.</p>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-8">
        {/* Avatar and Username */}
        <div className="flex items-center space-x-8">
            <div className="relative">
                <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-gray-700 object-cover" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors border-2 border-gray-900"
                >
                    <PhotoIcon className="w-5 h-5 text-white" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            </div>
            <div className="flex-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
            </div>
        </div>

        {/* Role Selection */}
        <div>
            <h2 className="text-xl font-bold text-white mb-4">Choose Your Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoleCard role={UserRole.HACKER} icon={<FireIcon className="w-8 h-8 text-red-400" />} description="Exploit vulnerabilities and disrupt systems. Excel in offensive operations." />
                <RoleCard role={UserRole.CYBER_SEC} icon={<ShieldCheckIcon className="w-8 h-8 text-purple-400" />} description="Protect assets and neutralize threats. Master the art of defense." />
            </div>
        </div>
      </div>
      
      <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
      </div>

    </div>
  );
};

export default Profile;
