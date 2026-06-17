"use client";

import { useQuery } from "@tanstack/react-query";
import { settingService } from "@/services/api";
import { defaultHomeSettings, mergeHomeSettings } from "./homeSettings";

export function useHomeSettings() {
  const query = useQuery({
    queryKey: ["setting", "homepage_content"],
    queryFn: () => settingService.getOne("homepage_content"),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    ...query,
    settings: mergeHomeSettings(query.data?.data || defaultHomeSettings),
  };
}
