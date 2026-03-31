import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderCard from '@/components/OrderCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Address, User } from '@/types';
import { Edit, Save, Package, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const orders = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState<Address>({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const userOrders = useMemo(() => {
    if (!user) return [];
    return (orders ?? [])
      .filter((o) => o.userId === user.id)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, user]);

  const handleSave = () => {
    if (user) {
      const updatedUser: User = {
        ...user,
        name,
        address,
      };
      setCurrentUser(updatedUser);
      setIsEditing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and view your order history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Profile Details
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? <Save className="h-5 w-5 text-primary" /> : <Edit className="h-5 w-5" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  {isEditing ? (
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  ) : (
                    <p className="text-sm font-medium border border-transparent py-2">{user.name}</p>
                  )}
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Shipping Address</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Street</Label>
                      {isEditing ? (
                        <Input value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
                      ) : (
                        <p className="text-sm">{user.address.street || '-'}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City</Label>
                        {isEditing ? (
                          <Input value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
                        ) : (
                          <p className="text-sm">{user.address.city || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        {isEditing ? (
                          <Input value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} />
                        ) : (
                          <p className="text-sm">{user.address.state || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ZIP</Label>
                        {isEditing ? (
                          <Input value={address.zip} onChange={(e) => setAddress({...address, zip: e.target.value})} />
                        ) : (
                          <p className="text-sm">{user.address.zip || '-'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        {isEditing ? (
                          <Input value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
                        ) : (
                          <p className="text-sm">{user.address.country || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <Button className="w-full" onClick={handleSave}>
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Order History</h2>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-muted/30 border border-dashed rounded-xl p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground">
                  You haven't placed any orders yet. Once you do, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}