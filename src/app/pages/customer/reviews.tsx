import { useState } from 'react';
import { Star, Upload, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

const customerReviews = [
  {
    id: 1,
    productName: 'Handcrafted Cotton Shirt',
    userName: 'Juan Dela Cruz',
    rating: 5,
    date: 'March 15, 2024',
    comment: 'Absolutely love this shirt! The quality is outstanding and it fits perfectly. The fabric is so soft and comfortable. Highly recommend!',
    verified: true
  },
  {
    id: 2,
    productName: 'Linen Casual Polo',
    userName: 'Maria Santos',
    rating: 5,
    date: 'March 12, 2024',
    comment: 'Beautiful craftsmanship! You can tell this was made with care. The linen is breathable and perfect for our tropical weather.',
    verified: true
  },
  {
    id: 3,
    productName: 'Premium Cotton Jacket',
    userName: 'Ana Reyes',
    rating: 4,
    date: 'March 10, 2024',
    comment: 'Great quality jacket. The fit is nice and the material feels premium. Only wish it came in more colors!',
    verified: true
  }
];

export function Reviews() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!review.trim()) {
      toast.error('Please write a review');
      return;
    }
    toast.success('Review submitted successfully!');
    setRating(0);
    setReview('');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2">Product Reviews</h1>
          <p className="text-[#8B7355]">Share your experience with our products</p>
        </div>

        {/* Write a Review */}
        <Card className="border-[#B7885E]/20 shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-[#3B2C24]">Write a Review</CardTitle>
            <CardDescription className="text-[#8B7355]">
              Share your thoughts about your recent purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Your Rating *</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-[#DDB67D] text-[#DDB67D]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-[#8B7355]">
                    {rating === 5 && 'Excellent!'}
                    {rating === 4 && 'Very Good'}
                    {rating === 3 && 'Good'}
                    {rating === 2 && 'Fair'}
                    {rating === 1 && 'Poor'}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Your Review *</Label>
                <Textarea
                  placeholder="Tell us about your experience with this product..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="border-[#B7885E]/20 resize-none min-h-[120px]"
                  required
                />
                <p className="text-xs text-[#8B7355]">{review.length} / 500 characters</p>
              </div>

              {/* Upload Photo */}
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Add Photos (Optional)</Label>
                <div className="border-2 border-dashed border-[#B7885E]/20 rounded-lg p-6 text-center hover:border-[#B7885E]/40 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-[#B7885E] mx-auto mb-2" />
                  <p className="text-sm text-[#8B7355] mb-1">Click to upload photos</p>
                  <p className="text-xs text-[#8B7355]">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Previous Reviews */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#3B2C24] mb-4">Your Previous Reviews</h2>
          <p className="text-[#8B7355]">{customerReviews.length} review{customerReviews.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-6">
          {customerReviews.map((review) => (
            <Card key={review.id} className="border-[#B7885E]/20 shadow-lg bg-white">
              <CardContent className="pt-6">
                {/* Product Name */}
                <div className="mb-4">
                  <h3 className="font-semibold text-[#3B2C24] mb-1">{review.productName}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-[#DDB67D] text-[#DDB67D]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <Badge variant="outline" className="border-green-500 text-green-600 text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-[#3B2C24] leading-relaxed mb-3">{review.comment}</p>

                {/* Review Meta */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B7355]">{review.date}</span>
                  <Button variant="ghost" size="sm" className="text-[#B7885E] hover:text-[#9d7350] hover:bg-[#FFF5E6]">
                    Edit Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
