import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Users, Shield, MapPin, Mail, ShoppingCart } from 'lucide-react';

export default function AdminUsersPage() {
  const users = useAuthStore(s => s.users);
  const currentUser = useAuthStore(s => s.user);
  const updateUserRole = useAuthStore(s => s.updateUserRole);
  const fetchUsers = useAuthStore(s => s.fetchUsers);
  const orders = useOrderStore(s => s.orders);
  const fetchOrders = useOrderStore(s => s.fetchOrders);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, [fetchOrders, fetchUsers]);

  const handleRoleChange = (userId: string, newRole: 'user' | 'admin') => {
    if (userId === currentUser?.id) {
      alert("You cannot change your own role from here.");
      return;
    }
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateUserRole(userId, newRole);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <AdminNav />
        </aside>
        <div className="flex-grow">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and view their orders.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(!users || users.length === 0) ? (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No users found.
              </div>
            ) : (
              users.map((user) => {
                const userOrders = (orders || []).filter(o => o.userId === user.id);
                const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);

                return (
                  <Card key={user.id} className="flex flex-col border-muted/60 hover:border-primary/20 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg font-bold">
                          {user.name} 
                          {user.id === currentUser?.id && <span className="ml-2 text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">(You)</span>}
                        </CardTitle>
                        {user.role === 'admin' ? (
                          <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-transparent whitespace-nowrap">
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="whitespace-nowrap">
                            <Users className="mr-1 h-3 w-3" />
                            User
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-1 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-grow pb-3 space-y-4">
                      <div className="text-sm flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {user.address.street ? (
                            <>{user.address.street}, {user.address.city}, {user.address.state} {user.address.zip}</>
                          ) : (
                            "No address provided"
                          )}
                        </span>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{userOrders.length} Orders</span>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          ${totalSpent.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled={user.id === currentUser?.id}
                        onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      >
                        Make {user.role === 'admin' ? 'User' : 'Admin'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}