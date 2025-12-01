// hooks/useUsers.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "@/lib/axios";
import { toast } from "sonner";
import { User } from "@/lib/interface";
import axios from "axios";
import { useAuth } from "@/providers/auth-provider";
import Cookies from 'js-cookie';
const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY;

export const useUsers = (
  companyId?: string,
  search?: string,
  page: number = 1,
  limit: number = 10
) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
   // Get token from auth context or cookies
  const authToken = Cookies.get('admin_token');
  console.log("auth token", authToken)

  // 1️⃣ Fetch users
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", { companyId, search, page, limit }],
    queryFn: async () => {
     
                // Build query string dynamically
        const params = new URLSearchParams();
        if (companyId) params.append("company_id", companyId);
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        // Call API
        const { data } = await axios.get(`/api/v1/admin/users?${params.toString()}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            //  Authorization: `Bearer ${authToken}`,
            // 'spectrumz-mobile': API_KEY,
            // Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if token is from context
          },
        });

        // console.log(data.users)

        // API may return a wrapped payload like { data: { users: [...] } }
        // Normalize to return the users array when possible, otherwise return the raw data
        return data
    
    },
    enabled: !!authToken 
    
  });

  // 2️⃣ Create user
  const createUserMutation = useMutation({
    mutationFn: async (newUser: User) => {
        const { data } = await axios.post("/api/v1/admin/register/corporate", newUser,
          {
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${authToken}`,
            // Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if token is from context
          },
        }
        );
        // toast.success("User created successfully!");
        return data;
      },
     onSuccess: () => {
    toast.success("User created successfully!"); // now displays after success
    queryClient.invalidateQueries({ queryKey: ["users", companyId] });
  },
  onError: (err: any) => {
    toast.error(err.response?.data?.message || "Failed to create user");
  },
  });

  // 3️⃣ Update user
  const updateUserMutation = useMutation({
    mutationFn: async (user: Partial<User> & { id: string }) => {
      try {
        const { data } = await axios.put(`/users/${user.id}`, user);
        toast.success("User updated successfully!");
        return data;
      } catch (err: any) {
        toast.error(err.message || "Failed to update user");
        throw err;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", companyId] }),
  });

  // 4️⃣ Delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await axios.delete(`/users/${id}`);
        toast.success("User deleted successfully!");
        return id;
      } catch (err: any) {
        toast.error(err.message || "Failed to delete user");
        throw err;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", companyId] }),
  });

  
   // 3️⃣ Update user status (activate/deactivate)
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, activated }: { userId: number; activated: boolean }) => {
      const { data } = await axios.post("/api/v1/admin/users/status", { user_id: userId, activated }, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${authToken}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("User status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      console.error("❌ Error updating user status:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update user status");
    },
  });

  return {
    users: data?.users,
    isLoading,
    error,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    updateUserStatus: updateUserStatusMutation.mutateAsync,
    isUpdatingStatus: updateUserStatusMutation.isPending,

    // mutation states for UI feedback
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
