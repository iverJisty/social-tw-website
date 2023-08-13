import clsx from 'clsx'
import { Link, NavLink, Outlet, useMatch, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@uidotdev/usehooks'
import AddIcon from '../assets/add.svg'
import ArrowLeftIcon from '../assets/arrow-left.svg'
import BellIcon from '../assets/bell.svg'
import HomeIcon from '../assets/home.svg'
import Logo from '../assets/logo.png'
import PersonCircleIcon from '../assets/person-circle.svg'
import SearchIcon from '../assets/search.svg'
import StarIcon from '../assets/star.svg'

export default function AppLayout() {
    const matchPath = useMatch('/')

    const navigate = useNavigate()

    const goBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1)
        } else {
            navigate('/')
        }
    }

    const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)')

    if (isSmallDevice) {
        return (
            <div className="pt-4">
                <header className="relative flex items-center justify-center h-16 gap-2 px-4">
                    {!matchPath && (
                        <button
                            className="absolute flex items-center justify-center border rounded-lg left-4 w-9 h-9 bg-white/90 shadown-base border-stone-200"
                            onClick={goBack}
                        >
                            <ArrowLeftIcon className="w-4 h-4 text-black/90" />
                        </button>
                    )}
                    <img className="w-8 h-8" src={Logo} alt="brand logo" />
                    <h1 className="text-xl font-black text-white/90">
                        Unirep Social TW
                    </h1>
                </header>
                <main className="max-w-5xl px-4 mx-auto">
                    <Outlet />
                </main>
                <nav className="fixed bottom-0 w-screen h-20 px-4 flex items-stretch rounded-t-3xl bg-gradient-to-r from-secondary to-primary/80 shadow-[0_0_20px_0_rgba(0,0,0,0.6)_inset]">
                    <NavLink
                        className="flex items-center justify-center flex-1"
                        to="/"
                    >
                        <HomeIcon className="text-white w-14 h-14" />
                    </NavLink>
                    <NavLink
                        className="flex items-center justify-center flex-1"
                        to="#"
                    >
                        <StarIcon className="text-white w-14 h-14" />
                    </NavLink>
                    <div className="relative flex justify-center flex-1">
                        <NavLink
                            className="absolute flex items-center justify-center w-16 h-16 bg-white rounded-full bottom-8 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                            to="/write"
                        >
                            <AddIcon className="w-8 h-8 text-secondary" />
                        </NavLink>
                    </div>
                    <NavLink
                        className="flex items-center justify-center flex-1"
                        to="#"
                    >
                        <BellIcon className="text-white w-14 h-14" />
                    </NavLink>
                    <NavLink
                        className="flex items-center justify-center flex-1"
                        to="#"
                    >
                        <PersonCircleIcon className="text-white w-14 h-14" />
                    </NavLink>
                </nav>
            </div>
        )
    } else {
        return (
            <div className="flex divide-x divide-neutral-600">
                <section className="hidden basis-80 xl:block">
                    <div className="fixed top-0 h-full px-10 pt-20">
                        <div className="h-10 px-4 flex items-center gap-2 bg-[#3E3E3E] rounded-full text-white">
                            <SearchIcon className="w-5 h-5" />
                            <input
                                className="flex-1 text-base font-medium placeholder:text-white/60 focus:outline-none"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                </section>
                <section className="flex-1 px-10 pt-20 divide-y divide-neutral-600">
                    <div className="flex gap-5 py-6">
                        <h2 className="text-2xl font-bold text-secondary">
                            Home
                        </h2>
                        {!matchPath && (
                            <button
                                className="flex items-center justify-center border rounded-lg w-9 h-9 bg-white/90 shadown-base border-stone-200"
                                onClick={goBack}
                            >
                                <ArrowLeftIcon className="w-4 h-4 text-black/90" />
                            </button>
                        )}
                    </div>
                    <main>
                        <Outlet />
                    </main>
                </section>
                <section className="basis-80">
                    <div className="fixed top-0 h-full px-10 pt-20">
                        <Link className="flex items-center gap-2 mb-12" to="/">
                            <img
                                className="w-12 h-12"
                                src={Logo}
                                alt="brand logo"
                            />
                            <h1 className="text-xl font-black text-white/90">
                                Unirep Social TW
                            </h1>
                        </Link>
                        <nav className="space-y-9">
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-8',
                                        isActive
                                            ? 'text-secondary'
                                            : 'text-white'
                                    )
                                }
                                to="/"
                            >
                                <HomeIcon className="w-14 h-14" />
                                <span className="text-xl font-bold ">Home</span>
                            </NavLink>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-8',
                                        isActive
                                            ? 'text-secondary'
                                            : 'text-white'
                                    )
                                }
                                to="/explore"
                            >
                                <StarIcon className="w-14 h-14" />
                                <span className="text-xl font-bold ">
                                    Explore
                                </span>
                            </NavLink>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-8',
                                        isActive
                                            ? 'text-secondary'
                                            : 'text-white'
                                    )
                                }
                                to="/nofitication"
                            >
                                <BellIcon className="w-14 h-14" />
                                <span className="text-xl font-bold ">
                                    Notification
                                </span>
                            </NavLink>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-8',
                                        isActive
                                            ? 'text-secondary'
                                            : 'text-white'
                                    )
                                }
                                to="/profile"
                            >
                                <PersonCircleIcon className="w-14 h-14" />
                                <span className="text-xl font-bold ">
                                    Profile
                                </span>
                            </NavLink>
                        </nav>
                    </div>
                </section>
            </div>
        )
    }
}