export default function LayoutEmpresa({sidebar, header, content} : any) {
    return (
        <div className="relative flex flex-row">
            {sidebar}
            <div className="absolute left-[16%] flex flex-col w-[84%] h-screen">
                <div className="h-1/12">{header}</div>
                <div className="p-4 overflow-y-scroll">{content}</div>
            </div>
        </div>
    );
}
