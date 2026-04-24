import { Crown, MessageSquare, Settings, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: MessageSquare, path: '/chat', label: 'Chat' },
    { icon: User, path: '/profile', label: 'Profile' },
    { icon: Crown, path: '/subscription', label: 'Plan' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="bottom-nav-container">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
