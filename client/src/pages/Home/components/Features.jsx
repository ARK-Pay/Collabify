import styled from 'styled-components';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import Groups3Icon from '@mui/icons-material/Groups3';
import PublicIcon from '@mui/icons-material/Public';
import TimelineIcon from '@mui/icons-material/Timeline';
import HeroBgAnimation from './HeroBgAnimation';

const FeaturesWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #181622;
  padding: 20px 0 60px;
  margin-top: -90px;
  margin-bottom: 100px;
  min-height: 100vh;
  background: linear-gradient(343.07deg, rgba(132, 59, 206, 0.06) 5.71%, rgba(132, 59, 206, 0) 64.83%);

  @media (max-width: 768px) {
    padding: 15px 0 40px;
    margin-top: -50px;
  }
`;

const Number = styled.div`
  width: 60px;
  height: 60px;
  font-size: 32px;
  font-weight: 800;
  color: #306EE8;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(48, 110, 232, 0.1);
  border: 6px solid #306EE8;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 32px;
  }
`;

const FeaturesTitle = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 800;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #306EE8;

  @media (max-width: 768px) {
    margin-top: 8px;
    font-size: 36px;
  }
`;

const FeatureDescription = styled.p`
  font-size: 20px;
  line-height: 1.5;
  width: 100%;
  max-width: 825px;
  text-align: center;
  color: hsl(246, 6%, 65%);
  margin-bottom: 25px;

  @media (max-width: 768px) {
    width: 90%;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const Content = styled.div`
  position: relative;
  width: 100%;
`;

const FeaturesContainer = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  max-width: 825px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 15px;
  }
`;

const FeatureCard = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  background-color: hsl(250, 24%, 9%);
  border: 0.1px solid #306EE8;
  border-radius: 16px;
  padding: 20px 28px;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-10px);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 24px;
  }

  @media (max-width: 728px) {
    padding: 16px;
    height: 180px;
  }
`;

const FeatureIcon = styled.div`
  width: 50px;
  height: 50px;
  color: #306EE8;
  position: absolute;
  bottom: 10px;
  right: 10px;
  border-radius: 50%;
  border: 2px solid hsl(220, 80%, 75%, 30%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(48, 110, 232, 0.1);
`;

const FeatureTitle = styled.div`
  font-size: 20px;
  color: #306EE8;
  margin-bottom: 8px;
  font-weight: 600;
`;

const FeatureCardDescription = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: hsl(246, 6%, 65%);
`;

const BgImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (max-width: 768px) {
    display: none;
  }
`;

const featuresData = [
  {
    icon: <ElectricBoltIcon />,
    title: 'Project Management',
    description:
      'Effortlessly manage your personal projects, assign tasks to team members, and keep track of progress in real-time, enhancing productivity.',
  },
  {
    icon: <Groups3Icon />,
    title: 'Team Collaboration',
    description:
      "Collaborate with team members seamlessly, communicate in real-time, and keep track of your team's progress through integrated tools.",
  },
  {
    icon: <PublicIcon />,
    title: 'Community Building',
    description:
      'Connect with like-minded individuals, build communities, share ideas, and expand your network for greater opportunities.',
  },
  {
    icon: <TimelineIcon />,
    title: 'Time Tracking',
    description:
      'Monitor your time efficiently, set productivity goals, and analyze your progress to improve overall efficiency and performance.',
  },
];

const Features = () => {
  return (
    <FeaturesWrapper>
      <FeaturesTitle id="features">Key Features</FeaturesTitle>
      <FeatureDescription>
        Discover how our app simplifies project management and makes collaboration effortless.
      </FeatureDescription>
      <Content>
        <FeaturesContainer>
          {featuresData.map((feature, index) => (
            <FeatureCard key={index}>
              <div style={{ flex: 1 }}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureCardDescription>{feature.description}</FeatureCardDescription>
              </div>
              <FeatureIcon>{feature.icon}</FeatureIcon>
            </FeatureCard>
          ))}
        </FeaturesContainer>
        <BgImage>
          <HeroBgAnimation />
        </BgImage>
      </Content>
    </FeaturesWrapper>
  );
};

export default Features;
