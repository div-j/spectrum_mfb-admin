"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowLeft, User, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useUsers } from "@/hooks/useUsers";
import { useCompany } from "@/hooks/useCompany";

interface NewCorporateUser {
  company_id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string[]; // allow multiple roles
}

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string;
}

export default function CreateUserModal({
  open,
  onOpenChange,
  companyId,
}: CreateUserModalProps) {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<"form" | "review" | "success">(
    "form"
  );
  const [user, setUser] = useState<NewCorporateUser>({
    name: "",
    email: "",
    phone: "",
    role: ["initiator"],
    company_id: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { createUser, isCreating } = useUsers();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    companyId ? companyId.toString() : ""
  );
  const { companies } = useCompany();


  const selectedCompany = companies?.find(
    (c: any) => c.id?.toString() === selectedCompanyId
  );

  // Role-based access control - allow modal to render for UX reasons,
  // but we'll show a permission message inside if the user isn't a maker.
  const isMaker = profile?.role === "maker";

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!user.name.trim()) newErrors.name = "Full name is required";
    if (!user.email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setCurrentStep("review");
  };

  const handleConfirm = async () => {
    try {
      // Find the selected company object and construct the payload
      const selCompany = selectedCompany;
      const payload = {
        company_id: selCompany ? selCompany.id : Number(user.company_id),
        account_no: String(selCompany?.account_no),
        daily_transfer_limit: String(selCompany?.daily_transfer_limit),
        single_transfer_limit: String(selCompany?.single_transfer_limit),
        users: [
          {
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            roles: user.role,
          },
        ],
      };

      console.log("Payload sent to backend:", payload);

      await createUser(payload);

      toast.success("User created successfully!");
      setCurrentStep("success");
    } catch (error: any) {
      console.error("❌ Full error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Failed to create user. Please try again."
      );
    }
  };

  const resetForm = () => {
    setUser({
      name: "",
      email: "",
      phone: "",
      role: ["initiator"],
      company_id: companyId || "",
    });
    setSelectedCompanyId(companyId ? companyId.toString() : "");
    setErrors({});
    setCurrentStep("form");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after a short delay to allow modal close animation
    setTimeout(resetForm, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* FORM STEP */}
        {currentStep === "form" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">
                    Create Corporate User
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Fill in user details to add a new corporate user
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Details */}
              <div className="space-y-4">
                 <Label htmlFor="company">
                    Select Company <span className="text-red-500">*</span>
                  </Label>
                <div className="space-y-2">
                  <Select
                    value={selectedCompanyId}
                    onValueChange={(val) => {
                      setSelectedCompanyId(val);
                      setUser((prev) => ({ ...prev, company_id: val }));
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel> Company</SelectLabel>
                        {companies?.map((company: any) => (
                          <SelectItem
                            key={company.id}
                            value={company.id.toString()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={user.name}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={
                      errors.name ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@company.com"
                    value={user.email}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className={
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+234 xxxxx"
                    value={user.phone}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="role-initiator"
                        checked={user.role.includes("initiator")}
                        onCheckedChange={(checked) => {
                          setUser((prev) => {
                            const roles = new Set(prev.role);
                            if (checked) roles.add("initiator");
                            else roles.delete("initiator");
                            return { ...prev, role: Array.from(roles) };
                          });
                        }}
                      />
                      <Label htmlFor="role-initiator">Initiator</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="role-reviewer"
                        checked={user.role.includes("reviewer")}
                        onCheckedChange={(checked) => {
                          setUser((prev) => {
                            const roles = new Set(prev.role);
                            if (checked) roles.add("reviewer");
                            else roles.delete("reviewer");
                            return { ...prev, role: Array.from(roles) };
                          });
                        }}
                      />
                      <Label htmlFor="role-reviewer">Reviewer</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="role-approver"
                        checked={user.role.includes("approver")}
                        onCheckedChange={(checked) => {
                          setUser((prev) => {
                            const roles = new Set(prev.role);
                            if (checked) roles.add("approver");
                            else roles.delete("approver");
                            return { ...prev, role: Array.from(roles) };
                          });
                        }}
                      />
                      <Label htmlFor="role-approver">Approver</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
                <Button type="submit">Review</Button>
              </div>
            </form>
          </>
        )}

        {/* REVIEW STEP */}
        {currentStep === "review" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">
                    Review User Details
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CompanyID</span>
                  <span>{companyId || user.company_id || "Spectrum MFB"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="capitalize">
                    {user.role && user.role.length > 0
                      ? user.role
                          .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
                          .join(", ")
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("form")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button onClick={handleConfirm} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Confirm & Create"}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* SUCCESS STEP */}
        {currentStep === "success" && (
          <div className="text-center py-12 space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">
              User Creation Request Submitted!
            </h2>
            <p className="text-muted-foreground">
              Your request has been submitted and is pending approval by an
              authorizer.
            </p>

            <div className="bg-muted/30 rounded-lg p-6 max-w-md mx-auto">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">
                    {user.role && user.role.length > 0
                      ? user.role
                          .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
                          .join(", ")
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">Created</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-6">
              <Button variant="outline" onClick={resetForm}>
                Create Another
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
