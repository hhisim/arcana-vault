import type { Metadata } from 'next';
import CorrespondenceEngine from '@/app/components/CorrespondenceEngine';

export const metadata: Metadata = {
  title: 'Correspondence Codex | Vault of Arcana',
  description: 'Forged from over 30 years of distilled gnosis and esoteric study, this resilient parsing engine transforms chaotic seed data into pristine cross-system maps. By decoding the hidden relationships between form, frequency, linguistics, geometry, and archetypes, it reveals allied resonances and enables rapid, interconnected discovery across planets, deities, botanicals, sacred letters, the tarot, the zodiac, and beyond.',
};

export default function CorrespondenceEnginePage() {
  return <CorrespondenceEngine seedUrl="/data/correspondences.txt" initialSlug="venus" />;
}
