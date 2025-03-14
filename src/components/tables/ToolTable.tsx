"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { databases } from "@/lib/appwrite";
import { Models } from "appwrite";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Alert from "@/components/ui/alert/Alert";
import { updateTool } from "@/lib/tools";

interface Tool extends Models.Document {
  $id: string;
  companies?: string[];
  name: string;
  serialNumber: string;
  toolVersion: string;
  localIpAddress?: string;
  tailScaleIpAddress?: string;
  status: "Active" | "In-Active";
}

export default function ToolTable() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Modals
  const editModal = useModal();
  const deleteModal = useModal();
  const detailsModal = useModal();

  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: "",
    serialNumber: "",
    toolVersion: "",
    localIpAddress: "",
    tailScaleIpAddress: "",
    status: "Active" as "Active" | "In-Active",
  });

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
          process.env.NEXT_PUBLIC_APPWRITE_TOOLS_COLLECTION_ID || ""
        );
        setTools(response.documents as Tool[]);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tools.");
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const handleMenuToggle = (toolId: string) => {
    setMenuOpen(menuOpen === toolId ? null : toolId);
  };

  const handleRowClick = (tool: Tool) => {
    setSelectedTool(tool);
    detailsModal.openModal();
  };

  const handleEditClick = (tool: Tool) => {
    setSelectedTool(tool);
    setEditForm({
      name: tool.name,
      serialNumber: tool.serialNumber,
      toolVersion: tool.toolVersion,
      localIpAddress: tool.localIpAddress || "",
      tailScaleIpAddress: tool.tailScaleIpAddress || "",
      status: tool.status,
    });
    setMenuOpen(null);
    editModal.openModal();
  };

  const handleDeleteClick = (tool: Tool) => {
    setSelectedTool(tool);
    setMenuOpen(null);
    deleteModal.openModal();
  };

  const handleEditSubmit = async () => {
    if (!selectedTool) return;
    setError(null);
    setSuccess(false);
    try {
      const updatedTool = await updateTool(selectedTool.$id, {
        name: editForm.name,
        serialNumber: editForm.serialNumber,
        toolVersion: editForm.toolVersion,
        localIpAddress: editForm.localIpAddress || null,
        tailScaleIpAddress: editForm.tailScaleIpAddress || null,
        status: editForm.status,
      });
      setTools(tools.map((t) => (t.$id === selectedTool.$id ? (updatedTool as Tool) : t)));
      setSuccess(true);
      setMessage("Tool Updated Successfully!")
      editModal.closeModal();
    } catch (err: any) {
      editModal.closeModal();
      setError(err.message || "Failed to update tool.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTool) return;
    setError(null);
    setSuccess(false);
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
        process.env.NEXT_PUBLIC_APPWRITE_TOOLS_COLLECTION_ID || "",
        selectedTool.$id
      );
      setTools(tools.filter((t) => t.$id !== selectedTool.$id));
      setSuccess(true);
      setMessage("Tool has been deleted!")
      deleteModal.closeModal();
    } catch (err: any) {
      setError(err.message || "Failed to delete tool.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>Loading tools...</div>;
  }

  if (error && !tools.length) {
    return <div className="text-error-500">{error}</div>;
  }

  return (
    <div className="relative">
      {/* Alerts */}
      {success && (
        <Alert
          variant="success"
          title="Operation Successful"
          message={message}
        />
      )}
      {error && (
        <Alert
          variant="error"
          title="Operation Failed"
          message={error}
        />
      )}
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px] sm:min-w-0">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Serial Number
                </TableCell>
                {/* Hide these headers on mobile */}
                <TableCell
                  isHeader
                  className=" px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tool Version
                </TableCell>
                <TableCell
                  isHeader
                  className=" px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Local IP
                </TableCell>
                <TableCell
                  isHeader
                  className=" px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  TailScale IP
                </TableCell>
                <TableCell
                  isHeader
                  className=" px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className=" px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tools.map((tool) => (
                <TableRow
                  key={tool.$id}
                  className="cursor-pointer sm:cursor-default"
                  onClick={() => window.innerWidth < 640 && handleRowClick(tool)}
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {tool.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {tool.serialNumber}
                  </TableCell>
                  {/* Hide these cells on mobile */}
                  <TableCell className=" px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {tool.toolVersion}
                  </TableCell>
                  <TableCell className=" px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {tool.localIpAddress || "N/A"}
                  </TableCell>
                  <TableCell className=" px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {tool.tailScaleIpAddress || "N/A"}
                  </TableCell>
                  <TableCell className=" px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={tool.status === "Active" ? "success" : "error"}
                    >
                      {tool.status}
                    </Badge>
                  </TableCell>
                  <TableCell className=" px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                    <button
                      onClick={() => handleMenuToggle(tool.$id)}
                      className="focus:outline-none"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    {menuOpen === tool.$id && (
                      <div className="shadow-theme-lg dark:bg-gray-dark absolute top-full right-0 z-40 w-40 space-y-1 rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800">
                        <button
                          onClick={() => handleEditClick(tool)}
                          className="text-theme-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tool)}
                          className="text-theme-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-red-500 dark:text-red-600 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Details Modal (Mobile) */}
      <Modal isOpen={detailsModal.isOpen} onClose={detailsModal.closeModal} className="max-w-[400px] m-4">
        <div className="relative w-full max-w-[400px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Tool Details
          </h4>
          {selectedTool && (
            <div className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <p className="font-medium">Name:</p>
                <p>{selectedTool.name}</p>
              </div>
              <div>
                <p className="font-medium">Serial Number:</p>
                <p>{selectedTool.serialNumber}</p>
              </div>
              <div>
                <p className="font-medium">Tool Version:</p>
                <p>{selectedTool.toolVersion}</p>
              </div>
              <div>
                <p className="font-medium">Local IP:</p>
                <p>{selectedTool.localIpAddress || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">TailScale IP:</p>
                <p>{selectedTool.tailScaleIpAddress || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <Badge
                  size="sm"
                  color={selectedTool.status === "Active" ? "success" : "error"}
                >
                  {selectedTool.status}
                </Badge>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 justify-end mt-6">
            <Button size="sm" onClick={() => { detailsModal.closeModal(); handleEditClick(selectedTool!); }}>
              Edit
            </Button>
            <Button size="sm" variant="danger" onClick={() => { detailsModal.closeModal(); handleDeleteClick(selectedTool!); }}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Tool
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update the tool details below.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="px-2 pb-3 space-y-6">
              <div>
                <Label>Tool Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Tool name"
                />
              </div>
              <div>
                <Label>Serial Number</Label>
                <Input
                  type="text"
                  name="serialNumber"
                  value={editForm.serialNumber}
                  onChange={handleInputChange}
                  placeholder="Serial number"
                />
              </div>
              <div>
                <Label>Tool Version</Label>
                <Input
                  type="text"
                  name="toolVersion"
                  value={editForm.toolVersion}
                  onChange={handleInputChange}
                  placeholder="Tool version"
                />
              </div>
              <div>
                <Label>Local IP Address</Label>
                <Input
                  type="text"
                  name="localIpAddress"
                  value={editForm.localIpAddress}
                  onChange={handleInputChange}
                  placeholder="192.168.1.1"
                />
              </div>
              <div>
                <Label>TailScale IP Address</Label>
                <Input
                  type="text"
                  name="tailScaleIpAddress"
                  value={editForm.tailScaleIpAddress}
                  onChange={handleInputChange}
                  placeholder="100.64.0.1"
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value as "Active" | "In-Active" })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                >
                  <option value="Active">Active</option>
                  <option value="In-Active">In-Active</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={editModal.closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleEditSubmit}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Delete Tool
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Are you sure you want to delete "{selectedTool?.name}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={deleteModal.closeModal}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </div>
  );
}