import { Outlet, Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  Settings,
  Shirt
} from 'lucide-react';
import { cn } from './ui/utils';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/inventory', label: 'Inventory', icon: Package },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/delivery', label: 'Delivery', icon: Truck },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#FFF5E6]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3B2C24] text-[#FFF5E6] flex flex-col">
        <div className="p-6 border-b border-[#B7885E]/20">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B7885E] rounded-lg flex items-center justify-center">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">High Density</h2>
              <p className="text-xs text-[#DDB67D]">Clothing</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive 
                    ? "bg-[#B7885E] text-white" 
                    : "text-[#FFF5E6] hover:bg-[#4a3a30]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#B7885E]/20">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FFF5E6] hover:bg-[#4a3a30] transition-all w-full">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
