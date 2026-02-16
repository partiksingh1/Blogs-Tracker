import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

interface Feature {
    title: string;
    description: string;
}

interface FeaturesSectionProps {
    features: Feature[];
}

export function FeaturesFAQ({ features }: FeaturesSectionProps) {
    return (
        <section id="features" className="py-16">
            <div className="mx-auto max-w-6xl p-3">
                <h2 className="text-3xl font-bold text-center mb-10 sm:text-4xl">
                    FAQs
                </h2>

                <Accordion type="multiple">
                    {features.map((feature, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{feature.title}</AccordionTrigger>
                            <AccordionContent>{feature.description}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
