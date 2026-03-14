'use client';

import { useMemo } from 'react';
import { Template } from '@prisma/client';
import TemplateCard from './TemplateCard';
import { motion } from 'framer-motion';

interface TemplateGalleryProps {
  templates: Template[];
}

export default function TemplateGallery({ templates }: TemplateGalleryProps) {
  // Group by category
  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, Template[]> = {};
    templates.forEach((template) => {
      if (!grouped[template.category]) {
        grouped[template.category] = [];
      }
      grouped[template.category].push(template);
    });
    return grouped;
  }, [templates]);

  const categoryNames: Record<string, string> = {
    birthday: 'Birthday',
    anniversary: 'Anniversary',
    graduation: 'Graduation',
    thankYou: 'Thank You',
    congratulations: 'Congratulations',
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500 text-lg mb-2">No templates match your filters.</p>
        <p className="text-stone-400 text-sm">Try a different category or price tier.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Templates Grid */}
      <div>
        {Object.entries(groupedByCategory).map(([category, categoryTemplates]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">
              {categoryNames[category] || category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TemplateCard template={template} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
