"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isNext = pathname === "/next";
  const isFound = pathname.startsWith("/found");

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        display: "flex",
        backgroundColor: "#fff",
        borderTop: "1px solid #e5e5e5",
      }}
    >
      <NavItem
        href="/next"
        label="次のヒント"
        active={isNext}
      />
      <NavItem
        href="/found"
        label="発見済み"
        active={isFound}
      />
    </nav>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        flex: 1,
        textAlign: "center",
        textDecoration: "none",
        fontSize: 12,
        paddingTop: 8,
        color: active ? "#0070f3" : "#666",
        fontWeight: active ? 600 : 400,
      }}
    >
      <div>{label}</div>
      {active && (
        <div
          style={{
            margin: "6px auto 0",
            width: 24,
            height: 2,
            backgroundColor: "#0070f3",
            borderRadius: 1,
          }}
        />
      )}
    </Link>
  );
}
