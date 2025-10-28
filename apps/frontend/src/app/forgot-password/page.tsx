"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// import { ResetPasswordModal } from "@/components/reset-password-modal";

export default function ForgotPasswordPage() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Button onClick={() => setOpen(true)} className="w-full max-w-xs">
        Reset Password
      </Button>
      {/* <ResetPasswordModal open={open} onOpenChange={setOpen} /> */}
    </div>
  );
}
