// hooks/useApprovals.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/providers/auth-provider";
import Cookies from 'js-cookie';
import { pendingActions } from "@/lib/mock-data";

interface PendingAction {
  id: string;
  type: string;
  description: string;
  initiatedBy: string;
  createdAt: string;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  approverComment?: string;
  payload: any;
}

export const useApprovals = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const authToken = Cookies.get('admin_token');

  // Fetch pending and rejected actions
  const { data, isLoading, error } = useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      // For now, using mock data. Replace with actual API call when available
      // const { data } = await axios.get("/api/v1/admin/pending-actions", {
      //   withCredentials: true,
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${authToken}`,
      //   },
      // });
      // return data.actions || data;

      // Filter mock data to show only pending or rejected
      return pendingActions.filter(action =>
        action.status === 'pending' || action.status === 'rejected'
      );
    },
    enabled: true // Always enabled since using mock data
  });

  // Approve action
  const approveActionMutation = useMutation({
    mutationFn: async ({ actionId, comment }: { actionId: string; comment: string }) => {
      const { data } = await axios.post(`/admin/api/mock/pending-actions/approve`, {
        actionId,
        approverId: token?.id || 'admin-002', // Use auth profile
        comment
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Action approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
    },
    onError: (err: any) => {
      console.error("❌ Error approving action:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to approve action");
    },
  });

  // Reject action
  const rejectActionMutation = useMutation({
    mutationFn: async ({ actionId, comment }: { actionId: string; comment: string }) => {
      const { data } = await axios.post(`/admin/api/mock/pending-actions/reject`, {
        actionId,
        approverId: token?.id || 'admin-002',
        comment
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Action rejected successfully!");
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
    },
    onError: (err: any) => {
      console.error("❌ Error rejecting action:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to reject action");
    },
  });

  return {
    approvals: data || [],
    isLoading,
    error,
    approveAction: approveActionMutation.mutateAsync,
    rejectAction: rejectActionMutation.mutateAsync,
    isApproving: approveActionMutation.isPending,
    isRejecting: rejectActionMutation.isPending,
  };
};