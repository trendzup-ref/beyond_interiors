export default function SectionMark() {
    return (
        <span
            className="inline-grid grid-cols-2 gap-[2px] w-4 h-4 shrink-0 rotate-45"
            aria-hidden="true"
        >
            <span className="bg-[#2C241E] rounded-[1px]" />
            <span className="bg-[#A69279] rounded-[1px]" />
            <span className="bg-[#C8B9A6] rounded-[1px]" />
            <span className="bg-[#2C241E] rounded-[1px]" />
        </span>
    );
}