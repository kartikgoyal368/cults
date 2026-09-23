import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import CategorySlider from '@/components/CategorySlider';
import BestSellers from '@/components/BestSellers';
import StudioShowcase from '@/components/StudioShowcase';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <CategorySlider />
      <ProductGrid />
      <BestSellers />
      <StudioShowcase />
    </>
  );
}
