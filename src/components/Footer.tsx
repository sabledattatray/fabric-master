import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FabricMasterLogo } from "./FabricMasterLogo";

export function Footer() {
  return (
    <footer className="product-footer">
      <div className="footer-top">
        <div>
          <Link to="/" className="footer-brand">
            <FabricMasterLogo className="w-6 h-6" />
            Fabric Master
          </Link>
          <p className="footer-summary">
            A clearer way to plan, design, and optimize your Microsoft Fabric
            estate.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Platform</strong>
            <Link to="/workspace">Workspace</Link>
            <Link to="/wizard">Capacity planning</Link>
            <Link to="/cost-calculator">Cost intelligence</Link>
          </div>
          <div>
            <strong>Resources</strong>
            <Link to="/docs">Documentation</Link>
            <Link to="/pricing">Pricing sources</Link>
            <Link to="/about">About & methodology</Link>
          </div>
          <div>
            <strong>Community</strong>
            <a
              href="https://github.com/sabledattatray/fabric-master"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <Link to="/resources/open-source">Open source</Link>
            <a
              href="https://dattasable.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datta Sable ↗
            </a>
          </div>
        </div>
      </div>
      <div className="footer-legal">
        <p>
          Fabric Master is an independent, open-source planning tool. It is not
          affiliated with, sponsored by, or endorsed by Microsoft. Microsoft
          Fabric, Power BI, Azure, and OneLake are trademarks of Microsoft.
          Estimates are preliminary planning guidance, not a commercial offer or
          performance guarantee.
        </p>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Fabric Master. Built with care by
            Datta Sable.
          </span>
          <div>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <a
              href="https://github.com/sabledattatray/fabric-master"
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT License <ArrowUpRight size={10} className="inline" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
