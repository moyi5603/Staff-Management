export interface CatalogGroup {
  title: string;
  items: string[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  groups: CatalogGroup[];
}
