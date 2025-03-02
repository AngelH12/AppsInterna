import { Dropdown } from './Components/Dropdown';
import { BellRing} from 'lucide-react';

interface Notification {
    id: number; type: string; imageClassName?: string; image?: string; boldName?: string; name?: string; description?: string; price?: string; time: string; date: string
}

const NotificationDropdown = () => {

    return (
        <>
            <Dropdown className="relative flex items-center h-header">
                <Dropdown.Trigger type="button" className="inline-flex justify-center relative items-center p-0 text-topbar-item transition-all size-[37.5px] duration-200 ease-linear bg-topbar rounded-md dropdown-toggle btn hover:bg-topbar-item-bg-hover hover:text-topbar-item-hover group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:hover:bg-zink-600 group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:hover:text-zink-50 group-data-[topbar=dark]:dark:text-zink-200 group-data-[topbar=dark]:text-topbar-item-dark" id="notificationDropdown" data-bs-toggle="dropdown">
                    <BellRing className="inline-block size-5 stroke-1 fill-slate-100 group-data-[topbar=dark]:fill-topbar-item-bg-hover-dark group-data-[topbar=brand]:fill-topbar-item-bg-hover-brand"></BellRing>
                    <span className="absolute top-0 right-0 flex w-1.5 h-1.5">
                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-400"></span>
                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    </span>
                </Dropdown.Trigger>
                <Dropdown.Content placement="right-end" className="absolute z-50 ltr:text-left rtl:text-right bg-white rounded-md shadow-md !top-4 dropdown-menu min-w-[20rem] lg:min-w-[26rem] dark:bg-zink-600" aria-labelledby="notificationDropdown">
                    <div className="p-4">
                        <h6 className="mb-4 text-16">Notifications</h6>
                    </div>
                    
                </Dropdown.Content >
            </Dropdown >
        </>
    );
};

export default NotificationDropdown;
