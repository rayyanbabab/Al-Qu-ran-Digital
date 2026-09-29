'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, Check, X } from 'lucide-react';

export const Modal = ({
  content = '',
  innerHTML = false,
  modalOpen = false,
  closeModal,
  modalHeader,
}) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  // Format paragraphs
  const formattedText = typeof content === 'string'
    ? content.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')
    : '';

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-base-100 rounded-2xl border border-base-300 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-base-300 bg-base-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-base-content">
                  Tafsir Lengkap Kemenag
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  Resmi
                </span>
              </div>
              <div className="text-xs text-base-content/60">
                {modalHeader}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              type="button"
              className="p-2 rounded-lg text-xs font-medium border border-base-300 hover:bg-base-200 text-base-content/70 hover:text-base-content flex items-center gap-1 transition-colors"
              title="Salin isi tafsir"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline text-primary">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salin</span>
                </>
              )}
            </button>

            <button
              onClick={closeModal}
              type="button"
              className="p-2 rounded-lg text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
              aria-label="Tutup modal tafsir"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 text-sm leading-relaxed text-base-content/85">
          {innerHTML ? (
            <div
              className="space-y-4 font-normal text-justify"
              dangerouslySetInnerHTML={{
                __html: formattedText,
              }}
            />
          ) : (
            <p className="whitespace-pre-line text-justify">{content}</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 px-5 border-t border-base-300 bg-base-200/30 flex items-center justify-between text-xs text-base-content/50">
          <span>Sumber: Kementerian Agama Republik Indonesia</span>
          <button
            onClick={closeModal}
            className="px-3.5 py-1.5 rounded-lg bg-base-300 hover:bg-base-content/10 text-base-content font-medium text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};