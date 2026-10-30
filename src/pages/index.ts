import type { ComponentType } from 'react';
import type { ImplementedKey } from '../config/implemented';
import Home from './Home';
import Community from './Community';
import Privacy from './Privacy';
import Transparency from './Transparency';
import Technology from './Technology';
import Product from './Product';
import Preview from './Preview';
import Roadmap from './Roadmap';
import Team from './Team';
import Enterprise from './Enterprise';
import Download from './Download';
import Faq from './Faq';
import Contact from './Contact';

export { default as NotFound } from './NotFound';

export const PAGES: Record<ImplementedKey, ComponentType> = {
  home: Home,
  community: Community,
  privacy: Privacy,
  transparency: Transparency,
  technology: Technology,
  product: Product,
  preview: Preview,
  roadmap: Roadmap,
  team: Team,
  enterprise: Enterprise,
  download: Download,
  faq: Faq,
  contact: Contact,
};
