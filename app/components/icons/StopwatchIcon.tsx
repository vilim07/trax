import * as React from "react"
const StopwatchIcon = ({ className = '' }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        className={className}
    >
    <path
      d="M5.728 19.133A8.9 8.9 0 0 1 17.732 6.014l1.073-1.072-.66-.66a.467.467 0 0 1 .66-.661l1.98 1.98a.467.467 0 0 1-.66.66l-.66-.66-1.05 1.05A8.899 8.899 0 1 1 5.727 19.133h.001ZM4.011 12.84a8.01 8.01 0 1 0 16.02 0 8.01 8.01 0 0 0-16.02 0Zm6.23 0a1.78 1.78 0 0 1 1.335-1.725v-4.06a.445.445 0 0 1 .89 0v4.06a1.78 1.78 0 1 1-2.225 1.725Zm.89 0a.89.89 0 1 0 1.78 0 .89.89 0 0 0-1.78 0ZM9.796 3.05a.445.445 0 0 1 0-.89h4.45a.445.445 0 1 1 0 .89h-4.45Z"
    />
    </svg>
)
export default StopwatchIcon
