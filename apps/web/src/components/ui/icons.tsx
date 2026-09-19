import type { SVGProps } from "react";

/** Line icons for the shared UI kit: 24x24, stroke-based, matching the ticket-rail language. */

function baseProps(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    viewBox: "0 0 24 24",
    width: 28,
    height: 28,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true,
    ...props,
  };
}

export function TicketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h4" />
    </svg>
  );
}

export function TableIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="9" width="18" height="6" rx="1" />
      <path strokeLinecap="round" d="M6 15v3M18 15v3M6 9V6M18 9V6" />
    </svg>
  );
}

export function ChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10M12 20V4M20 20v-7" />
      <path strokeLinecap="round" d="M4 20h16" />
    </svg>
  );
}
