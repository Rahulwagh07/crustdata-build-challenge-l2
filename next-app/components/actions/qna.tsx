import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export function QnAForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [qnaData, setQnaData] = useState({
    question: "",
    tags: "",
    source: "",
    content: "",
  });
  const [tagsList, setTagsList] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      setQnaData({ question: "", tags: "", source: "", content: "" });
      setTagsList([]);
    };
  }, []);

  const handleTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQnaData({ ...qnaData, tags: e.target.value });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && qnaData.tags.trim() !== "") {
      const newTag = qnaData.tags.trim();
      if (!tagsList.includes(newTag)) {
        setTagsList([...tagsList, newTag]);
      }
      setQnaData({ ...qnaData, tags: "" });
      e.preventDefault();  
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(tagsList.length === 0) {
      toast.error("Please add at least one tag")
      return
    }
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/knowledge/add`, {
        content: qnaData.content,
        source: qnaData.source,
        metadata: {
          tags: tagsList,
          question: qnaData.question,
        },
      });
      toast.success("Q&A added successfully")
      onClose();
    } catch (error) {
      console.log("Error submitting Q&A data:", error);
      toast.error("Error submitting Q&A data")
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={qnaData.question}
          required
          onChange={(e) => setQnaData({ ...qnaData, question: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tagsList.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-gray-700/50 text-gray-100 text-sm"
            >
              {tag}
            </span>
          ))}
          <Input
            id="tags"
            value={qnaData.tags}
            onChange={handleTagsInputChange}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          value={qnaData.source}
          required
          onChange={(e) => setQnaData({ ...qnaData, source: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="qna-content">Content</Label>
        <Textarea
          id="qna-content"
          value={qnaData.content}
          required
          onChange={(e) => setQnaData({ ...qnaData, content: e.target.value })}
          className="border border-gray-700/50 bg-gray-900/50 focus:outline-none text-gray-100 placeholder:text-gray-500 focus:ring-0"
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        disabled={isLoading}
        className="w-full font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
}
