import React, { useState } from 'react';
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
    } catch (err:
