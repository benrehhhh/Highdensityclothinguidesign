import { useState, useEffect, useRef } from 'react';
import { Package, Truck, CheckCircle2, MapPin, Phone, Mail, Search, Clock, Navigation, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { MapWrapper, riderIcon, destinationIcon, warehouseIcon } from '../../components/map-wrapper';

type OrderStatus = 'Order Placed' | 'Processing' | 'Out for Delivery' | 'Delivered';

const trackingSteps: OrderStatus[] = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered'];

export function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('ORD-001');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Warehouse location (starting point)
  const warehouseLocation: [number, number] = [14.5995, 120.9842]; // Manila

  // Customer destination
  const customerLocation: [number, number] = [14.6091, 121.0223]; // Quezon City

  // Simulated rider location (moves along route)
  const [riderLocation, setRiderLocation] = useState<[number, number]>([14.6040, 121.0000]);

  const [trackingData, setTrackingData] = useState({
    orderNumber: 'ORD-001',
    status: 'Out for Delivery' as OrderStatus,
    trackingNumber: 'TRK123456789PH',
    courier: 'J&T Express',
    riderName: 'Juan Santos',
    riderContact: '0917-123-4567',
    estimatedDelivery: 'Today, 3:00 PM - 5:00 PM',
    placedDate: 'April 12, 2026 10:30 AM',
    paymentMethod: 'Cash on Delivery',
    customer: {
      name: localStorage.getItem('userName') || 'Customer',
      phone: localStorage.getItem('userPhone') || '0917 123 4567',
      email: localStorage.getItem('userEmail') || 'customer@email.com',
      address: localStorage.getItem('userAddress') || '123 Main Street, Quezon City, Metro Manila'
    },
    items: [
      { name: 'Handcrafted Cotton Shirt', quantity: 2, price: 1299 },
      { name: 'Linen Casual Polo', quantity: 1, price: 1599 }
    ],
    timeline: [
      { status: 'Order Placed', date: 'April 12, 2026 10:30 AM', location: 'Order received', completed: true },
      { status: 'Processing', date: 'April 12, 2026 02:15 PM', location: 'Package prepared', completed: true },
      { status: 'Out for Delivery', date: 'April 14, 2026 09:00 AM', location: 'In transit to customer', completed: true },
      { status: 'Delivered', date: 'Expected by 5:00 PM', location: 'Awaiting delivery', completed: false }
    ]
  });

  // Simulate GPS movement
  useEffect(() => {
    if (autoRefresh && trackingData.status === 'Out for Delivery') {
      intervalRef.current = setInterval(() => {
        setRiderLocation(prev => {
          // Simulate movement toward destination
          const lat = prev[0] + (Math.random() - 0.5) * 0.001;
          const lng = prev[1] + (Math.random() - 0.5) * 0.001;
          return [lat, lng];
        });
        setLastUpdate(new Date());
      }, 5000); // Update every 5 seconds

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [autoRefresh, trackingData.status]);

  const getStepIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Order Placed':
        return <Package className="w-6 h-6" />;
      case 'Processing':
        return <Package className="w-6 h-6" />;
      case 'Out for Delivery':
        return <Truck className="w-6 h-6" />;
      case 'Delivered':
        return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  const getCurrentStepIndex = () => {
    return trackingSteps.indexOf(trackingData.status);
  };

  const totalAmount = trackingData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    toast.success('Location updated');
  };

  // Route line from warehouse to customer
  const routeLine: [number, number][] = [
    warehouseLocation,
    riderLocation,
    customerLocation
  ];

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Track My Order</h1>
          <p className="text-gray-600">Real-time GPS tracking for your delivery</p>
        </div>

        {/* Search */}
        <Card className="border-gray-200 shadow-sm bg-white mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Enter order number (e.g., ORD-001)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Map and Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live GPS Map */}
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-red-500" />
                      Live GPS Tracking
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Last updated: {lastUpdate.toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="border-gray-300"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                    <Badge variant={autoRefresh ? "default" : "secondary"} className="bg-green-100 text-green-700 hover:bg-green-100">
                      {autoRefresh ? 'Live' : 'Paused'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200 relative z-0">
                  <MapWrapper
                    center={riderLocation}
                    zoom={13}
                    markers={[
                      {
                        position: warehouseLocation,
                        icon: warehouseIcon,
                        popupContent: '<strong>High Density Warehouse</strong><br />Starting Point'
                      },
                      {
                        position: riderLocation,
                        icon: riderIcon,
                        popupContent: `<strong>Rider: ${trackingData.riderName}</strong><br />Contact: ${trackingData.riderContact}<br />Currently delivering your order`
                      },
                      {
                        position: customerLocation,
                        icon: destinationIcon,
                        popupContent: `<strong>Your Location</strong><br />${trackingData.customer.address}`
                      }
                    ]}
                    polyline={routeLine}
                  />
                </div>

                {/* Map Legend */}
                <div className="mt-4 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Rider</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Destination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Warehouse</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Delivery Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="py-6">
                  <div className="flex items-center justify-between mb-6">
                    {trackingSteps.map((step, index) => {
                      const isCompleted = index <= getCurrentStepIndex();
                      const isCurrent = index === getCurrentStepIndex();

                      return (
                        <div key={step} className="flex flex-col items-center flex-1 relative">
                          {index < trackingSteps.length - 1 && (
                            <div
                              className={`absolute top-8 left-1/2 w-full h-1 transition-colors ${
                                isCompleted ? 'bg-gray-900' : 'bg-gray-200'
                              }`}
                              style={{ zIndex: 0 }}
                            />
                          )}

                          <div
                            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-200 text-gray-500'
                            } ${isCurrent ? 'ring-4 ring-gray-300' : ''}`}
                          >
                            {getStepIcon(step)}
                          </div>

                          <span
                            className={`mt-3 text-sm font-medium text-center ${
                              isCompleted ? 'text-gray-900' : 'text-gray-500'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mt-8">
                    <div
                      className="absolute top-0 left-0 h-full bg-gray-900 transition-all duration-500"
                      style={{ width: `${((getCurrentStepIndex() + 1) / trackingSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            event.completed ? 'bg-gray-900' : 'bg-gray-300'
                          }`}
                        />
                        {index < trackingData.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              event.completed ? 'bg-gray-900' : 'bg-gray-300'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p
                          className={`font-medium ${
                            event.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {event.status}
                        </p>
                        <p className="text-sm text-gray-600">{event.date}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900">Order {trackingData.orderNumber}</CardTitle>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {trackingData.status}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 mt-1">
                  {trackingData.placedDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tracking Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-medium text-gray-900">{trackingData.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courier:</span>
                      <span className="font-medium text-gray-900">{trackingData.courier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rider:</span>
                      <span className="font-medium text-gray-900">{trackingData.riderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rider Contact:</span>
                      <span className="font-medium text-gray-900">{trackingData.riderContact}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Estimated:
                      </span>
                      <span className="font-medium text-blue-600 text-right">{trackingData.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Address</h4>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                    <p>{trackingData.customer.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trackingData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-lg text-gray-900">₱{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900">{trackingData.paymentMethod}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Need Help?</CardTitle>
                <CardDescription className="text-gray-600">
                  Contact us about your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full border-gray-300 text-gray-900 hover:bg-gray-50">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-900 hover:bg-gray-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
