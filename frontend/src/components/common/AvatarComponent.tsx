import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface AvatarComponentProp {
    imageLocation: string;
    fallbackImageLocation?: string;
    classNames?: string;
}

export function AvatarComponent({ imageLocation, fallbackImageLocation, classNames }: AvatarComponentProp) {
    return (
        <Avatar className={classNames}>
            <AvatarImage src={imageLocation} alt="@shadcn" />
            <AvatarFallback>{fallbackImageLocation ? fallbackImageLocation : 'CN'}</AvatarFallback>
        </Avatar>
    )
}
