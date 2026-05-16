import { motion } from "motion/react";

export const PlusIcon = () => {
	return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="var(--color-primary-subtle)"
      className="icon icon-tabler icons-tabler-filled icon-tabler-plus"
		whileHover={{ scale: 1.02, rotate: 90 }}
		transform="translate(0, 0)"
		transition={{type: "spring", stiffness: 80, damping: 10}}	
	>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <motion.path
        d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1"
      />
    </motion.svg>
  );
}