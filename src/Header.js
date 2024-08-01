import {IonIcon} from '@ionic/react'
import {menu, close} from 'ionicons/icons'
import { useState } from 'react';

function Header() {
	const [icon, setIcon] = useState(0);
	const [opacity, setOpacity] = useState(0);
	const handleClick = () => {
		setIcon(1-icon);
		setOpacity(0);
	}
    return (
        <nav class="p-5 min-h-10 bg-white shadow md:flex md:items-center md:justify-between">
            <div class="flex justify-between items-center ">
                <span class="text-2xl font-[Poppins] cursor-pointer">
                    <img class="h-10 inline" src=""></img>
                    BadGrades
                </span>
                <span class="text-3xl cursor-pointer md:hidden mx-2 block">
                    <IonIcon icon={icon == 0 ? menu : close} onClick={() => {
						handleClick()
						}}/>
                </span>
            </div>

            <ul class={`md:flex md:items-center z-[1] md:z-auto md:static absolute bg-white w-full  left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 ${icon == 0 ? "top-[-400px]" : "top[80px]"} transition-all ease-in duration-500`}>
                <li class="mx-4 my-6 md:my-0">
                    <a
                        href="#"
                        class="text-xl hover:text-blue-500 duration-200"
                    >
                        HOME
                    </a>
                </li>
                <li class="mx-4 my-6 md:my-0">
                    <a
                        href="#"
                        class="text-xl hover:text-blue-500 duration-200"
                    >
                        COURSE SEARCH
                    </a>
                </li>
                <li class="mx-4 my-6 md:my-0">
                    <a
                        href="#"
                        class="text-xl hover:text-blue-500 duration-200"
                    >
                        ABOUT
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
