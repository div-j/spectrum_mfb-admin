"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import CreateUserModal from "./components/create-user-modal";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";
import { useAuth } from "@/providers/auth-provider";
import { useUsers } from "@/hooks/useUsers";

export default function ManageUsers() {
  const { user } = useAuth();

  // Filters passed directly to useUsers
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Pagination (optional, hook supports it)
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch from backend using filters - fix the hook call
  const { users, isLoading, error, updateUser, deleteUser } = useUsers(
    undefined, // companyId
    searchTerm,
    page,
    limit
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserAction = async (action: string, userId?: string | number) => {
    if (!userId) return;
    const idStr = String(userId);

    try {
      switch (action) {
        case "activate":
          // Use updateUser if available, otherwise implement specific logic
          if (updateUser) {
            await updateUser({ id: idStr});
          }
          break;
        case "deactivate":
          if (updateUser) {
            await updateUser({ id: idStr });
          }
          break;
        case "delete":
          if (deleteUser) {
            await deleteUser(idStr);
          }
          break;
      }
    } catch (err) {
      // User action failed - error already handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Users</h1>

        {user?.role === "maker" && (
          <Button onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        )}
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        onReset={() => {
          setSearchTerm("");
          setRoleFilter("all");
        }}
      />

      {/* Users Table */}
      <Card>
        <UserTable 
          users={users || []} 
          isLoading={isLoading} 
          onAction={handleUserAction} 
        />

        {!isLoading && (!users || users.length === 0) && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No users found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </Card>

      {/* Modal */}
      <CreateUserModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}