import type { Metadata } from 'next';
import CorrespondenceEngine from '@/app/components/CorrespondenceEngine';

export const metadata: Metadata = {
  title: 'Correspondence Engine | Vault of Arcana',
  description: 'Cross-correspondence tables generated from the Arcana seed file.',
};

export default function CorrespondenceEnginePage() {
  return <CorrespondenceEngine seedUrl="/data/correspondences.txt" initialSlug="venus" />;
}
