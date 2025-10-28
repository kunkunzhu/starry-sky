import { StarMessageData } from "@/lib/types/misc";

interface StarMessageProps {
    star: StarMessageData,
    visibility: boolean,
    onMouseEnter: () => void,
    onMouseLeave: () => void
}

export default function StarMessage({ star, visibility, onMouseEnter, onMouseLeave }: StarMessageProps) {
    return (
        <div
            className={`transition-all duration-700 ${visibility ? 'opacity-100' : 'opacity-0'}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="absolute bottom-4 right-4 max-w-200 rounded-lg p-10">
                <div className="flex flex-col text-xs gap-4 text-right">
                    <p>
                        {star.message}
                    </p>
                    <p>Wherever you are now, I hope you are doing well.</p>
                </div>
            </div>
            <div className="absolute bottom-4 right-4 max-w-200 rounded-lg p-10 bg-star/5 blur-3xl">
                <div className="flex flex-col text-xs gap-4 text-right ">
                    <p>
                        {star.message}
                    </p>
                    <p>Wherever you are, I hope you are doing well.</p>
                </div>
            </div>
        </div>
    )
}