import { useState, useEffect } from 'react';
import { Search, Edit, Trash, Lock, Unlock, PlusCircle, UserPlus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import PageContainer from '@/components/layout/page-container';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { toast } = useToast();

  const basePathTest = 'http://13.60.98.6:5001/api/users/'

  // Fetch all users from the API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${basePathTest}`,{
            method: 'GET',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('accessToken')}`, // Assuming you store the token in cookies
                // Add any authentication headers if required
            },  
        });
        const data = await response.json();
        const formattedUsers = data.map((user) => ({
          id: user._id,
          name: user.fullName,
          email: user.email,
          username: user.username,
          roles: user.roles,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error fetching users',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Apply search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = users.filter(
      (user) =>
        user.id.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
    );
    setFilteredUsers(result);
  }, [searchTerm, users]);

  // Handle user actions
  const handleEditUser = (user) => {
    toast({
      title: 'Edit User',
      description: `Editing user: ${user.name}`,
    });
    // Implement edit logic here
  };

  const handleAddRole = (user) => {
    toast({
      title: 'Add Role',
      description: `Adding role to user: ${user.name}`,
    });
    // Implement add role logic here
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:5002/api/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter((user) => user.id !== userId));
      toast({
        title: 'User Deleted',
        description: `User with ID ${userId} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleLockUser = async (user) => {
    try {
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, accountStatus: u.accountStatus === 'active' ? 'locked' : 'active' } : u
      );
      setUsers(updatedUsers);
      toast({
        title: user.accountStatus === 'active' ? 'User Locked' : 'User Unlocked',
        description: `${user.name} has been ${user.accountStatus === 'active' ? 'locked' : 'unlocked'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <PageContainer title="Admin Panel" description="Manage users and roles">
      <div className="p-6 space-y-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-xl">
            <CardTitle className="font-display font-semibold text-lg">User Management</CardTitle>
            <div className="relative mt-2 sm:mt-0 w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-gray-50 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0 bg-white">
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://source.unsplash.com/random/100x100?face&${user.id}`} alt={user.name} />
                            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, i) => (
                            <Badge key={i} className="bg-blue-500 text-white hover:bg-blue-600">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.accountStatus === 'active' ? 'outline' : 'destructive'}
                          className={user.accountStatus === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {user.accountStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-indigo-600 hover:bg-indigo-50"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => handleAddRole(user)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleLockUser(user)}
                          >
                            {user.accountStatus === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}