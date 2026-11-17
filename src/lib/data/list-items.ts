import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import type { EntityListItem } from "@/components/database/EntityListClient";
import type { Article, BaseEntity } from "@/lib/types";

export function entityToListItem(
  entity: BaseEntity,
  href: string,
  meta?: string,
): EntityListItem {
  return {
    id: entity.id,
    href,
    title: entity.name,
    description: entity.description,
    meta,
    verificationStatus: entity.verificationStatus,
    imageSrc: resolveHeroImage(entity.heroImage),
  };
}

export function articleToListItem(article: Article, href: string): EntityListItem {
  return {
    id: article.id,
    href,
    title: article.title,
    description: article.excerpt,
    meta: article.category === "guide" ? article.guideCategory : "News",
    verificationStatus: article.verificationStatus,
    imageSrc: resolveHeroImage(article.heroImage),
  };
}