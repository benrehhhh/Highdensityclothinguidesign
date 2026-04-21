import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF5E6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="mb-4 text-[#3B2C24]">Get In Touch</h1>
          <p className="text-lg text-[#3B2C24]/80">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="mb-6 text-[#3B2C24]">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#3B2C24] mb-2"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#3B2C24] mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-[#3B2C24] mb-2"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#3B2C24] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Your message..."
                  className="w-full px-3 py-2 border border-[#B7885E]/20 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#B7885E] bg-white text-[#3B2C24]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#B7885E] hover:bg-[#3B2C24] text-white"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="mb-6 text-[#3B2C24]">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF5E6] rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#B7885E]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#3B2C24] mb-1">Email</h3>
                    <p className="text-[#3B2C24]/80">hello@highdensity.com</p>
                    <p className="text-[#3B2C24]/80">support@highdensity.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF5E6] rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#B7885E]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#3B2C24] mb-1">Phone</h3>
                    <p className="text-[#3B2C24]/80">+63 917 123 4567</p>
                    <p className="text-sm text-[#3B2C24]/60">Mon-Fri, 9am-6pm PHT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF5E6] rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#B7885E]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#3B2C24] mb-1">Location</h3>
                    <p className="text-[#3B2C24]/80">Manila, Philippines</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="mb-4 text-[#3B2C24]">Business Hours</h3>
              <div className="space-y-2 text-sm text-[#3B2C24]/80">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
