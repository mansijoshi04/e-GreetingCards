'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Template } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import CustomizationPanel from '@/components/editor/CustomizationPanel';
import PreviewPane from '@/components/editor/PreviewPane';
import PreviewModal from '@/components/editor/PreviewModal';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface EditorPageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export default function EditorPage({ params: paramsPromise }: EditorPageProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [customText, setCustomText] = useState<Record<string, string>>({
    recipientName: '',
    headline: '',
    body: '',
    signature: '',
  });
  const [customStyling, setCustomStyling] = useState<Record<string, any>>({
    fontSize: 20,
    textColor: '#333333',
    backgroundTheme: 0,
  });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch template on mount
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/templates/${params.templateId}`);

        if (!response.ok) {
          router.push('/create');
          return;
        }

        const data: Template = await response.json();
        setTemplate(data);

        // Initialize with defaults from template
        let designConfig = {};
        try {
          designConfig = JSON.parse(data.designConfig as string);
        } catch (e) {
          console.error('Failed to parse designConfig:', e);
        }

        const defaultText: Record<string, string> = {};

        if ((designConfig as any).elements && Array.isArray((designConfig as any).elements)) {
          (designConfig as any).elements.forEach((element: any) => {
            if (element.editable && element.id) {
              defaultText[element.id] = element.defaultText || '';
            }
          });
        }

        setCustomText({
          recipientName: '',
          headline: defaultText.headline || '',
          body: defaultText.body || '',
          signature: defaultText.signature || '',
        });
      } catch (error) {
        console.error('Error fetching template:', error);
        router.push('/create');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [params.templateId, router]);

  // Validate all fields are filled
  const isValid = customText.headline && customText.body && customText.signature;

  const handleNext = () => {
    if (!isValid) {
      alert('Please fill in headline, message, and signature');
      return;
    }
    // Open preview modal before proceeding
    setShowPreview(true);
  };

  const handleConfirmPreview = () => {
    setSaving(true);
    setTimeout(() => {
      sessionStorage.setItem(
        'cardDraft',
        JSON.stringify({
          templateId: params.templateId,
          customText,
          customStyling,
        })
      );
      router.push('/recipients');
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-rose-400 mb-4 mx-auto" />
          <p className="text-stone-600 font-medium">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 font-medium mb-4">Template not found</p>
          <Link href="/create" className="text-rose-500 hover:text-rose-600 font-semibold">
            ← Back to templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/create" className="text-stone-500 hover:text-stone-700 text-sm font-medium">
              ← Back
            </Link>
            <h1 className="text-2xl font-serif font-bold text-stone-900 mt-2">
              Customize Card
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!isValid || saving}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              isValid && !saving
                ? 'bg-stone-900 text-white hover:bg-stone-800 cursor-pointer'
                : 'bg-stone-200 text-stone-500 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving...' : 'Next: Recipients →'}
          </motion.button>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr] gap-8 h-[calc(100vh-180px)]">
          {/* Left: Customization Panel (Fixed width sidebar) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:overflow-y-auto lg:pr-4"
          >
            <div className="bg-white rounded-[2rem] border border-stone-200 p-8">
              <CustomizationPanel
                template={template}
                customText={customText}
                setCustomText={setCustomText}
                customStyling={customStyling}
                setCustomStyling={setCustomStyling}
              />

              {/* Action Button (Mobile) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!isValid || saving}
                className={`w-full mt-8 py-3 rounded-2xl font-semibold transition-all lg:hidden ${
                  isValid && !saving
                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                    : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                }`}
              >
                {saving ? 'Saving...' : 'Next: Recipients'}
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center"
          >
            <PreviewPane
              template={template}
              customText={customText}
              customStyling={customStyling}
            />
          </motion.div>
        </div>
      </div>

      {/* Animation Preview Modal */}
      {template && (() => {
        let designConfig: any = {};
        try { designConfig = JSON.parse(template.designConfig as string); } catch {}
        return (
          <PreviewModal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            onConfirm={handleConfirmPreview}
            design={designConfig}
            customText={customText}
            customStyling={customStyling}
          />
        );
      })()}
    </main>
  );
}
