import React, { useState } from "react";
import {
  Star,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  Plus,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    author: "Ananya Deshmukh",
    city: "Mumbai, Worli",
    rating: 5,
    date: "November 18, 2026",
    verified: true,
    title: "Exquisite craftsmanship and flawless bouclé texture",
    comment:
      "The chair is even more breathtaking in person. The solid walnut base gives it exceptional weight and presence, while the ivory bouclé fabric is soft yet durable. Delivery was white-glove and the technicians positioned it exactly as requested.",
    likes: 12,
  },
  {
    id: "rev-2",
    author: "Kavita Singhal",
    city: "Delhi, Vasant Vihar",
    rating: 5,
    date: "November 10, 2026",
    verified: true,
    title: "Worth every rupee for modern sanctuaries",
    comment:
      "We purchased two chairs along with the turnkey assembly service. The installer arrived right on time with protective shoe covers and assembled them silently within 40 minutes. Highly recommended atelier quality.",
    likes: 8,
  },
  {
    id: "rev-3",
    author: "Rohan Varma",
    city: "Bengaluru, Indiranagar",
    rating: 4,
    date: "October 29, 2026",
    verified: true,
    title: "Stunning architectural silhouette",
    comment:
      "Ergonomics are great for reading sanctuaries. The finish on the wood joints is seamless. Lead time was around 8 days which is very reasonable for handcrafted bespoke pieces.",
    likes: 5,
  },
];

const ProductReviews = ({ productName = "Blanco Lounge Chair" }) => {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Review Form State
  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [submittedToast, setSubmittedToast] = useState(false);

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formTitle || !formComment) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: formName,
      city: formCity || "India",
      rating: Number(formRating),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      verified: true,
      title: formTitle,
      comment: formComment,
      likes: 0,
    };

    setReviews([newRev, ...reviews]);
    setModalOpen(false);
    setFormName("");
    setFormCity("");
    setFormTitle("");
    setFormComment("");
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  const filteredReviews =
    selectedFilter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === Number(selectedFilter));

  return (
    <section className="bg-stone-50 rounded-3xl p-6 sm:p-12 border border-stone-200 space-y-8 mt-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/80 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Reviews & Architectural Feedback
          </h2>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {submittedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Thank you! Your verified client review has been published.</span>
        </div>
      )}

      {/* Ratings Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs">
        <div className="md:col-span-4 text-center md:border-r border-stone-200 md:pr-6 space-y-1">
          <div className="font-serif text-5xl font-bold text-stone-900">{averageRating}</div>
          <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(Number(averageRating))
                    ? "fill-amber-500 text-amber-500"
                    : "text-stone-300"
                  }`}
              />
            ))}
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Based on {reviews.length} verified client purchases
          </p>
        </div>

        <div className="md:col-span-8 flex flex-wrap gap-2 items-center justify-center md:justify-start">
          <span className="text-xs font-semibold text-stone-700 mr-2">Filter Reviews:</span>
          {["all", "5", "4", "3"].map((val) => (
            <button
              key={val}
              onClick={() => setSelectedFilter(val)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedFilter === val
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200"
                }`}
            >
              {val === "all" ? "All Ratings" : `${val} Stars`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-6 border border-stone-200 space-y-3 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-100 font-serif font-bold text-xs text-stone-800 flex items-center justify-center">
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <span>{rev.author}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Verified Buyer
                      </span>
                    )}
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">{rev.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-500 text-amber-500" : "text-stone-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-stone-400 font-mono">{rev.date}</span>
              </div>
            </div>

            <h5 className="font-serif font-bold text-sm text-stone-900">{rev.title}</h5>

            <p className="text-xs text-stone-600 leading-relaxed font-light">{rev.comment}</p>
          </div>
        ))}
      </div>

      {/* ================= WRITE A REVIEW MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold block">
                  CLIENT TESTIMONIAL
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Review {productName}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= formRating
                            ? "fill-amber-500 text-amber-500"
                            : "text-stone-300"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                    placeholder="e.g. Mumbai, Bandra"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Review Headline *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Detailed Review & Feedback *
                </label>
                <textarea
                  rows="3"
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                  placeholder="Share details on texture, wood finish, comfort, installation..."
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold shadow-xs"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
