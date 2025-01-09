import { useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function ApiForm({
  onClose,
  isUpdate,
}: {
  onClose: () => void;
  isUpdate: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    endpoint: "",
    method: "",
    name: "",
    description: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.endpoint.startsWith("https://")) {
      toast.error("Please enter a valid endpoint");
      return;
    }
    if (
      !["GET", "POST", "PUT", "DELETE", "PATCH"].includes(
        formData.method.toUpperCase()
      )
    ) {
      toast.error("Please enter a valid method");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-api-doc`,
        {
          ...formData,
        }
      );
      toast.success("API data submitted successfully");
      onClose();
    } catch (error) {
      console.log("Error submitting API data:", error);
      toast.error("Error submitting API data");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">API Name</Label>
          <Input
            id="name"
            value={formData.name}
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method">Method</Label>
          <Input
            id="method"
            value={formData.method}
            required
            onChange={(e) =>
              setFormData({ ...formData, method: e.target.value })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="endpoint">Endpoint</Label>
        <Input
          id="endpoint"
          value={formData.endpoint}
          required
          onChange={(e) =>
            setFormData({ ...formData, endpoint: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Input
          id="description"
          value={formData.description}
          required
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          required
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="border border-gray-700/50 bg-gray-900/50 focus:outline-none text-gray-100 placeholder:text-gray-500 focus:ring-0"
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        disabled={isLoading}
        className="w-full  font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUpdate ? "Updating..." : "Submitting..."}
          </>
        ) : isUpdate ? (
          "Update"
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
}
