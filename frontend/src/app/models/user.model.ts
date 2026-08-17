export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}