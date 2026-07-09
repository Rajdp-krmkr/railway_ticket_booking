import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    console.log('[CONTACT FORM] Submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Contact Customer Care</h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Need support with a reservation, refund request, or PNR tracking details? Reach out to our 24/7 help desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Phone numbers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <Phone className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">Helpline Support</h4>
              <p className="text-xs text-slate-500 font-medium">Passenger Support: +1 (800) 555-RAIL</p>
              <p className="text-xs text-slate-500 font-medium">Refund Desk: +1 (800) 555-RFND</p>
            </div>
          </div>

          {/* Card: Email */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <Mail className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">Email Inquiries</h4>
              <p className="text-xs text-slate-500 font-medium">support@swiftrail.com</p>
              <p className="text-xs text-slate-500 font-medium">refunds@swiftrail.com</p>
            </div>
          </div>

          {/* Card: Location */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
              <MapPin className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">Corporate Office</h4>
              <p className="text-xs text-slate-500 font-medium">SwiftRail Terminal, Suite 305</p>
              <p className="text-xs text-slate-500 font-medium">Grand Station Plaza, NY 10001</p>
            </div>
          </div>

        </div>

        {/* Contact Form Card */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            {submitted ? (
              /* Success message block */
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Send className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">Inquiry Sent Successfully</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Thank you for contacting SwiftRail. A customer care representative will respond to your registered email within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <h3 className="text-lg font-bold text-slate-900">Send an Online Inquiry</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Your Name</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Passenger"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                      required
                    />
                  </div>
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="passenger@railway.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Subject Topic</label>
                  <input 
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Booking Refund Request"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Detailed Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Describe your inquiry or reservation details..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 resize-none"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
