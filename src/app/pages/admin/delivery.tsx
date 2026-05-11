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
  User as UserIcon,
  X
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

type OrderStatus = 'Order Placed' | 'Pending Confirmation' | 'Processing' | 'Out for Delivery' | 'Delivered';

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
  total?: number;
  paymentMethod?: string;
}

const statusSteps: OrderStatus[] = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered'];

export function Delivery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSort, setOrderSort] = useState<'newest' | 'oldest'>('newest');
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

  // Status update form
  const [statusDescription, setStatusDescription] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);

  // Rejection reason form
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectingOrder, setRejectingOrder] = useState<DeliveryOrder | null>(null);

  // Load real user orders from localStorage
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const mappedOrders: DeliveryOrder[] = userOrders.map((order: any) => ({
      id: order.id.toString(),
      orderId: `#${order.id}`,
      customer: order.customer?.name || 'Unknown',
      address: order.shippingAddress || 'No address provided',
      items: order.items?.map((item: any) => `${item.name} (x${item.quantity})`).join(', ') || 'No items',
      trackingNumber: order.trackingNumber || '',
      status: order.status === 'Pending Confirmation' ? 'Pending Confirmation' :
              order.status === 'Processing' ? 'Processing' :
              order.status === 'Delivered' ? 'Delivered' :
              order.status === 'Out for Delivery' ? 'Out for Delivery' :
              order.status === 'Order Placed' ? 'Order Placed' : 'Pending Confirmation',
      placedDate: new Date(order.date).toLocaleDateString(),
      estimatedDelivery: new Date(new Date(order.date).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      courier: order.courier || '',
      riderName: order.riderName || '',
      riderContact: order.riderContact || '',
      location: order.status === 'Out for Delivery' ? [14.6091, 121.0223] : undefined,
      deliveryLogs: order.status === 'Out for Delivery' ? [
        { timestamp: new Date().toLocaleString(), coordinates: [14.5995, 120.9842], status: 'Picked up from warehouse' }
      ] : [],
      total: order.total,
      paymentMethod: order.paymentMethod
    }));
    setDeliveryOrders(mappedOrders);
  };

  const filteredOrders = deliveryOrders
    .filter(order =>
      (statusFilter === 'all' || order.status === statusFilter) &&
      (order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Use the original order ID (timestamp) for sorting instead of formatted date
      const dateA = parseInt(a.id) || 0;
      const dateB = parseInt(b.id) || 0;
      if (orderSort === 'newest') return dateB - dateA;
      return dateA - dateB;
    });

  const activeDeliveries = deliveryOrders.filter(o => o.status === 'Out for Delivery' && o.location);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Pending Confirmation':
        return 'bg-orange-100 text-orange-700 border-orange-300';
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
      case 'Pending Confirmation':
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
    pendingConfirmation: deliveryOrders.filter(o => o.status === 'Pending Confirmation').length,
    placed: deliveryOrders.filter(o => o.status === 'Order Placed').length,
    processing: deliveryOrders.filter(o => o.status === 'Processing').length,
    outForDelivery: deliveryOrders.filter(o => o.status === 'Out for Delivery').length,
    delivered: deliveryOrders.filter(o => o.status === 'Delivered').length,
  };

  const handleAssignCourier = async () => {
    if (!assigningOrder) return;

    const updatedOrders = deliveryOrders.map(order =>
      order.id === assigningOrder.id
        ? {
            ...order,
            courier: courierForm.courier,
            riderName: courierForm.riderName,
            riderContact: courierForm.riderContact,
            trackingNumber: courierForm.trackingNumber,
            status: 'Processing' as OrderStatus
          }
        : order
    );
    setDeliveryOrders(updatedOrders);

    // Update localStorage userOrders
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const updatedUserOrders = userOrders.map((order: any) =>
      order.id.toString() === assigningOrder.id
        ? {
            ...order,
            courier: courierForm.courier,
            riderName: courierForm.riderName,
            riderContact: courierForm.riderContact,
            trackingNumber: courierForm.trackingNumber,
            status: 'Processing'
          }
        : order
    );
    localStorage.setItem('userOrders', JSON.stringify(updatedUserOrders));

    toast.success('Courier assigned successfully');
    setIsAssignDialogOpen(false);
    setCourierForm({ courier: '', riderName: '', riderContact: '', trackingNumber: '' });
  };

  const handleUpdateStatus = () => {
    if (!editingOrder) return;
    
    // If no status selected but description is provided, only send description
    if (!selectedStatus && !statusDescription) return;
    
    if (selectedStatus) {
      const updatedOrders = deliveryOrders.map(order =>
        order.id === editingOrder.id ? { ...order, status: selectedStatus } : order
      );
      setDeliveryOrders(updatedOrders);

      // Update localStorage userOrders
      const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const updatedUserOrders = userOrders.map((order: any) =>
        order.id.toString() === editingOrder.id.toString()
          ? { ...order, status: selectedStatus }
          : order
      );
      localStorage.setItem('userOrders', JSON.stringify(updatedUserOrders));
    }

    // Create notification for order status change or description
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    if (selectedStatus && statusDescription) {
      notifications.push({
        id: Date.now(),
        type: 'order',
        title: `Order Status Updated`,
        message: `Your order #${editingOrder.id} status has been updated to ${selectedStatus}: ${statusDescription}`,
        time: new Date().toISOString(),
        read: false
      });
    } else if (selectedStatus) {
      notifications.push({
        id: Date.now(),
        type: 'order',
        title: `Order Status Updated`,
        message: `Your order #${editingOrder.id} status has been updated to ${selectedStatus}`,
        time: new Date().toISOString(),
        read: false
      });
    } else if (statusDescription) {
      notifications.push({
        id: Date.now(),
        type: 'order',
        title: `Order Update`,
        message: `Your order #${editingOrder.id}: ${statusDescription}`,
        time: new Date().toISOString(),
        read: false
      });
    }
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success(selectedStatus ? `Order status updated to ${selectedStatus}` : 'Order update sent');
    setIsEditDialogOpen(false);
    setStatusDescription('');
    setSelectedStatus(null);
  };

  const handleConfirmOrder = (order: DeliveryOrder) => {
    const updatedOrders = deliveryOrders.map(o =>
      o.id === order.id ? { ...o, status: 'Order Placed' } : o
    );
    setDeliveryOrders(updatedOrders);

    // Update localStorage userOrders
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const updatedUserOrders = userOrders.map((o: any) =>
      o.id.toString() === order.id.toString()
        ? { ...o, status: 'Order Placed' }
        : o
    );
    localStorage.setItem('userOrders', JSON.stringify(updatedUserOrders));

    // Create notification for order confirmation
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: Date.now(),
      type: 'order',
      title: `Order Confirmed`,
      message: `Your order #${order.id} has been confirmed`,
      time: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success(`Order #${order.id} confirmed`);
  };

  const handleRejectOrder = (order: DeliveryOrder) => {
    setRejectingOrder(order);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const confirmRejectOrder = () => {
    if (!rejectingOrder) return;

    const updatedOrders = deliveryOrders.map(o =>
      o.id === rejectingOrder.id ? { ...o, status: 'Order Placed' as OrderStatus } : o
    );
    setDeliveryOrders(updatedOrders);

    // Update localStorage userOrders
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const updatedUserOrders = userOrders.map((o: any) =>
      o.id.toString() === rejectingOrder.id.toString()
        ? { ...o, status: 'Order Placed' }
        : o
    );
    localStorage.setItem('userOrders', JSON.stringify(updatedUserOrders));

    // Create notification for order rejection
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: Date.now(),
      type: 'order',
      title: `Order Rejected`,
      message: rejectionReason 
        ? `Your order #${rejectingOrder.id} could not be processed. Reason: ${rejectionReason}`
        : `Your order #${rejectingOrder.id} could not be processed. Please contact support for details.`,
      time: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success(`Order #${rejectingOrder.id} rejected`);
    setIsRejectDialogOpen(false);
    setRejectionReason('');
    setRejectingOrder(null);
  };

  const handleDeleteDelivery = (id: string) => {
    const updatedOrders = deliveryOrders.filter(order => order.id !== id);
    setDeliveryOrders(updatedOrders);

    // Update localStorage userOrders
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const updatedUserOrders = userOrders.filter((order: any) => order.id.toString() !== id);
    localStorage.setItem('userOrders', JSON.stringify(updatedUserOrders));

    toast.success('Delivery order deleted successfully');
  };

  // Warehouse location
  const warehouseLocation: [number, number] = [14.5995, 120.9842];

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
      <div className="grid md:grid-cols-5 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Confirmation</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{statusCounts.pendingConfirmation}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-700" />
                <CardTitle className="text-gray-900">Delivery Orders</CardTitle>
                <CardDescription className="text-gray-600 ml-2">
                  ({filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''})
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by order ID, customer, or tracking number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="border-gray-300 w-40">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending Confirmation">Pending Confirmation</SelectItem>
                    <SelectItem value="Order Placed">Order Placed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={orderSort === 'newest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOrderSort('newest')}
                  className={orderSort === 'newest' ? 'bg-gray-900 text-white' : ''}
                >
                  Newest
                </Button>
                <Button
                  variant={orderSort === 'oldest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOrderSort('oldest')}
                  className={orderSort === 'oldest' ? 'bg-gray-900 text-white' : ''}
                >
                  Oldest
                </Button>
              </div>
            </div>
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
                    </div>

                    <div className="flex gap-2 ml-4">
                      {order.status === 'Pending Confirmation' ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleConfirmOrder(order)}
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Confirm
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectOrder(order)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          {order.status === 'Processing' && !order.trackingNumber && (
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
                              setStatusDescription('');
                              setSelectedStatus(null);
                              setIsEditDialogOpen(true);
                            }}
                            className="border-gray-300 text-gray-900 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                          </Button>
                        </>
                      )}
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
                <Label className="text-gray-900">Update Status To (Optional):</Label>
                <div className="grid grid-cols-2 gap-2">
                  {statusSteps.map((status) => (
                    <Button
                      key={status}
                      variant={selectedStatus === status ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus(status)}
                      className={selectedStatus === status
                        ? 'bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    >
                      {getStatusIcon(status)}
                      <span className="ml-2">{status}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Select a status to update, or leave blank to only send description</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">Status Description (Optional)</Label>
                <textarea
                  placeholder="Add details about the status update..."
                  value={statusDescription}
                  onChange={(e) => setStatusDescription(e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setStatusDescription('');
                setSelectedStatus(null);
              }}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!selectedStatus && !statusDescription}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              Send Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting order #{rejectingOrder?.id}. This is optional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
              <textarea
                id="rejection-reason"
                placeholder="e.g., Out of stock, payment failed, invalid address..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason('');
                setRejectingOrder(null);
              }}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRejectOrder}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Reject Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
