import { useQuery } from "@tanstack/react-query";
import { getApi } from "./apiCalls";

export const useResourceDetail = (resourceId: number) => {
  return useQuery({
    queryKey: ["resource", resourceId],
    queryFn: () => getApi(`resources/${resourceId}`),
  });
};

export const useResources = () => {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => getApi("resources"),
  });
};
