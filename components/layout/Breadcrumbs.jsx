import React from "react";
import Link from "next/link";
import { Container } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";

import { useTranslation } from "react-i18next";

const Breadcrumbs = ({ items = [] }) => {
  const { t, i18n } = useTranslation("common");
  return (
    <div className="py-4">
      <Container maxWidth="lg">
        <nav
          className="flex items-center gap-2 text-sm md:text-base"
          dir={i18n.dir()}
        >
          <Link
            href="/"
            className="text-orange-500 text-xl hover:text-orange-400 font-bold transition-colors"
          >
            {t("navbar.home")}
          </Link>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronLeft className="text-slate-500 text-sm" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-orange-500 hover:text-orange-400 font-bold transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white/70 font-bold">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumbs;
