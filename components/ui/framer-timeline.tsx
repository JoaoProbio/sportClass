"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Variants, MotionProps } from "framer-motion";
import type { ReactNode, RefObject, ElementType } from "react";

interface TimelineContentProps extends MotionProps {
  as?: ElementType;
  children: ReactNode;
  animationNum?: number;
  timelineRef?: RefObject<HTMLDivElement | null>;
  variants: Variants;
  className?: string;
}

const TimelineContent = ({
  as: Tag = "div",
  children,
  animationNum = 0,
  timelineRef,
  variants,
  className = "",
  ...rest
}: TimelineContentProps) => {
  const localRef = useRef<HTMLDivElement | null>(null);
  const ref = timelineRef || localRef;
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={animationNum}
      variants={variants}
      className={className}
      {...rest}
    >
{React.createElement(Tag, {}, children)}
    </motion.div>
  );
};

export { TimelineContent }; 