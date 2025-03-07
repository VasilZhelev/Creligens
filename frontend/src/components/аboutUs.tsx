import { FeatureSteps } from "@/components/ui/feature-section"

const features = [
  { 
    step: 'Step 1', 
    title: 'Make it cheaper',
    content: 'We can tell you the price for repair of all the broken parts.', 
    image: 'https://www.shutterstock.com/image-photo/hand-pick-toy-car-driving-600nw-2204268921.jpg' 
  },
  { 
    step: 'Step 2',
    title: 'Chose a car',
    content: 'For now we work only with mobile.bg. You need only to chose a listing and place it in our website.',
    image: 'https://media.istockphoto.com/id/1247049926/vector/a-car-passes-a-check.jpg?s=612x612&w=0&k=20&c=J-o76rm_yfMi9bkPym5u21bMZwhADZMVRbyWNczWadU='
  },
  { 
    step: 'Step 3',
    title: 'Find parts',
    content: 'When we find the parts that are broken we have a big date set with many parts at the best price.',
    image: 'https://media.tehrantimes.com/d/t/2020/07/22/3/3505433.jpg'
  },
]

export function AboutUs() {
  return (
      <FeatureSteps 
        features={features}
        title="About us"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
  )
}