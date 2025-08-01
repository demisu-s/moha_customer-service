import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";



export function CarouselImages({ images }: { images: string[] }) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-lg mb-8">
                <div className="relative group">
                    <Carousel setApi={setApi}>
                        <CarouselContent>
                            {images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <Card className="shadow-lg rounded-lg overflow-hidden">
                                        <CardContent className="flex h-auto aspect-square items-center justify-center p-0">
                                            <img
                                                src={image}
                                                alt={`Slide ${index + 1}`}
                                                className="w-full h-full object-cover transform transition-transform duration-300"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300 opacity-0 group-hover:opacity-100" />
                        <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300 opacity-0 group-hover:opacity-100" />
                    </Carousel>
                </div>

                <div className="py-2 text-center text-sm text-gray-600">
                    {current} of {count}
                </div>
            </div>

        </div>
    );
}
