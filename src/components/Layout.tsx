import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Back } from "./icons";

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      <header className="site-header">
        <div className="container bar">
          <Link className="brand" to="/">
            <span className="mark">Px</span>
            <span>
              Physiosolution
              <small>Exercise library</small>
            </span>
          </Link>
          <span className="header-spacer" />
          {!isHome && (
            <Link className="back-link" to="/">
              <Back size={18} /> All exercises
            </Link>
          )}
        </div>
      </header>

      <main className="container">{children}</main>
    </>
  );
}
