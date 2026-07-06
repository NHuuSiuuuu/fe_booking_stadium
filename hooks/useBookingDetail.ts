"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UseBookingDetailProps {
  initialReview: any;
  bookingId: number | string;
}

export default function useBookingDetail({
  initialReview,
  bookingId,
}: UseBookingDetailProps) {
  const router = useRouter();
  const [myReview, setMyReview] = useState<any>(initialReview);
  const [isCancelling, setIsCancelling] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleReviewCreate = async () => {
    if (!comment.trim()) {
      alert("Vui lòng nhập nhận xét");
      return;
    }

    const res = await fetch(`/api/reviews`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: bookingId,
        rating,
        comment,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      throw new Error(data.message);
    }

    toast.success("Đánh giá thành công!");
    setMyReview(data.review || { rating, comment });
    setIsEditing(false);
    setRating(3);
    setComment("");
    setReviewOpen(false);
    router.refresh();
  };

  const handleEditReview = () => {
    if (!myReview) return;
    setRating(myReview.rating || 3);
    setComment(myReview.comment || "");
    setIsEditing(true);
    setReviewOpen(true);
  };

  const handleReviewUpdate = async () => {
    if (!myReview?.id) return;
    try {
      const res = await fetch(`/api/reviews/${myReview.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Cập nhật đánh giá thất bại");
        throw new Error(data.message);
      }

      toast.success("Cập nhật đánh giá thành công!");
      setMyReview(data.review || { ...myReview, rating, comment });
      setIsEditing(false);
      setReviewOpen(false);
      setRating(3);
      setComment("");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật đánh giá thất bại");
    }
  };

  const handleDeleteReview = async () => {
    if (!myReview?.id) return;

    try {
      const res = await fetch(`/api/reviews/${myReview.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Xóa đánh giá thất bại");
        return;
      }

      toast.success("Xóa đánh giá thành công");
      setMyReview(null);
      setRating(3);
      setComment("");
      setConfirmDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Xóa đánh giá thất bại");
      setConfirmDeleteOpen(false);
    }
  };

  const handleCancel = async () => {
    if (isCancelling) return;
    setIsCancelling(true);

    try {
      const res = await fetch(`/api/booking/cancel/${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Hủy đơn thất bại");
      }
      
      toast.success("Hủy đơn thành công");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Không thể hủy đơn. Vui lòng thử lại.");
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    myReview,
    isCancelling,
    reviewOpen,
    setReviewOpen,
    rating,
    setRating,
    comment,
    setComment,
    isEditing,
    setIsEditing,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    handleReviewCreate,
    handleEditReview,
    handleReviewUpdate,
    handleDeleteReview,
    handleCancel,
  };
}
