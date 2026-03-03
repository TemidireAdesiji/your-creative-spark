import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
          fill={star <= rating ? "hsl(var(--primary))" : "none"}
          stroke={star <= rating ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-poppins">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md glass-strong rounded-2xl p-8">
        <div className="text-center mb-6">
          <img
            src="/images/app-logo.png"
            alt="Motion.ly"
            className="w-12 h-12 rounded-xl mx-auto mb-3 pulse-glow"
          />
          <h1 className="text-xl font-bold text-foreground mb-1">
            Share Your Feedback
          </h1>
          <p className="text-sm text-muted-foreground">
            Help us improve your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">
              Your Name
            </label>
            <input
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={100}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">
              Rating
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">
              Comments (optional)
            </label>
            <textarea
              placeholder="Tell us what you think..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              maxLength={1000}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-y"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
              style={{ boxShadow: "var(--shadow-cta)" }}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-lg glass border border-primary/30 text-primary font-semibold text-sm bg-transparent cursor-pointer hover:bg-secondary transition-colors"
            >
              Back
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <a href="mailto:admin@motionlyai.com" className="text-xs text-primary no-underline hover:underline">
            admin@motionlyai.com
          </a>
        </div>
      </div>
    </div>
  );
}
