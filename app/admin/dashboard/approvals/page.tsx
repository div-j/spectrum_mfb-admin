"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck, Clock } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/providers/auth-provider";
import { getRoleBadge } from "../components/getBadge";

export default function PendingApprovalsPage() {
  const { user: profile } = useAuth();

  // Fetch only inactive users
  const { users, isLoading } = useUsers("inactive");

  const pending = (users ?? []).filter(
    (u: any) =>
      u.activated === false ||
      u.activated === 0 ||
      u.status === "inactive" ||
      u.status === "pending"
  );

  if (profile?.role !== "admin2") {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
            <p className="text-red-600">Only authorizers can view pending approvals.</p>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pending User Approvals</h1>
          <p className="text-sm text-muted-foreground">
            These users are inactive and need your approval.
          </p>
        </div>

        <Badge variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          {pending?.length || 0} Pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Inactive Users Awaiting Approval
          </CardTitle>
        </CardHeader>

        <CardContent>
          {pending.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">All Users Active!</h3>
              <p className="text-green-600">There are no inactive users to approve.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pending.map((user: any) => (
                    <TableRow key={user?.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{user?.name}</div>
                      </TableCell>

                      <TableCell>{user?.email}</TableCell>

                      <TableCell>{user?.company_name|| "N/A"}</TableCell>

                      <TableCell>
                        {getRoleBadge(user?.status)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link href={`/admin/dashboard/users/${user.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            Take Action
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
