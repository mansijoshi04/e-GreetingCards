'use client';

import { motion } from 'framer-motion';

interface CardContentProps {
  content: Record<string, string>;
  design: any;
}

export default function CardContent({ content, design }: CardContentProps) {
  const elements = design.elements || [];
  const layout = design.layout || {};

  // Build background style
  const backgroundStyle: React.CSSProperties = {};

  if (layout.backgroundType === 'gradient' && layout.backgroundValue) {
    const [color1, color2] = layout.backgroundValue;
    backgroundStyle.background = `linear-gradient(to bottom right, ${color1}, ${color2})`;
  } else if (layout.backgroundType === 'solid' && layout.backgroundValue) {
    backgroundStyle.backgroundColor = layout.backgroundValue[0];
  }

  return (
    <div
      className="relative w-full h-full min-h-[600px] rounded-lg overflow-hidden"
      style={backgroundStyle}
    >
      {/* Render each element from design config */}
      {elements.map((element: any) => {
        if (element.type === 'text') {
          return (
            <TextElement
              key={element.id}
              element={element}
              content={content[element.id] || element.defaultText}
            />
          );
        }

        if (element.type === 'image') {
          return (
            <ImageElement
              key={element.id}
              element={element}
            />
          );
        }

        if (element.type === 'lottie') {
          return (
            <LottieElement
              key={element.id}
              element={element}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

/**
 * Render text elements with animations
 */
function TextElement({ element, content }: any) {
  const style = element.style || {};
  const animation = element.animations?.entrance || {};
  const position = element.position || {};

  // Build position styles
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    ...Object.fromEntries(
      Object.entries(position)
        .filter(([key]) => ['top', 'bottom', 'left', 'right'].includes(key))
        .map(([key, value]) => [key, value])
    ),
  };

  // Handle centered positioning
  if (position.left === '50%') {
    positionStyle.transform = 'translateX(-50%)';
  }

  const animationVariants = {
    hidden: {
      opacity: 0,
      y: animation.type === 'fadeInUp' ? 20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: animation.delay || 0,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariants}
      style={positionStyle}
      className="max-w-full px-4"
    >
      <p
        style={{
          fontSize: style.fontSize || '16px',
          fontFamily: style.fontFamily || 'system-ui',
          fontWeight: style.fontWeight || 400,
          color: style.color || '#000000',
          textAlign: style.textAlign || 'left',
          lineHeight: style.lineHeight || '1.5',
          fontStyle: style.fontStyle || 'normal',
          maxWidth: style.maxWidth || 'auto',
          margin: 0,
        }}
      >
        {content}
      </p>
    </motion.div>
  );
}

/**
 * Render image elements
 */
function ImageElement({ element }: any) {
  const style = element.style || {};
  const position = element.position || {};

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    ...Object.fromEntries(
      Object.entries(position)
        .filter(([key]) => ['top', 'bottom', 'left', 'right'].includes(key))
        .map(([key, value]) => [key, value])
    ),
  };

  return (
    <motion.img
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: element.animations?.entrance?.delay || 0 }}
      src={element.assetUrl}
      alt={element.id}
      style={{
        ...positionStyle,
        width: style.width || '200px',
        height: style.height || '200px',
        objectFit: 'contain',
      }}
    />
  );
}

/**
 * Render Lottie animation elements
 */
function LottieElement({ element }: any) {
  const position = element.position || {};
  const size = element.size || {};

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    ...Object.fromEntries(
      Object.entries(position)
        .filter(([key]) => ['top', 'bottom', 'left', 'right'].includes(key))
        .map(([key, value]) => [key, value])
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: element.animations?.entrance?.delay || 0 }}
      style={{
        ...positionStyle,
        width: size.width || '200px',
        height: size.height || '200px',
      }}
      className="flex items-center justify-center"
    >
      <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          Lottie: {element.id}
        </p>
      </div>
    </motion.div>
  );
}
