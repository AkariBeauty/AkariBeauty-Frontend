import Button from "./Button";

interface AlertModalProps
{
    message : string,
    isOpen : boolean,
    show : (open : boolean) => void
}

export default function AlertModal({message, isOpen = false, show} : AlertModalProps)
{
    if (isOpen)
    {
        return(
        <div className="fixed inset-0 flex bg-transparent/50 z-50 justify-center items-start ">
            <div className="flex flex-col justify-center bg-white rounded-lg p-4 mt-[10px] max-w-[30%] border-6 border-primary shadow-primary shadow-2xl">
                <span className="text-2xl font-bold break-words">{message}</span>
                <br />
                <div className="flex flex-row justify-center"><Button label="OK" action={() => show(false)}/></div>
            </div>

        </div>
        );
    }
    return(<></>);
}
