import { generals } from "@/data/generals";
import type { MetadataRoute } from "next";
import { rulers } from "@/data/rulers";
import { wars } from "@/data/wars";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/origins",
    "/map",
    "/rulers",
    "/family-tree",
    "/cleopatra",
    "/gods",
    "/daily",
    "/monuments",
    "/wars", "/generals", "/generals/quiz", ...generals.map((g) => `/generals/${g.slug}`),
    "/movies",
    "/sources",
    ...rulers.map((ruler) => `/rulers/${ruler.slug}`),
    ...wars.map((war) => `/wars/${war.slug}`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
