import React, { useState, useRef } from 'react'
import { userAuthStore } from '../../store/userStore'
import {
    X, User, Settings, LogOut, ChevronRight, ChevronLeft,
    Camera, Check, Bell, Shield, Palette, Globe, Trash2
} from 'lucide-react'
import { userApi } from '../../api/user.api'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../socket/socket'
import { socketEvents } from '../../constants/socketEvents'

function Profile({ setActivePanel = () => {} }) {

    const { user } = userAuthStore()
    const [view, setView] = useState('main')

    return (
        <>
            <style>{`
                .profile-slide {
                    animation: slideInPanel 0.22s cubic-bezier(0.16,1,0.3,1);
                }
                @keyframes slideInPanel {
                    from { opacity: 0; transform: translateX(-12px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .sub-slide {
                    animation: subSlide 0.2s cubic-bezier(0.16,1,0.3,1);
                }
                @keyframes subSlide {
                    from { opacity: 0; transform: translateX(10px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .action-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 12px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 13.5px;
                    font-weight: 500;
                    color: #374151;
                    transition: background 0.15s;
                }
                .action-row:hover { background: #F3F4F6; }
                .action-row:active { background: #E5E7EB; }

                .panel-divider {
                    height: 1px;
                    background: #E5E7EB;
                    margin: 0 0px;
                }

                .profile-input {
                    width: 100%;
                    background: #FFFFFF;
                    border: 1.5px solid #D1D5DB;
                    border-radius: 10px;
                    padding: 10px 12px;
                    color: #0A0A0A;
                    font-size: 13px;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-family: 'Inter', sans-serif;
                }
                .profile-input:focus {
                    border-color: #2563EB;
                    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
                }
                .profile-input::placeholder { color: #9CA3AF; }

                .save-btn:hover {
                    box-shadow: 0 4px 16px rgba(37,99,235,0.45) !important;
                    transform: translateY(-1px);
                }
                .save-btn:active { transform: scale(0.97); }

                .toggle-track {
                    width: 36px; height: 20px;
                    border-radius: 20px;
                    position: relative;
                    cursor: pointer;
                    transition: background 0.2s;
                    flex-shrink: 0;
                }
                .toggle-thumb {
                    position: absolute;
                    top: 2px; left: 2px;
                    width: 16px; height: 16px;
                    border-radius: 50%;
                    background: #fff;
                    transition: transform 0.2s;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                }
                .toggle-thumb.on { transform: translateX(16px); }

                .settings-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 11px 12px;
                    border-radius: 10px;
                    font-size: 13px;
                    color: #374151;
                }
                .settings-section-label {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #6B7280;
                    padding: 0 12px 6px;
                    margin-top: 8px;
                }
            `}</style>

            <div className="profile-slide flex flex-col h-[100dvh] bg-white">
                {view === 'main' && <MainView user={user} setActivePanel={setActivePanel} setView={setView} />}
                {view === 'edit' && <EditProfileView user={user} setView={setView} />}
                {view === 'settings' && <AccountSettingsView user={user} setView={setView} />}
            </div>
        </>
    )
}

