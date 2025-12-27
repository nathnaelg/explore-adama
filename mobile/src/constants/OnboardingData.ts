// /home/natye/smart-tourism/constants/OnboardingData.ts
import { OnboardingItemType } from '@/src/components/onboarding/OnboardingItem';

export const onboardingData: OnboardingItemType[] = [
  {
    id: 1,
    title: 'onboarding.slides.discoverTitle',
    description: 'onboarding.slides.discoverDesc',
    image: require('@/assets/images/onboarding_1.png'),
    action: 'onboarding.next',
  },
  {
    id: 2,
    title: 'onboarding.slides.aiTitle',
    description: 'onboarding.slides.aiDesc',
    image: require('@/assets/images/onboarding_2.png'),
    action: 'onboarding.next',
  },
  {
    id: 3,
    title: 'onboarding.slides.bookTitle',
    description: 'onboarding.slides.bookDesc',
    image: require('@/assets/images/onboarding_3.png'),
    action: 'onboarding.getStarted',
  },
];