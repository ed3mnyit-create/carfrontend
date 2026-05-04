"use client";
import React, { useEffect, useState } from "react";
import { List, KeyboardArrowDown } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const TableOfContents = ({ contentSelector = ".prose" }) => {
  const { t, i18n } = useTranslation("common");
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(true);

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

  const h2Count = headings.filter(h => h.level === 'h2').length;
  const h3Count = headings.filter(h => h.level === 'h3').length;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
        aria-controls="toc-list"
      >
        <div className="flex items-center gap-3">
          <List className="text-primary" />
          <span className="font-bold text-white">
            {t("blog.tableOfContents.title")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {h2Count} {i18n.language === "ar" ? "عنوان" : "headings"}
          </span>
          <KeyboardArrowDown 
            className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div 
        id="toc-list"
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px]" : "max-h-0"}`}
      >
        <div className="px-4 pb-4">
          <div className="border-t border-white/5 pt-4">
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollTo(heading.id)}
                    className={`w-full text-right px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group ${
                      activeId === heading.id
                        ? "bg-primary/15 text-primary font-bold"
                        : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"
                    } ${heading.level === 'h3' ? 'pr-8' : ''}`}
                    aria-current={activeId === heading.id ? "location" : undefined}
                  >
                    <span className={`rounded-full transition-all shrink-0 ${
                      activeId === heading.id 
                        ? "bg-primary w-2 h-2" 
                        : "bg-slate-600 group-hover:bg-slate-500 w-1.5 h-1.5"
                    }`} 
                    />
                    <span className="line-clamp-2 text-right">{heading.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
