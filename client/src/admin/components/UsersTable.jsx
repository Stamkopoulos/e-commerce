import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileTextIcon, Loader2, Trash2Icon } from "lucide-react";

const UsersTable = ({
  users,
  currentPage,
  totalPages,
  setCurrentPage,
  formatDate,
  onEditUser,
  onDeleteUser,
  onRoleChange,
}) => {
  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Created At</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="p-4">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </td>

              <td className="p-4">{formatDate(user.createdAt)}</td>

              <td className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="gosth"
                      className={`capitalize ${user.role === "admin" ? "text-primary" : ""} w-[90px] justify-between capitalize`}
                    >
                      <span>{user.role}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="w-[100px]">
                    {["admin", "user"].map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => {
                          if (role !== user.role) {
                            onRoleChange(user._id, role, user);
                            toast("Role updated successfully", {
                              description: `${user.name} is now a ${role}.`,
                              action: {
                                label: "Undo",
                                onClick: () =>
                                  onRoleChange(user._id, user.role),
                              },
                            });
                          }
                        }}
                        className={`capitalize ${role === "admin" ? "text-primary" : ""}`}
                      >
                        {role}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>

              {/* <td className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        onDeleteUser(user._id);
                        toast("User deleted", {
                          description: `${user.name} has been removed.`,
                        });
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td> */}

              <td className="h-16 px-4">
                <TooltipProvider>
                  <div className="flex gap-1">
                    {/* View */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => onEditUser(user)}
                        >
                          <FileTextIcon className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View User</TooltipContent>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                          onClick={() => onDeleteUser(user._id)}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete User</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between p-4 border-t">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default UsersTable;
