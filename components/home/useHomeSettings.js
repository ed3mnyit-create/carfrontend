"use client";

import { useQuery } from "@tanstack/react-query";
import { settingService } from "@/services/api";
import { defaultHomeSettings, mergeHomeSettings } from "./homeSettings";

export function useHomeSettings() {
  const query = useQuery({
    queryKey: ["setting", "home_page"],
    queryFn: () => settingService.getOne("home_page"),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    ...query,
    settings: mergeHomeSettings(query.data?.data || defaultHomeSettings),
  };
}
