import Image from "next/image";

export default function IconButton({ src, alt, func }: { src: string; alt: string; func: () => void; }) {


    return (
        <button type='button' className="hover:scale-125 rounded-full transition-all" onClick={func}>
            <Image
                src={src}
                width="24"
                height="24"
                alt={alt}
            />
        </button>
    );
};

