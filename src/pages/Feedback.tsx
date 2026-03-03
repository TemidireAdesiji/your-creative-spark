import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const TEAL = "#1DA39A";
const DARK = "#0E0E0E";

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
          fill={star <= rating ? TEAL : "none"}
          stroke={star <= rating ? TEAL : "#C4C4C4"}
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
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${DARK} 0%, #0a2e2b 50%, ${TEAL} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.97)",
          borderRadius: 16,
          padding: "36px 32px",
          boxShadow: `0 8px 40px rgba(0,0,0,0.25), 0 0 60px ${TEAL}22`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <img
            src="/images/app-logo.png"
            alt="Motion.ly"
            style={{ width: 48, height: 48, borderRadius: 12, margin: "0 auto 12px" }}
          />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: DARK, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>
            Share Your Feedback
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#666", margin: 0, fontFamily: "'Poppins', sans-serif" }}>
            Help us improve your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: DARK, display: "block", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
              Your Name
            </label>
            <input
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={100}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1.5px solid #e0e0e0",
                fontSize: "0.95rem",
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = TEAL)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: DARK, display: "block", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
              Rating
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: DARK, display: "block", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
              Comments (optional)
            </label>
            <textarea
              placeholder="Tell us what you think…"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              maxLength={1000}
              rows={4}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1.5px solid #e0e0e0",
                fontSize: "0.95rem",
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = TEAL)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                background: TEAL,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                fontFamily: "'Poppins', sans-serif",
                transition: "opacity 0.2s",
              }}
            >
              {submitting ? "Submitting…" : "Submit Feedback"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: `1.5px solid ${TEAL}`,
                color: TEAL,
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "12px 24px",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.2s",
              }}
            >
              Back
            </button>
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: "0.8rem", color: "#999", fontFamily: "'Poppins', sans-serif" }}>
          <a href="mailto:admin@motionlyai.com" style={{ color: TEAL, textDecoration: "none" }}>
            admin@motionlyai.com
          </a>
        </div>
      </div>
    </div>
  );
}
