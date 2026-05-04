"use client";
import React, { useEffect, useState } from "react";
import { List, KeyboardArrowDown } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const TableOfContentsDrawer = ({ contentSelector = ".prose" }) => {
  const { t, i18n } = useTranslation("common");
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const content = document.querySelector(contentSelector);
    if (!content) return;

    const elements = Array.from(content.querySelectorAll("h2, h3"));
    const headingData = elements.map((el, index) => {
      const id = el.id || `heading-${index}`;
      el.id = id;
      return {
        id,
        text: el.innerText,
        level: el.tagName.toLowerCase(),
      };
    });

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setHeadings(headingData);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 1.0 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [contentSelector]);

  if (headings.length === 0) return null;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="lg:hidden bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4"
        aria-expanded={isOpen}
        aria-controls="toc-drawer"
      >
        <div className="flex items-center gap-3">
          <List className="text-primary" />
          <span className="font-bold text-white text-sm">
            {t("blog.tableOfContents.title")}
          </span>
          <span className="text-xs text-slate-500">
            ({headings.length})
          </span>
        </div>
        <KeyboardArrowDown 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div 
        id="toc-drawer"
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="px-4 pb-4">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => scrollTo(heading.id)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group ${
                    activeId === heading.id
                      ? "bg-primary/20 text-primary font-bold"
                      : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"
                  } ${heading.level === 'h3' ? 'pr-6' : ''}`}
                  aria-current={activeId === heading.id ? "location" : undefined}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
                  <span className="line-clamp-1">{heading.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TableOfContentsDrawer;
