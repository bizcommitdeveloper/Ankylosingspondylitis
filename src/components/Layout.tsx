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

      <footer className="site-footer">
        <div className="container">
          <div className="disclaimer">
            <strong>Not medical advice.</strong> These instructions are general guidance, not a personal prescription.
            If you have a recent injury or surgery, a diagnosed condition, or symptoms such as numbness, weakness or
            dizziness, get assessed before starting.
          </div>
          © Physiosolution. All rights reserved.
        </div>
      </footer>
    </>
  );
}
