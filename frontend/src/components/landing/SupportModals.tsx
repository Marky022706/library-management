import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { Clock, Phone, Mail, ChevronDown } from 'lucide-react';

export type SupportModalType = 'how-to-access' | 'faqs' | 'contact' | 'help' | 'privacy' | 'terms' | null;

interface SupportModalsProps {
  activeModal: SupportModalType;
  onClose: () => void;
}

export function SupportModals({ activeModal, onClose }: SupportModalsProps) {
  const { showToast } = useToast();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) {
      showToast('Please fill out all fields.', 'error');
      return;
    }
    showToast('Your message has been sent to the library desk!', 'success');
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    onClose();
  };

  const FAQS = [
    {
      q: 'Who is eligible to register for a library account?',
      a: 'All residents, students, researchers, and educators in Balingasag and surrounding municipalities are eligible. Student applicants are requested to provide their School ID or proof of enrollment.',
    },
    {
      q: 'How many books can I borrow concurrently and for how long?',
      a: 'Active registered members can borrow up to 5 books at a time. Standard loan duration is 7 days, renewable online up to 2 consecutive times if there are no pending reservations from other patrons.',
    },
    {
      q: 'What is the overdue fine policy?',
      a: 'Overdue loans incur a fee of PHP 5.00 per calendar day per book. You can settle fines at the main circulation counter.',
    },
    {
      q: 'How does the Digital QR Library Card work?',
      a: 'Once your registration is approved by the library admin, a unique QR code is generated in your Member Portal. You can use it on your phone or print it out to scan at the entrance kiosk for attendance and book checkout.',
    },
    {
      q: 'What are the library operating hours?',
      a: 'The Balingasag Public Library is open Monday through Saturday from 8:00 AM to 5:00 PM, excluding declared public holidays.',
    },
  ];

  return (
    <>
      {/* 1. How to Access Modal */}
      <Modal open={activeModal === 'how-to-access'} onClose={onClose} title="How to Access Library Services">
        <div className="space-y-4 text-sm text-slate-600">
          <p className="text-slate-700">
            Getting started with the Balingasag Public Library Portal is quick and straightforward:
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                1
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">Create an Account</h4>
                <p className="mt-0.5 text-xs text-slate-600">
                  Register online with your basic details and student/resident identification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                2
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">Admin Approval & Digital Library Card</h4>
                <p className="mt-0.5 text-xs text-slate-600">
                  Library staff will review your submission and automatically issue your Digital QR Card.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                3
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">Browse & Borrow</h4>
                <p className="mt-0.5 text-xs text-slate-600">
                  Explore our extensive catalog, submit online borrow requests, or place reservation holds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                4
              </span>
              <div>
                <h4 className="font-semibold text-slate-900">Attendance & Kiosk Scan</h4>
                <p className="mt-0.5 text-xs text-slate-600">
                  Scan your QR code at the physical library entrance kiosk for automatic time-in and time-out.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Got it</Button>
          </div>
        </div>
      </Modal>

      {/* 2. FAQs Modal */}
      <Modal open={activeModal === 'faqs'} onClose={onClose} title="Frequently Asked Questions">
        <div className="space-y-3 text-sm">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rounded-lg border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-3.5 text-left font-semibold text-slate-800 hover:text-emerald-700"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 p-3.5 pt-2 text-xs leading-relaxed text-slate-600 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Close FAQs</Button>
          </div>
        </div>
      </Modal>

      {/* 3. Contact Us Modal */}
      <Modal open={activeModal === 'contact'} onClose={onClose} title="Contact Library Support Desk">
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>(088) 333-2190</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>library@balingasag.gov.ph</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Mon-Sat, 8am-5pm</span>
            </div>
          </div>

          <form onSubmit={handleSendContact} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. maria@gmail.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message or Inquiries</label>
              <textarea
                required
                rows={3}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="How can we assist you with book borrowing, reservations, or research?"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* 4. Help Center Modal */}
      <Modal open={activeModal === 'help'} onClose={onClose} title="Library Help Center">
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800 text-sm">Welcome to the Balingasag Public Library Help & Knowledge Base.</p>
          <p>
            Here you can find guidelines on library facilities, catalog searching, digital library cards, and borrowing rules.
          </p>

          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 space-y-2">
            <h5 className="font-bold text-slate-900">Key Assistance Topics:</h5>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Lost Card:</strong> Report to the library desk to regenerate your QR token immediately.</li>
              <li><strong>Book Reservations:</strong> Held items remain ready for pickup for up to 3 business days.</li>
              <li><strong>Research Assistance:</strong> Contact the head librarian for archival and local history references.</li>
            </ul>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>Close Help</Button>
          </div>
        </div>
      </Modal>

      {/* 5. Privacy Policy Modal */}
      <Modal open={activeModal === 'privacy'} onClose={onClose} title="Privacy Policy">
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-96 overflow-y-auto pr-1">
          <p className="font-bold text-slate-900 text-sm">Data Privacy Commitment</p>
          <p>
            The Balingasag Municipal Public Library is committed to protecting your privacy in compliance with Republic Act 10173 (Data Privacy Act of 2012).
          </p>
          <p>
            We collect personal information (name, contact number, student ID, and affiliation) strictly for issuing library credentials, tracking circulation, and maintaining attendance logs. Your records are never shared with third parties without authorized consent.
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>I Understand</Button>
          </div>
        </div>
      </Modal>

      {/* 6. Terms of Use Modal */}
      <Modal open={activeModal === 'terms'} onClose={onClose} title="Terms of Use">
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-96 overflow-y-auto pr-1">
          <p className="font-bold text-slate-900 text-sm">Library Patron Agreement</p>
          <p>
            By utilizing the Balingasag Public Library portal and physical facilities, members agree to:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Handle borrowed materials with care and return them on or before the designated due date.</li>
            <li>Use assigned digital library cards solely for personal patron access.</li>
            <li>Maintain quiet and respect fellow patrons within library premises.</li>
          </ul>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>Accept Terms</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
