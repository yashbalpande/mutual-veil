import { CustomCursor } from "@/components/CustomCursor";
import { Hero } from "@/components/Hero";
import { CoreComponents } from "@/components/CoreComponents";
import { HowItWorks } from "@/components/HowItWorks";
import { RiskPoolPreview, ClaimsPreview, GovernancePreview } from "@/components/DashboardPreviews";
import { Tokenomics } from "@/components/Tokenomics";
import { Security } from "@/components/Security";
import { CTA } from "@/components/CTA";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <CustomCursor />
      <Hero />
      <CoreComponents />
      <HowItWorks />
      <RiskPoolPreview />
      <ClaimsPreview />
      <GovernancePreview />
      <Tokenomics />
      <Security />
      <CTA />
    </div>
  );
};

export default Index;
