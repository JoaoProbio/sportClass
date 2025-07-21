"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Variants, MotionProps } from "framer-motion";
import type { ReactNode, ElementType, RefObject } from "react";

interface TimelineContentProps extends MotionProps {
  as?: ElementType;
  children: ReactNode;
  animationNum?: number;
  timelineRef?: RefObject<HTMLElement | null>;
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
  const localRef = useRef<HTMLElement | null>(null);
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
      <Tag>{children}</Tag>
    </motion.div>
  );
};

export { TimelineContent }; 