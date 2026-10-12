import React, { useState } from 'react';
import { Sparkles, Image, CheckSquare, Zap, ArrowRight, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      icon: Image,
      title: 'Snap or Share Any Screenshot',
      description:
        'Flights, electricity bills, parcel tracking, event invitations, or Slack tasks. Just drop the image in.',
      gradient: 'from-blue-600 to-indigo-600',
      badge: 'Multimodal Vision',
    },
    {
      icon: Sparkles,
      title: 'AI Extracts Important Entities',
      description:
        'Instant OCR identifies flight numbers, check-in deadlines, due dates, tracking IDs, and addresses with high precision.',
      gradient: 'from-indigo-600 to-cyan-500',
      badge: 'Zero Friction',
    },
    {
      icon: Zap,
      title: 'Execute in One Tap',
      description:
        'Add to your calendar, schedule payment reminders, track packages, or launch map navigation without typing.',
      gradient: 'from-emerald-600 to-teal-500',
      badge: 'Instant Output',
    },
  ];

  const slide = slides[currentStep];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-[#0A0A0A] border border-[#222] rounded-3xl p-6 shadow-2xl space-y-6 text-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#888] hover:text-white hover:bg-[#1A1A1A]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111] border border-[#262626] text-xs font-semibold text-[#888]">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{slide.badge}</span>
        </div>

        {/* Big Step Icon */}
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20"
          >
            <slide.icon className="w-10 h-10" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-lg font-light text-[#EDEDED] tracking-tight">
            {slide.title}
          </h2>
          <p className="text-xs text-[#888] leading-relaxed max-w-xs mx-auto">
            {slide.description}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center space-x-2 pt-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === idx ? 'w-6 bg-blue-500' : 'w-1.5 bg-[#262626]'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <span>{currentStep === slides.length - 1 ? "Let's Get Started" : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
