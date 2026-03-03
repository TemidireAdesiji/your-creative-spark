import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const StarRating = ({ rating, setRating }: { rating: number; setRating: (r: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className="transition-transform hover:scale-110 focus:outline-none"
        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#C89A2E" : "none"}
          stroke={star <= rating ? "#C89A2E" : "#C4C4C4"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </button>
    ))}
  </div>
);

export default function Feedback() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      user_name: userName.trim().slice(0, 100),
      rating,
      comments: comments.trim().slice(0, 1000) || null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error(error);
      return;
    }

    toast.success("Thank you for your feedback!");
    setUserName("");
    setRating(0);
    setComments("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Share Your Feedback</CardTitle>
          <CardDescription>Help us improve your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments (optional)</Label>
              <Textarea
                id="comments"
                placeholder="Tell us what you think…"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                maxLength={1000}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? "Submitting…" : "Submit Feedback"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/")}>
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
