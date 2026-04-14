import { Shirt } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-[#FFF5E6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#B7885E] rounded-lg flex items-center justify-center">
              <Shirt className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-[#3B2C24]">About High Density Clothing</h1>
          <p className="text-lg text-[#3B2C24]/80">
            Handcrafted clothing made with love and attention to detail
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="mb-4 text-[#3B2C24]">Our Story</h2>
          <p className="text-[#3B2C24]/80 mb-4">
            High Density Clothing was founded with a simple mission: to create beautiful, high-quality clothing that tells a story. Each piece in our collection is carefully crafted with attention to detail and a commitment to sustainability.
          </p>
          <p className="text-[#3B2C24]/80 mb-4">
            We believe that clothing should be more than just fabric - it should be an expression of individuality, a celebration of craftsmanship, and a step towards a more sustainable future.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="mb-2 text-[#3B2C24]">Quality</h3>
            <p className="text-sm text-[#3B2C24]/80">
              Every piece is made with premium materials and exceptional craftsmanship
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="mb-2 text-[#3B2C24]">Sustainability</h3>
            <p className="text-sm text-[#3B2C24]/80">
              We're committed to ethical production and environmental responsibility
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="mb-2 text-[#3B2C24]">Community</h3>
            <p className="text-sm text-[#3B2C24]/80">
              Supporting local artisans and building meaningful connections
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="mb-4 text-[#3B2C24]">Made in the Philippines</h2>
          <p className="text-[#3B2C24]/80">
            Based in Manila, Philippines, we work with local artisans and craftspeople to bring you clothing that combines traditional techniques with modern design. Each purchase supports our local community and helps preserve traditional craftsmanship.
          </p>
        </div>
      </div>
    </div>
  );
}
