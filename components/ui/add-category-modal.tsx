"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryName: string) => void;
  currentCategories: string[];
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
  currentCategories,
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      setError("Category name cannot be empty.");
      return;
    }
    if (
      currentCategories.some(
        (category) => category.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setError("This category already exists.");
      return;
    }
    onSave(trimmedName);
    setCategoryName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setCategoryName("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter category name"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
