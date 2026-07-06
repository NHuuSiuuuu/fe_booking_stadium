import { Star, X } from "lucide-react";

export default function ReviewDialog({
  reviewOpen,
  setReviewOpen,
  setRating,
  setComment,  
  comment,
  rating,
  setIsEditing,
  isEditing,
  handleReviewUpdate,
  handleReviewCreate,
}) {
  return (
    <div
      className={`fixed   
               inset-0 z-50 flex items-center transition-opacity duration-300 justify-center px-4 ${
                 reviewOpen
                   ? "pointer-events-auto opacity-100 "
                   : "pointer-events-none opacity-0 "
               }`}
    >
      {/* Overlay */}
      <div
        onClick={() => setReviewOpen(false)}
        className="absolute inset-0 bg-black/50"
      />

      {/* Dialog */}
      <div className={`relative w-full max-w-md bg-white `}>
        <div className="flex items-center justify-between px-5 py-3 bg-black">
          <p className="text-sm font-medium  text-white uppercase">
            Đánh giá trải nghiệm
          </p>
          <button
            onClick={() => setReviewOpen(false)}
            className="text-white transition-opacity hover:opacity-70"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="mt-4">
            {Array.from({ length: 5 }).map((_, index) => {
              const ratingValue = index + 1;
              const isActive = ratingValue <= rating;
              return (
                <button onClick={() => setRating(ratingValue)} key={index}>
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                      isActive
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200 fill-transparent"
                    }`}
                  />
                </button>
              );
            })}
            <div>
              <span className="text-sm font-medium text-gray-500">
                {rating === 1 && "Tệ"}
                {rating === 2 && "Kém"}
                {rating === 3 && "Bình thường"}
                {rating === 4 && "Tốt"}
                {rating === 5 && "Tuyệt vời"}
              </span>
            </div>
            <label className="block mb-2 text-sm  text-gray-400 uppercase">
              Nhận xét
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sân này..."
              className="w-full p-3 text-sm text-black placeholder-gray-400 border border-gray-200 resize-none focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => {
                setReviewOpen(false);
                setIsEditing(false);
              }}
              className="flex-1 py-3 text-sm font-medium  text-black uppercase transition-all border-2 border-black hover:bg-black hover:text-white"
            >
              Huỷ
            </button>
            <button
              onClick={isEditing ? handleReviewUpdate : handleReviewCreate}
              // disabled={submitting}
              className={`flex-1 py-3 text-sm font-medium  uppercase transition-colors 
                         
                          bg-black text-white hover:bg-gray-800
                        }`}
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
