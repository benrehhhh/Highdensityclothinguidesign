import { useEffect, useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Edit,
  Eye,
  Plus,
  Navigation,
  Phone,
  User as UserIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { MapWrapper, riderIcon, warehouseIcon } from '../../components/map-wrapper';
import { adminApi } from '../../lib/admin-api';

type OrderStatus = 'Order Placed' | 'Processing' | 'Out for Delivery' | 'Delivered';

interface DeliveryOrder {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  items: string;
  trackingNumber: string;
  status: OrderStatus;
  placedDate: string;
  estimatedDelivery: string;
  courier?: string;
  riderName?: string;
  riderContact?: string;
  location?: [number, number];
  deliveryLogs?: {
    timestamp: string;
    coordinates: [number, number];
    status: string;
  }[];
}

const statusSteps: OrderStatus[] = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered'];

export function Delivery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<DeliveryOrder | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<DeliveryOrder | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Courier assignment form
  const [courierForm, setCourierForm] = useState({
    courier: '',
    riderName: '',
    riderContact: '',
    trackingNumber: ''
  });

  // Mock delivery orders
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([
    {
      id: '1',
      orderId: 'ORD-001',
      customer: 'Maria Santos',
      address: 'Quezon City, Metro Manila',
      items: 'Cotton Shirt (x2)',
      trackingNumber: 'TRK123456789PH',
      status: 'Out for Delivery',
      placedDate: '2026-04-12',
      estimatedDelivery: '2026-04-14',
      courier: 'J&T Express',
      riderName: 'Juan Santos',
      riderContact: '0917-123-4567',
      location: [14.6091, 121.0223],
      deliveryLogs: [
        { timestamp: '2026-04-14 09:00 AM', coordinates: [14.5995, 120.9842], status: 'Picked up from warehouse' },
        { timestamp: '2026-04-14 09:30 AM', coordinates: [14.6040, 121.0000], status: 'In transit' },
        { timestamp: '2026-04-14 10:00 AM', coordinates: [14.6091, 121.0223], status: 'Approaching destination' }
      ]
    },
    {
      id: '2',
      orderId: 'ORD-002',
      customer: 'Juan Dela Cruz',
      address: 'Makati City, Metro Manila',
      items: 'Linen Polo (x1)',
      trackingNumber: 'TRK987654321PH',
      status: 'Processing',
      placedDate: '2026-04-13',
      estimatedDelivery: '2026-04-15',
      courier: 'LBC',
      riderName: 'Pedro Reyes',
      riderContact: '0917-234-5678',
      location: [14.5547, 121.0244]
    },
    {
      id: '3',
      orderId: 'ORD-003',
      customer: 'Ana Reyes',
      address: 'Pasig City, Metro Manila',
      items: 'Cotton Shirt (x1), Linen Polo (x2)',
      trackingNumber: '',
      status: 'Order Placed',
      placedDate: '2026-04-14',
      estimatedDelivery: '2026-04-16'
    },
    {
      id: '4',
      orderId: 'ORD-004',
      customer: 'Pedro Garcia',
      address: 'Taguig City, Metro Manila',
      items: 'Premium Jacket (x1)',
      trackingNumber: 'TRK456789123PH',
      status: 'Delivered',
      placedDate: '2026-04-10',
      estimatedDelivery: '2026-04-12',
      courier: 'J&T Express',
      riderName: 'Carlos Tan',
      riderContact: '0917-345-6789',
      location: [14.5176, 121.0509]
    },
    ]);

  const filteredOrders = deliveryOrders.filter(order =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDeliveries = deliveryOrders.filter(o => o.status === 'Out for Delivery' && o.location);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Processing':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Order Placed':
        return <Clock className="w-4 h-4" />;
      case 'Processing':
        return <Package className="w-4 h-4" />;
      case 'Out for Delivery':
        return <Truck className="w-4 h-4" />;
      case 'Delivered':
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const statusCounts = {
    placed: deliveryOrders.filter(o => o.status === 'Order Placed').length,
    processing: deliveryOrders.filter(o => o.status === 'Processing').length,
    outForDelivery: deliveryOrders.filter(o => o.status === 'Out for Delivery').length,
    delivered: deliveryOrders.filter(o => o.status === 'Delivered').length,
  };

  const handleAssignCourier = async () => {
    if (!assigningOrder) return;

    const trackingNum = courierForm.trackingNumber || `TRK${Date.now()}PH`;

    await adminApi.updateDelivery(assigningOrder.id, {
      courier: courierForm.courier,
      riderName: courierForm.riderName,
      riderContact: courierForm.riderContact,
      trackingNumber: trackingNum,
      status: "Processing"
    });

    setDeliveryOrders(prev => prev.map(order =>
      order.id === assigningOrder.id
        ? {
            ...order,
            courier: courierForm.courier,
            riderName: courierForm.riderName,
            riderContact: courierForm.riderContact,
            trackingNumber: trackingNum,
            status: 'Processing'
          }
        : order
    ));

    toast.success('Courier assigned successfully');
    setIsAssignDialogOpen(false);
    setCourierForm({ courier: '', riderName: '', riderContact: '', trackingNumber: '' });
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await adminApi.updateDeliveryStatus(orderId, newStatus);
    setDeliveryOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order status updated to ${newStatus}`);
    setIsEditDialogOpen(false);
  };

  // Warehouse location
  const warehouseLocation: [number, number] = [14.5995, 120.9842];

  useEffect(() => {
    adminApi.getDelivery().then((rows) => {
      setDeliveryOrders(rows.map((row: any) => ({
        id: String(row.id),
        orderId: row.order_id,
        customer: row.customer,
        address: row.address,
        items: row.items,
        trackingNumber: row.tracking_number || "",
        status: row.status,
        placedDate: row.placed_date,
        estimatedDelivery: row.estimated_delivery,
        courier: row.courier || undefined,
        riderName: row.rider_name || undefined,
        riderContact: row.rider_contact || undefined
      })));
    }).catch(() => undefined);
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Delivery Management</h1>
          <p className="text-gray-600 mt-1">GPS tracking and courier assignment</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-gray-900 text-white' : 'border-gray-300'}
          >
            <Package className="w-4 h-4 mr-2" />
            List View
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
            className={viewMode === 'map' ? 'bg-gray-900 text-white' : 'border-gray-300'}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Map View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Order Placed</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{statusCounts.placed}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{statusCounts.processing}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out for Delivery</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{statusCounts.outForDelivery}</p>
              </div>
              <Truck className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{statusCounts.delivered}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer name, or tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      {viewMode === 'map' ? (
        /* Map View - Live GPS Feed */
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Navigation className="w-5 h-5 text-red-500" />
              Live GPS Feed - Active Deliveries
            </CardTitle>
            <CardDescription className="text-gray-600">
              {activeDeliveries.length} active delivery/deliveries in transit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
              <MapWrapper
                center={warehouseLocation}
                zoom={12}
                markers={[
                  {
                    position: warehouseLocation,
                    icon: warehouseIcon,
                    popupContent: '<strong>High Density Warehouse</strong><br />Manila, Philippines'
                  },
                  ...activeDeliveries
                    .filter(order => order.location)
                    .map(order => ({
                      position: order.location!,
                      icon: riderIcon,
                      popupContent: `<strong>${order.riderName}</strong><br />Order: ${order.orderId}<br />Customer: ${order.customer}<br />Contact: ${order.riderContact}`
                    }))
                ]}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        /* List View - Delivery Orders */
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Truck className="w-5 h-5 text-gray-700" />
              Delivery Orders
            </CardTitle>
            <CardDescription className="text-gray-600">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{order.orderId}</h4>
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium text-gray-900">Customer:</span> {order.customer}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {order.address}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Items:</span> {order.items}
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <span className="font-medium text-gray-900">Tracking:</span> {order.trackingNumber}
                          </div>
                        )}
                        {order.courier && (
                          <div>
                            <span className="font-medium text-gray-900">Courier:</span> {order.courier}
                          </div>
                        )}
                        {order.riderName && (
                          <div>
                            <span className="font-medium text-gray-900">Rider:</span> {order.riderName} ({order.riderContact})
                          </div>
                        )}
                      </div>

                      {/* Quick Status Update */}
                      <div className="flex gap-2 mt-3">
                        {statusSteps.map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={order.status === status ? 'default' : 'outline'}
                            onClick={() => handleUpdateStatus(order.id, status)}
                            className={order.status === status ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {!order.trackingNumber && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAssigningOrder(order);
                            setIsAssignDialogOpen(true);
                          }}
                          className="border-gray-300 text-gray-900 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Assign Courier
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingOrder(order);
                          setIsEditDialogOpen(true);
                        }}
                        className="border-gray-300 text-gray-900 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="border-gray-300 text-gray-900 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <Package className="w-5 h-5 text-gray-700" />
              Order Details - {selectedOrder?.orderId}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              View complete order information and delivery history
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium text-gray-900">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <p className="font-medium text-gray-900">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div className="mt-1">
                        <Badge className={`${getStatusColor(selectedOrder.status)} border`}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div>
                        <span className="text-gray-600">Tracking Number:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.trackingNumber}</p>
                      </div>
                    )}
                    {selectedOrder.courier && (
                      <>
                        <div>
                          <span className="text-gray-600">Courier:</span>
                          <p className="font-medium text-gray-900">{selectedOrder.courier}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Rider:</span>
                          <p className="font-medium text-gray-900">{selectedOrder.riderName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Contact:</span>
                          <p className="font-medium text-gray-900">{selectedOrder.riderContact}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.deliveryLogs && selectedOrder.deliveryLogs.length > 0 && (
                <>
                  <Separator className="bg-gray-200" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Delivery Logs (GPS History)</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedOrder.deliveryLogs.map((log, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-gray-900 rounded-full" />
                            {index < selectedOrder.deliveryLogs!.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <p className="font-medium text-gray-900">{log.status}</p>
                            <p className="text-gray-600">{log.timestamp}</p>
                            <p className="text-xs text-gray-500">
                              GPS: {log.coordinates[0].toFixed(4)}, {log.coordinates[1].toFixed(4)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator className="bg-gray-200" />

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">{selectedOrder.items}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Courier Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Assign Courier</DialogTitle>
            <DialogDescription className="text-gray-600">
              Assign courier and rider details for {assigningOrder?.orderId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-900">Courier Service</Label>
              <Select value={courierForm.courier} onValueChange={(v) => setCourierForm(prev => ({ ...prev, courier: v }))}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select courier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="J&T Express">J&T Express</SelectItem>
                  <SelectItem value="LBC">LBC</SelectItem>
                  <SelectItem value="Ninja Van">Ninja Van</SelectItem>
                  <SelectItem value="Grab Express">Grab Express</SelectItem>
                  <SelectItem value="Lalamove">Lalamove</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900">Rider Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Enter rider name"
                  value={courierForm.riderName}
                  onChange={(e) => setCourierForm(prev => ({ ...prev, riderName: e.target.value }))}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900">Rider Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="09XX-XXX-XXXX"
                  value={courierForm.riderContact}
                  onChange={(e) => setCourierForm(prev => ({ ...prev, riderContact: e.target.value }))}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900">Tracking Number (Optional)</Label>
              <Input
                placeholder="Leave blank to auto-generate"
                value={courierForm.trackingNumber}
                onChange={(e) => setCourierForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                className="border-gray-300"
              />
              <p className="text-xs text-gray-500">If left blank, a tracking number will be generated automatically</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignDialogOpen(false);
                setCourierForm({ courier: '', riderName: '', riderContact: '', trackingNumber: '' });
              }}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              className="bg-gray-900 hover:bg-gray-800 text-white"
              onClick={handleAssignCourier}
              disabled={!courierForm.courier || !courierForm.riderName || !courierForm.riderContact}
            >
              Assign Courier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Update Delivery Status</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update the delivery status for {editingOrder?.orderId}
            </DialogDescription>
          </DialogHeader>

          {editingOrder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-gray-900">Current Status</Label>
                <div>
                  <Badge className={`${getStatusColor(editingOrder.status)} border`}>
                    {editingOrder.status}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-gray-200" />

              <div className="space-y-2">
                <Label className="text-gray-900">Update Status To:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {statusSteps.map((status) => (
                    <Button
                      key={status}
                      variant={editingOrder.status === status ? 'default' : 'outline'}
                      onClick={() => {
                        handleUpdateStatus(editingOrder.id, status);
                      }}
                      className={editingOrder.status === status
                        ? 'bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    >
                      {getStatusIcon(status)}
                      <span className="ml-2">{status}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
