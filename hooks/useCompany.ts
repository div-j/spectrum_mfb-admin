"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Company } from "@/lib/interface";
import axios from "axios";
import { useAuth } from "@/providers/auth-provider";
import Cookies from 'js-cookie';
const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY;


export const useCompany = (
  search?: string,
  page: number = 1,
  limit: number = 10
) => {
   const { token } = useAuth();
  const queryClient = useQueryClient();
   // Get token from auth context or cookies
  const authToken =  Cookies.get('admin_token');

  // 1️⃣ Fetch companies
  const { data, isLoading, error } = useQuery({
    queryKey: ["companies",{ search, page, limit }],
    queryFn: async () => {
           try {
                // Build query string dynamically
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        // Call API
        const { data } = await axios.get(`/api/v1/companies?${params.toString()}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${authToken}`, 
            // 'spectrumz-mobile': API_KEY,
          },
        });


        return data

      } catch (err: any) {
        console.error("❌ Failed to fetch companies:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to fetch companies");
        throw err;
      }
    },
    enabled: !!authToken, // only run if token is available
    
  });

  // 2️⃣ Create company
  const createCompanyMutation = useMutation({
    mutationFn: async (newCompany: Company) => {
        console.log("Payload to gateway:", newCompany);
        const { data } = await axios.post("/api/v1/admin/register/company", newCompany,
          {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
          }
        );
        // toast.success(`Company created successfully!`);
        return data;
   
    },
    onSuccess: () => {
      toast.success("Company created successfully!"); // now displays after success
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (err: any) => {
      console.error("❌ Full error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to create company");
    }
  });

  // 3️⃣ Update company
  const updateCompanyMutation = useMutation({
    mutationFn: async (company: Partial<Company> & { id: string }) => {
      try {
        const { data } = await axios.put(`/companies/${company.id}`, company);
        return data;
      } catch (err: any) {
        toast.error(err.message || "Failed to update company");
        throw err;
      }
    },
    onSuccess: () => {
      toast.success("Company updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      },
  });

  // 4️⃣ Delete company
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await axios.delete(`/companies/${id}`);
        toast.success("Company deleted successfully!");
        return id;
      } catch (err: any) {
        toast.error(err.message || "Failed to delete company");
        throw err;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });

  return {
    companies: data?.data?.companies,
    isLoading,
    error,
    createCompany: createCompanyMutation.mutateAsync,
    updateCompany: updateCompanyMutation.mutateAsync,
    deleteCompany: deleteCompanyMutation.mutateAsync,
    isCreating: createCompanyMutation.isPending,
    isUpdating: updateCompanyMutation.isPending,
    isDeleting: deleteCompanyMutation.isPending,
  };
};
