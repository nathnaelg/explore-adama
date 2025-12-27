// /home/natye/smart-tourism/constants/OnboardingData.ts
import { OnboardingItemType } from '@/src/components/onboarding/OnboardingItem';

export const onboardingData: OnboardingItemType[] = [
  {
    id: 1,
    title: 'Discover Adama City',
    description: 'Your personal guide to exploring the heart of Oromia. Find top-rated hotels, attractions, and local experiences instantly.',
    image: require('@/assets/images/onboarding_1.png'),
    action: 'Next →',
  },
  {
    id: 2,
    title: 'AI-Powered Recommendations',
    description: 'Discover the best of Adama with our smart travel assistant. Get personalized suggestions for hotels, attractions, and dining based on your unique preferences.',
    image: require('@/assets/images/onboarding_2.png'),
    action: 'Next →',
  },
  {
    id: 3,
    title: 'Book Events & Navigate Easily',
    description: 'Seamlessly purchase tickets for Adama\'s top attractions and get turn-by-turn directions to your next adventure.',
    image: require('@/assets/images/onboarding_3.png'),
    action: 'Get Started',
  },
];