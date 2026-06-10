import React from 'react'
import { X, Bell, User, Zap, ChevronRight } from 'lucide-react'


function Settings({
    setActivePanel=()=>{},

}) {

    

  return (
       <div className="flex flex-col h-full bg-white">
                            <div className="flex items-center justify-between px-5 pt-6 pb-4">
                                <span className="text-[15px] font-bold tracking-tight text-gray-900">Settings</span>
                                <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-brand-600 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="h-px bg-gray-200" />
                            <div className="px-3 flex flex-col gap-0.5">
                                {[
                                    { label: 'Notifications', icon: Bell },
                                    { label: 'Privacy & Security', icon: User },
                                    { label: 'Appearance', icon: Zap },
                                    { label: 'Blocked Users', icon: X },
                                ].map(({ label, icon: Icon }) => (
                                    <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150">
                                        <Icon size={15} color="#2563EB" />
                                        <span>{label}</span>
                                        <ChevronRight size={13} color="#9CA3AF" className="ml-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
  )
}

export default Settings
