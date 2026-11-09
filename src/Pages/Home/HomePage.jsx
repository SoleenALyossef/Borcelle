import MainNavbar from '../../components/MainNavbar';
import Footer from '../../components/Footer';
import ExtraServices from './ExtraServices/ExtraServices';
import SuppliersByRegion from './ExtraServices/SuppliersByRegion';
import { Container } from 'react-bootstrap';
import RecommendedItems from './RecommendedItems/RecommendedItems';
import InquiryBanner from './InquiryBanner/InquiryBanner';
import CategorySection from './CategorySection/CategorySection';
import DealsAndOffers from './DealsAndOffers/DealsAndOffers';
import image1 from '../../assets/image/image 98.png'
import image from '../../assets/image/image 92.png'
import HeroSection from './HeroSection/HeroSection';
import Subscribe from "../../components/Subscribe";

const HomePage = () => {
  return (
    <div>
      <MainNavbar  />

     <Container className="py-4">
        <HeroSection/>
        <DealsAndOffers  />
          
        {/* التعديل هنا: استخدام categoryId كأرقام بدلاً من نصوص */}
        <CategorySection 
          bannerTitle="Home and outdoor" 
          bannerImage={image}
          categoryId={1}  
        />

        {/* التعديل هنا: استخدام categoryId */}
        <CategorySection 
          bannerTitle="Consumer electronics and gadgets" 
          bannerImage={image1}
          categoryId={2} 

        />
        
        <InquiryBanner />
        <RecommendedItems  />
        <ExtraServices />
        <SuppliersByRegion />
     </Container>
      <Subscribe onSubscribe={(email) => console.log('Subscribed:', email)} />
      <Footer  />
    </div>
  );
};

export default HomePage;