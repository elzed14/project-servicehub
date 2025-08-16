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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [userId, role, page]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/user/${userId}?role=${role}&page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
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
              src={order.service.images[0]<edit_file>
<path>src/features/orders/components/OrderForm.tsx</path>
<content>import React, { useState } from 'react';
import { useAuth } from '../../../context/AppContext';
import { CreditCard, Smartphone } from 'lucide-react';

interface OrderFormProps {
  service: {
    _id: string;
    title: string;
    price: number;
    user: {
      _id: string;
      name: string;
    };
  };
  onOrderCreated: (order: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ service, onOrderCreated }) => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Vous devez être connecté pour passer une commande');
      return;
    }

    if (!requirements.trim()) {
      setError('Veuillez décrire vos besoins');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          serviceId: service._id,
          requirements,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      const order = await response.json();
      onOrderCreated(order);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Passer une commande pour {service.title}</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Exigences</label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Décrivez vos besoins..."
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="stripe">Stripe</option>
          <option value="orange_money">Orange Money</option>
          <option value="mtn_money">MTN Money</option>
          <option value="moov_money">Moov Money</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Passer la commande'}
      </button>
    </form>
  );
};

export default OrderForm;