/* ─── MAIN VIEW ─────────────────────────────────── */
function MainView({ user, setActivePanel, setView }) {

    const { logout } = userAuthStore()

    const navigate = useNavigate()

    const handleSignOut = async () => {
        const response = await userApi.logoutUser();
        console.log("Logout Response:", response);
        if(response.success){
            logout();
            socket.disconnect()
            navigate('/login');

        } else {
            console.error("Logout failed:", response.message);
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
                <span className="text-[15px] font-bold tracking-tight text-gray-900">My Profile</span>
                <button onClick={() => setActivePanel(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-gray-100 transition-all duration-150">
                    <X size={15} />
                </button>
            </div>
            <div className="panel-divider" />

            {/* Avatar + info */}
            <div className="flex flex-col items-center gap-3 px-5 pt-5 pb-5">
                <div className="relative">
                    <img
                        src={user?.avtar || user?.avatar}
                        alt={user?.username}
                        className="w-20 h-20 rounded-full object-cover border-[3px]"
                        style={{ borderColor: '#93C5FD', boxShadow: '0 0 24px rgba(37,99,235,0.15)' }}
                    />
                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-success border-2 border-white" />
                </div>
                <div className="text-center">
                    <p className="text-[16px] font-bold text-gray-900 tracking-tight">{user?.username}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{user?.email}</p>
                </div>
                {/* Active badge */}
                <div className="w-full p-2.5 rounded-[10px] flex items-center gap-2 bg-green-50 border border-green-200">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-[12px] text-success font-medium">Active now</span>
                </div>
            </div>
            <div className="panel-divider" />

            {/* Actions */}
            <div className="px-3 pt-2 flex flex-col gap-0.5 flex-1">
                <div className="action-row" onClick={() => setView('edit')}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-100">
                        <User size={13} color="#2563EB" />
                    </div>
                    <span>Edit Profile</span>
                    <ChevronRight size={13} color="#9CA3AF" className="ml-auto" />
                </div>

                {/* Sign out pushed to bottom */}
                <div
                onClick={handleSignOut}
                className="mt-auto pt-4 pb-3">
                    <div className="panel-divider mb-3" />
                    <div className="action-row" style={{ color: '#DC2626' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50">
                            <LogOut size={13} color="#DC2626" />
                        </div>
                        <span>Sign Out</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─── EDIT PROFILE VIEW ──────────────────────────── */
function EditProfileView({ user, setView }) {
    const [name, setName] = useState(user?.name || user?.username || '')
    const [username, setUsername] = useState(user?.username || '')
    const [bio, setBio] = useState(user?.bio || '')
    const [saved, setSaved] = useState(false)
    const [file, setFile] = useState(null)
    const fileRef = useRef(null)

    const handleSave = async () => {
        
        const updatedData = { name, username, bio }

        console.log("Updated profile data to save:", updatedData)

        let avatarUpdate;

        if(file){
            avatarUpdate = await userApi.updateAvatar(file)

            if(avatarUpdate.success){
                user.avtar = avatarUpdate.data.avtar
            }
        }

        const response = await userApi.updateProfile(updatedData)

        if (response.success) {
            setSaved(true)
            
        } else {
            alert("Error saving profile changes. Please try again.")
        }
    }

    return (
        <div className="sub-slide flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <button onClick={() => setView('main')}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-gray-100 transition-all duration-150">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-[15px] font-bold tracking-tight text-gray-900">Edit Profile</span>
            </div>
            <div className="panel-divider" />

            <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 flex flex-col gap-5">
                {/* Avatar upload */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative cursor-pointer group" onClick={() => fileRef.current?.click()}>
                        <img
                            src={ file && user?.avtar ? URL.createObjectURL(file) : !file && user?.avtar ? user.avtar : user?.avtar}
                            alt={user?.username}
                            className="w-20 h-20 rounded-full object-cover border-[3px] transition-opacity group-hover:opacity-70"
                            style={{ borderColor: '#93C5FD', boxShadow: '0 0 24px rgba(37,99,235,0.15)' }}
                        />
                        <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <Camera size={18} color="#fff" />
                        </div>
                        <input
                         ref={fileRef}
                         onChange={(e)=>{
                            setFile(e.target.files[0])
                         }}
                          type="file"
                           accept="image/*"
                            className="hidden"
                             />
                    </div>
                    <span className="text-[11px] text-gray-400">Click to change photo</span>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.8px] mb-1.5 block">Display Name</label>
                        <input
                            className="profile-input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your display name"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.8px] mb-1.5 block">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                            <input
                                className="profile-input pl-7"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="username"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.8px] mb-1.5 block">Bio</label>
                        <textarea
                            className="profile-input resize-none"
                            rows={3}
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Write something about yourself…"
                            style={{ lineHeight: '1.5' }}
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.8px] mb-1.5 block">Email</label>
                        <input
                            className="profile-input opacity-50 cursor-not-allowed"
                            value={user?.email || ''}
                            readOnly
                        />
                        <p className="text-[10.5px] text-gray-400 mt-1 ml-1">Email cannot be changed</p>
                    </div>
                </div>
            </div>

            {/* Save btn */}
            <div className="px-5 pb-5 pt-2">
                <div className="panel-divider mb-4" />
                <button
                    onClick={handleSave}
                    className="save-btn w-full py-2.5 rounded-[11px] text-white text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ background: saved ? '#16A34A' : '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}
                >
                    {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}

/* ─── ACCOUNT SETTINGS VIEW ─────────────────────── */
function AccountSettingsView({ user, setView }) {
    const [notifications, setNotifications] = useState(true)
    const [sounds, setSounds] = useState(true)
    const [readReceipts, setReadReceipts] = useState(true)
    const [onlineVisible, setOnlineVisible] = useState(true)

    const Toggle = ({ on, onToggle }) => (
        <div
            className="toggle-track"
            style={{ background: on ? '#2563EB' : '#E5E7EB' }}
            onClick={onToggle}
        >
            <div className={`toggle-thumb ${on ? 'on' : ''}`} />
        </div>
    )

    return (
        <div className="sub-slide flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <button onClick={() => setView('main')}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-600 hover:bg-gray-100 transition-all duration-150">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-[15px] font-bold tracking-tight text-gray-900">Account Settings</span>
            </div>
            <div className="panel-divider" />

            <div className="flex-1 overflow-y-auto px-3 pb-4">

                {/* Notifications */}
                <p className="settings-section-label">Notifications</p>
                <div className="settings-row justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-brand-100">
                            <Bell size={13} color="#2563EB" />
                        </div>
                        <div>
                            <p className="text-[13px] text-gray-700 font-medium">Push Notifications</p>
                            <p className="text-[11px] text-gray-400">New messages & activity</p>
                        </div>
                    </div>
                    <Toggle on={notifications} onToggle={() => setNotifications(p => !p)} />
                </div>
                <div className="settings-row justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-brand-100">
                            <Palette size={13} color="#2563EB" />
                        </div>
                        <div>
                            <p className="text-[13px] text-gray-700 font-medium">Message Sounds</p>
                            <p className="text-[11px] text-gray-400">Play sound on new message</p>
                        </div>
                    </div>
                    <Toggle on={sounds} onToggle={() => setSounds(p => !p)} />
                </div>

                {/* Privacy */}
                <p className="settings-section-label">Privacy</p>
                <div className="settings-row justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-brand-100">
                            <Shield size={13} color="#2563EB" />
                        </div>
                        <div>
                            <p className="text-[13px] text-gray-700 font-medium">Read Receipts</p>
                            <p className="text-[11px] text-gray-400">Show when you've read messages</p>
                        </div>
                    </div>
                    <Toggle on={readReceipts} onToggle={() => setReadReceipts(p => !p)} />
                </div>
                <div className="settings-row justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-brand-100">
                            <Globe size={13} color="#2563EB" />
                        </div>
                        <div>
                            <p className="text-[13px] text-gray-700 font-medium">Online Status</p>
                            <p className="text-[11px] text-gray-400">Show when you're active</p>
                        </div>
                    </div>
                    <Toggle on={onlineVisible} onToggle={() => setOnlineVisible(p => !p)} />
                </div>

                {/* Danger zone */}
                <p className="settings-section-label" style={{ color: '#DC2626' }}>Danger Zone</p>
                <div className="action-row mx-0" style={{ color: '#DC2626' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50">
                        <Trash2 size={13} color="#DC2626" />
                    </div>
                    <div>
                        <p className="text-[13px] font-medium">Delete Account</p>
                        <p className="text-[11px] text-red-400">This action is irreversible</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
