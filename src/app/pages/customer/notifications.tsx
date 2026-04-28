import { Package, TrendingUp, Bell, Gift, AlertCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../lib/data-store';

interface Notification {
  id: number;
  type: 'order' | 'promo' | 'delivery' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(getNotifications());
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'promo':
        return <Gift className="w-5 h-5 text-purple-600" />;
      case 'delivery':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50';
      case 'promo':
        return 'bg-purple-50';
      case 'delivery':
        return 'bg-green-50';
      case 'system':
        return 'bg-orange-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2 flex items-center gap-3">
                <Bell className="w-8 h-8 text-[#B7885E]" />
                Notifications
              </h1>
              <p className="text-[#8B7355]">
                {unreadCount > 0 ? (
                  <>
                    You have <span className="font-semibold text-[#B7885E]">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
                  </>
                ) : (
                  'All caught up!'
                )}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-[#B7885E]/20 text-[#3B2C24]"
              onClick={() => {
                markAllNotificationsRead();
                setNotifications(getNotifications());
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Notification Filters */}
        <Card className="border-[#B7885E]/20 shadow-lg bg-white mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-[#B7885E]/20 bg-[#B7885E] text-white hover:bg-[#9d7350] hover:text-white">
                All
              </Button>
              <Button variant="outline" size="sm" className="border-[#B7885E]/20 text-[#3B2C24]">
                <Package className="w-4 h-4 mr-1" />
                Orders
              </Button>
              <Button variant="outline" size="sm" className="border-[#B7885E]/20 text-[#3B2C24]">
                <Gift className="w-4 h-4 mr-1" />
                Promotions
              </Button>
              <Button variant="outline" size="sm" className="border-[#B7885E]/20 text-[#3B2C24]">
                <TrendingUp className="w-4 h-4 mr-1" />
                Delivery
              </Button>
              <Button variant="outline" size="sm" className="border-[#B7885E]/20 text-[#3B2C24]">
                <AlertCircle className="w-4 h-4 mr-1" />
                System
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <Card
              key={notification.id}
              className={`border-[#B7885E]/20 shadow-lg transition-all hover:shadow-xl ${
                !notification.read ? 'bg-[#FFF5E6]/50' : 'bg-white'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#3B2C24]">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#B7885E] rounded-full" />
                        )}
                      </div>
                      <span className="text-xs text-[#8B7355] whitespace-nowrap ml-4">
                        {notification.time}
                      </span>
                    </div>
                    
                    <p className="text-[#8B7355] leading-relaxed mb-3">{notification.message}</p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#B7885E] hover:text-[#9d7350] hover:bg-[#FFF5E6] h-8 px-3"
                      >
                        View Details
                      </Button>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#8B7355] hover:text-[#3B2C24] hover:bg-[#FFF5E6] h-8 px-3"
                        onClick={() => {
                          markNotificationRead(notification.id);
                          setNotifications(getNotifications());
                        }}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if needed) */}
        {notifications.length === 0 && (
          <Card className="border-[#B7885E]/20 shadow-lg bg-white">
            <CardContent className="py-16 text-center">
              <Bell className="w-16 h-16 text-[#B7885E] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-[#3B2C24] mb-2">No notifications yet</h3>
              <p className="text-[#8B7355]">We'll notify you when something important happens</p>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-[#B7885E]/20 text-[#3B2C24]">
              Load More Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
