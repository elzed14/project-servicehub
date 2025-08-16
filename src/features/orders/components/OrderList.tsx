import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Order {
  _id: string;
  service: {
    title: string;
    images: string[];
    price: number;
  };
  buyer: {
    name: string;
    avatar?: string;
  };
  seller: {
    name: string;
    avatar?: string;
  };
  amount: number;
  status: string;
  createdAt: string;
  deliveryDate?: string;
}

interface OrderListProps {
  userId: string;
  role?: 'buyer' | 'seller';
}

const OrderList: React.FC<OrderListProps> = ({ userId, role = 'buyer' }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [userId, role]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/user/${userId}?role=${role}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'En attente',
      active: 'Active',
      in_progress: 'En cours',
      delivered: 'Livrée',
      completed: 'Terminée',
      cancelled: 'Annulée',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded"></div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start space-x-4">
            <img
              src={order.service.images[0] || '/default-service.jpg'}
              alt={order.service.title}
              className="w-16 h-16 rounded object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{order.service.title}</h3>
                  <p className="text-sm text-gray-600">
                    {role === 'buyer' ? `Vendeur: ${order.seller.name}` : `Acheteur: ${order.buyer.name}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.createdAt), { locale: fr })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{order.amount} FCFA</p>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune commande trouvée
        </div>
      )}
    </div>
  );
};

export default OrderList;
