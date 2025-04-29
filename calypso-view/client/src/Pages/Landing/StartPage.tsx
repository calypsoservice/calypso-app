import React, { useEffect, useState } from "react"
import "./startpage.css"
import ArrowRightBottom from './arrow-bottom-right.png'
import ArrowRightBottomBordered from './arrow-bottom-right-bordered.png'
// import { useHorizontalScroll } from "../../Hooks/useHorizontalScroll"
import PageLoader from "../PageLoader/PageLoader"
import cn from 'classnames'
import { Link, useLocation } from "react-router-dom"
import { handleClickScroll } from "../../Hooks/helpers"
import { LogoComponent } from "../../Components/LogoComponent"
import Logoimage from '../../assets/images/logo-big2.png'
import Certificate from '../../assets/certificate.pdf'
import TermsOfUse from '../../assets/Calypso Website Terms and Conditions.pdf'
import ServicePolicy from '../../assets/Service Policy New.pdf'
import USDTIcon from '../../assets/images/svg/crypto-icons/usdt.svg'
import BTCIcon from '../../assets/images/svg/crypto-icons/btc.svg'
import ETHIcon from '../../assets/images/svg/crypto-icons/eth.svg'
import TRXIcon from '../../assets/images/svg/crypto-icons/trx.svg'
import TONIcon from '../../assets/images/svg/ton.svg'


function onEntry(entry: { isIntersecting: any; target: { classList: { add: (arg0: string) => void } } }[]) {
    entry.forEach((change: { isIntersecting: any; target: { classList: { add: (arg0: string) => void } } }) => {
        if (change.isIntersecting) {
            change.target.classList.add('element-show');
        }
    });
}

export const StartPage = () => {

    const [upButtonVisible, setUpButtonVisible] = useState<boolean>(false)
    const [options] = useState({ threshold: [0.1] });
    const [observer] = useState(new IntersectionObserver(onEntry, options));
    const [elems, setElems] = useState<NodeListOf<Element>>()

    const stickNavbar = () => {
        if (window !== undefined) {
            let windowHeight = window.scrollY;
            // window height changed for the demo
            windowHeight < 245
                ? setUpButtonVisible(false)
                : setUpButtonVisible(true);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", stickNavbar);
        return () => window.removeEventListener("scroll", stickNavbar);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await new Promise((r) => setTimeout(r, 2000));
            if (elems) {
                for (let elm of elems) {
                    observer.unobserve(elm)
                }
            }
            var newElems = document.querySelectorAll('.smooth-animated-block');
            for (let elm of newElems) {
                observer.observe(elm)
            }
            setElems(newElems);
        };
        loadData();
    }, []);

    return (
        <React.Fragment>
            <PageLoader />
            <div className="flex flex-col justify-center items-center overflow-x-hidden startpage-wrapper">
                <Header />
                <TopSection />
                <AboutSection />
                <MissionSection />
                <HowToStartSection />
                <AdvantagesSection />
                <ReferralSection />
                <InvestmentsSection />
                <AnotherSection />
                <TariffsSection />
                <RoadMapSection />
                <AvailableCurrencySection />
                <PartnersSection />
                <Footer />
                <button className="goup-btn" style={{ display: upButtonVisible ? "block" : "none" }} onClick={() => handleClickScroll("top-section")}>
                    <i className="ri-arrow-up-line" />
                </button>
            </div>
        </React.Fragment>
    )
}


const Header = () => {

    // sticky nav bar
    const [stickyClass, setStickyClass] = useState({
        fixed: "",
        header: "",
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

    const stickNavbar = () => {
        if (window !== undefined) {
            let windowHeight = window.scrollY;
            // window height changed for the demo
            windowHeight < 245
                ? setStickyClass({ fixed: "", header: "" })
                : setStickyClass({ fixed: "active-height", header: "sticky-menu" });
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", stickNavbar);
        return () => window.removeEventListener("scroll", stickNavbar);
    }, []);

    const { hash } = useLocation();


    return (
        <header>
            {/* <div className={cn(stickyClass.fixed)} /> */}
            <div className={cn("menu-area", stickyClass.header)}>
                <div className="custom-container">
                    <div className="row">
                        <div className={`col-12${mobileMenuOpen ? " mobile-menu-visible" : ""}`}>
                            <div className="mobile-nav-toggler" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <i className="ri-bar-chart-horizontal-line" />
                            </div>
                            <div className="menu-wrap">
                                <nav className={"menu-nav"}>
                                    <LogoComponent />
                                    {/* <div className="logo">
                                        <Link to={"/"}>
                                            <img src={logoImage} alt="BigTech Logo" className="d-md-block d-none" />
                                            <img src={logoImageSmall} alt="BigTech Logo" className="d-block d-md-none" />
                                        </Link>
                                    </div> */}

                                    <div className={cn("navbar-wrap main-menu d-none d-lg-flex")}>
                                        <ul className={"navigation"}>
                                            <li
                                                className={cn(hash == "#about-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#about-section"
                                                    className={"section-link"}
                                                    onClick={() => handleClickScroll("about-section")}
                                                >
                                                    About
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#howtostart-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#howtostart-section"
                                                    className={"section-link"}
                                                    onClick={() => handleClickScroll("howtostart-section")}
                                                >
                                                    How to start
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#referral-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#referral-section"
                                                    className={"section-link"}
                                                    onClick={() => handleClickScroll("referral-section")}
                                                >
                                                    Referrals
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#another-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#another-section"
                                                    className={"section-link"}
                                                    onClick={() => handleClickScroll("another-section")}
                                                >
                                                    Investment tariffs
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#tariffs-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#tariffs-section"
                                                    className={"section-link"}
                                                    onClick={() => handleClickScroll("tariffs-section")}
                                                >
                                                    Tariffs
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#roadmap-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#roadmap-section"
                                                    className={"section-link"}
                                                    onClick={() => handleClickScroll("roadmap-section")}
                                                >
                                                    Roadmap
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#available-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#available-section"
                                                    className={"section-link"}
                                                    onClick={() => handleClickScroll("available-section")}
                                                >
                                                    Available
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <Link
                                            to={sessionStorage.getItem("auth-token") !== null ? "/dashboard" : "/login"}
                                            className="px-8 py-4 button header-btn"
                                        >{sessionStorage.getItem("auth-token") !== null ? "Dashboard" : "Login"}</Link>
                                    </div>
                                </nav>
                            </div>
                            <div className={"mobile-menu"}>
                                <nav className={"menu-box"}>
                                    <div className={"close-btn"} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                        <i className="ri-close-line"></i>
                                    </div>
                                    <LogoComponent />

                                    <div className={"menu-outer"}>
                                        <ul className={"navigation"}>
                                            <li
                                                className={cn(hash == "#about-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#about-section"
                                                    className={"section-link"}
                                                    onClick={() => { setMobileMenuOpen(!mobileMenuOpen); handleClickScroll("about-section") }}
                                                >
                                                    About
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#howtostart-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#howtostart-section"
                                                    className={"section-link"}
                                                    onClick={() => { setMobileMenuOpen(!mobileMenuOpen); handleClickScroll("howtostart-section") }}
                                                >
                                                    How to start
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#referral-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#referral-section"
                                                    className={"section-link"}
                                                    onClick={() => { setMobileMenuOpen(!mobileMenuOpen); handleClickScroll("referral-section") }}
                                                >
                                                    Referrals
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#another-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#another-section"
                                                    className={"section-link"}
                                                    onClick={() => { setMobileMenuOpen(!mobileMenuOpen); handleClickScroll("another-section") }}
                                                >
                                                    Investment tariffs
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#tariffs-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#tariffs-section"
                                                    className={"section-link"}
                                                    onClick={() => { setMobileMenuOpen(!mobileMenuOpen); handleClickScroll("tariffs-section") }}
                                                >
                                                    Tariffs
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#roadmap-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#roadmap-section"
                                                    className={"section-link"}
                                                    onClick={() => { setMobileMenuOpen(!mobileMenuOpen); handleClickScroll("roadmap-section") }}
                                                >
                                                    Roadmap
                                                </Link>
                                            </li>
                                            <li
                                                className={cn(hash == "#available-section" || hash == '')}
                                            >
                                                <Link
                                                    to="#available-section"
                                                    className={"section-link"}
                                                    onClick={() => { setMobileMenuOpen(!mobileMenuOpen); handleClickScroll("available-section") }}
                                                >
                                                    Available
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* <div className={"social-links"}>
                                        <ul className="clearfix">
                                            <li>
                                                <a href="https://t.me/hyperliquid_support">
                                                    <i className="fa-telegram fab"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="mailto:support@hyperliquidpool.xyz">
                                                    <i className="fa fa-envelope"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div> */}
                                </nav>
                            </div>

                            <div className={"menu-backdrop"} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

const Footer = () => {
    return (
        <footer className="relative pt-12 pb-20">
            <div className="container">
                <div className="row">
                    <div className="mt-6 w-full">
                        <div>
                            <LogoComponent />
                        </div>
                        <div className="w-full row">
                            <div className="col-lg-6">
                                <div className="mt-6 footer-title">
                                    <p className="mb-4">Premium Service</p>
                                    <div className="crypto-list">
                                        <div>
                                            <img src={BTCIcon} alt="Bitcoin" />
                                        </div>
                                        <div>
                                            <img src={ETHIcon} alt="Ethereum" />
                                        </div>
                                        <div>
                                            <img src={USDTIcon} alt="Tether" />
                                        </div>
                                        <div>
                                            <img src={TONIcon} alt="Toncoin" />
                                        </div>
                                        <div>
                                            <img src={TRXIcon} alt="Tron" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex lg:justify-end col-lg-6">
                                <div className="gap-4 grid links-grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 mt-6 lg:text-center">
                                    <a target="_blank" href={Certificate}>Certificate</a>
                                    <a target="_blank" href={TermsOfUse}>Terms Of Use</a>
                                    <a target="_blank" href={ServicePolicy}>Service Policy</a>
                                    {/* <Link to={"/certificate/"}>Certificate</Link> */}
                                    {/* <Link to={"/terms-of-use/"}>Terms Of Use</Link>
                                    <Link to={"/service-polisy/"}>Service Policy</Link> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="items-center mt-12 text-center sm:text-start row">
                    <div className="col-sm-6">
                        <div>
                            <p>
                                2024 © Calypso
                            </p>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="mt-4 sm:mt-0 sm:text-end">
                            <ul className="mb-0 pl-0 list-none">
                                {/* <li className="inline-block mr-2">
                                    <a href="" className="block w-8 h-8">
                                        <div className="rounded-full avatar-title">
                                            <i className="ri-facebook-fill"></i>
                                        </div>
                                    </a>
                                </li> */}
                                {/* <li className="inline-block mr-2">
                                    <a href="" className="block w-8 h-8">
                                        <div className="rounded-full avatar-title">
                                            <i className="ri-github-fill"></i>
                                        </div>
                                    </a>
                                </li> */}
                                {/* <li className="inline-block mr-2">
                                    <a href="" className="block w-8 h-8">
                                        <div className="rounded-full avatar-title">
                                            <i className="ri-linkedin-fill"></i>
                                        </div>
                                    </a>
                                </li> */}
                                <li className="inline-block mr-2">
                                    <a href="mailto:support@calypso.icu" target="_blank" className="block w-8 h-8">
                                        <div className="rounded-full avatar-title">
                                            <i className="ri-google-fill"></i>
                                        </div>
                                    </a>
                                </li>
                                <li className="inline-block mr-2">
                                    <a href="https://t.me/CalypsoFund" target="_blank" className="block w-8 h-8">
                                        <div className="rounded-full avatar-title">
                                            <i className="ri-telegram-fill"></i>
                                        </div>
                                    </a>
                                </li>
                                {/* <li className="inline-block">
                                    <a href="" className="block w-8 h-8">
                                        <div className="rounded-full avatar-title">
                                            <i className="ri-dribbble-line"></i>
                                        </div>
                                    </a>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

const TopSection = () => {
    return (
        <section className="top-section mb-20 pt-20" id="top-section">
            <div className="top-section-wrapper container">
                <div className="top-section-circles flex-col-reverse grid grid-cols-1 sm:grid-cols-2">
                    <div className="circle"></div>
                    <div className="circle img"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
                <div className="top-section-title">
                    {/* <h1>Calypso</h1> */}
                    <img src={Logoimage} alt="" width={300} />
                    <h4>Leading company in the field of crypto investment</h4>
                </div>
            </div>
        </section>
    )
}

const AboutSection = () => {
    return (
        <section className="mb-20 pt-20 about-section" id="about-section">
            <div className="about-section-wrapper container">
                <div className="mb-4 about-section-title">
                    <h1>About Company</h1>
                    <div className="arrows-borrom-right">
                        {/* <div className="arrow-bottom-tight-bold"></div> */}
                        <img src={ArrowRightBottom} alt="" />
                        <img src={ArrowRightBottomBordered} alt="" />
                    </div>
                </div>
                <div className="justify-around gap-4 min-w-full row">
                    <div className="gap-2 md:pr-0 col-md-5 row">
                        <div className="about-block w-full smooth-animated-block bgwhite">
                            <p className="text">
                                <b>Calypso is an advanced investment company</b>&#32;founded in 2021 by a group of experienced
                                investors and technology enthusiasts who
                                recognized the potential of cryptocurrencies
                                in shaping a new financial landscape.
                            </p>
                        </div>
                        <div className="about-block w-[48%] smooth-animated-block bggreen">
                            <p className="text">
                                <b>The company has quickly gained trust</b>&#32;due to its
                                insightful and
                                balanced
                                investment
                                strategies, which
                                combine active
                                trading with
                                long-term
                                investments.
                            </p>
                        </div>
                        <div className="about-block w-[48%] smooth-animated-block bgwhite">
                            <p className="text">
                                <b>Calypso" continues to grow,</b>&#32;and with each
                                new success, it
                                confirms that sound
                                investments are not
                                just a matter of luck,
                                but the result of
                                thorough analysis,
                                knowledge, and
                                the transfer
                                of experience.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-7 md:row gap-2 md:pl-0 h-fit md:h-auto">
                        <div className="about-block mdmx-15 mb-2 md:mb-0 md:w-[58%] smooth-animated-block brgreen">
                            <p className="mb-2 text">
                                <b>The founders of "Calypso" are confident</b>&#32;that investing in
                                cryptocurrencies requires not
                                only knowledge of the market but
                                also a deep understanding of the
                                psychology of participants, which
                                forms the basis of the
                                "Smart Money" concept.
                            </p>
                            <p className="text">
                                <b>We use a unique approach:</b>&#32;leveraging
                                algorithms based on artificial
                                intelligence and machine learning
                                to analyze market trends, combined
                                with studying the trading decisions
                                of market whales—monitoring
                                the behavior of major players
                                in the market.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 md:w-[38%] h-full">
                            <div className="about-block mdmx-15 smooth-animated-block bggreen">
                                <p className="text">
                                    <b>Investors from all
                                        corners of the world
                                        are already turning
                                        to Calypso </b>&#32;
                                    with hope
                                    and confidence in
                                    their financial future,
                                    believing that with us,
                                    their money is
                                    protected by smart
                                    decisions.
                                </p>
                            </div>
                            <div className="about-block smooth-animated-block img">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const MissionSection = () => {
    return (
        <section className="mb-20 pt-20 mission-section" id="mission-section">
            <div className="pb-16 container mission-section-wrapper">
                <div className="mb-24 mission-section-title">
                    <h1>Company's mission</h1>
                </div>
                <div className="mission-block-row md:flex-row flex-col">
                    <div className="mission-block-col-row sm:flex-row flex-col mb-24 md:mb-0">
                        <div className="mission-block mb-24 sm:mb-0 pt-24 w-full sm:w-2/5 smooth-animated-block first">
                            <div className="absolute">
                                <div className="img"></div>
                            </div>
                            <div>
                                <p className="text">
                                    <b>Calypso's mission</b>&#32;
                                    is to be the world's
                                    leading company
                                    in providing
                                    individuals with
                                    the opportunity
                                    to invest safely
                                    and easily.
                                </p>
                            </div>
                        </div>
                        <div className="mission-block pt-24 w-full sm:w-3/5 smooth-animated-block second">
                            <div className="absolute">
                                <div className="img"></div>
                            </div>
                            <div>
                                <p className="text">
                                    <b>The fundamental belief that the company follows</b>&#32;
                                    follows is that its
                                    investors are informed investors.
                                    That is why Calypso implements
                                    educational programs, trainings
                                    and webinars to inspire its clients
                                    to take confident steps into the
                                    world of investing.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mission-block-col-row sm:flex-row flex-col">
                        <div className="mission-block mb-24 sm:mb-0 pt-24 w-full sm:w-1/2 smooth-animated-block dark third">
                            <div className="absolute">
                                <div className="img"></div>
                            </div>
                            <div>
                                <p className="text">
                                    <b>We believe</b>&#32;
                                    investments
                                    should be accessible and
                                    understandable to everyone,
                                    not just a select few.
                                </p>
                                <p className="text">
                                    <b>Our goal is</b>&#32;
                                    is to push the
                                    boundaries of financial
                                    literacy, to make the world
                                    of investments transparent
                                    and safe.
                                </p>
                            </div>
                        </div>
                        <div className="mission-block pt-24 w-full sm:w-1/2 smooth-animated-block fourth">
                            <div className="absolute">
                                <div className="img"></div>
                            </div>
                            <div>
                                <p className="text">
                                    <b>Together we are creating</b>&#32;
                                    a community of conscious
                                    investors for whom every
                                    market is not only an
                                    opportunity, but also a new
                                    adventure. The path to
                                    financial freedom starts here,
                                    and we are happy to walk
                                    it together with you!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const HowToStartSection = () => {
    return (
        <section className="mb-20 pt-20 pb-20 howtostart-section" id="howtostart-section">
            <div className="container howtostart-section-wrapper">
                <div className="howtostart-title">
                    <h1>How to start earn</h1>
                    <h3>in a few minutes</h3>
                </div>
                <div className="howtostart-body">
                    <div className="howtostart-block smooth-animated-block">
                        <div className="howtostart-block-number">
                            <h1>01</h1>
                        </div>
                        <div className="howtostart-block-text">
                            <h3>Registration</h3>
                            <p>Create a personal account to start collaborating.</p>
                        </div>
                    </div>
                    <div className="howtostart-block smooth-animated-block">
                        <div className="howtostart-block-number">
                            <h1>02</h1>
                        </div>
                        <div className="howtostart-block-text">
                            <h3>Opening a deposit</h3>
                            <p>Refill your balance and choose the investment rate that suits you.</p>
                        </div>
                    </div>
                    <div className="howtostart-block smooth-animated-block">
                        <div className="howtostart-block-number">
                            <h1>03</h1>
                        </div>
                        <div className="howtostart-block-text">
                            <h3>Making a profit</h3>
                            <p>Get daily income, profits are accrued depending on the rate you choose.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const AdvantagesSection = () => {
    return (
        <section className="mb-20 pt-20 advantages-section" id="advantages-section">
            <div className="p-4 advantages-section-wrapper container">
                <div className="advantages-section-title">
                    <h1>Advantages</h1>
                    <h3>of company</h3>
                </div>
                <div className="gap-2 advantages-section-body">
                    <div className="gap-2 advantages-section-row row">
                        <div className="smooth-animated-block advantages-section-col bgwhite col col-md-4">
                            <p>
                                <b>Large and reliable profits —</b>&#32;
                                the company's operating strategy
                                allows it to generate significant
                                income with reduced risks.
                            </p>
                        </div>
                        <div className="smooth-animated-block advantages-section-col brgreen col col-md-6">
                            <p>
                                <b>Calypso actively diversifies investments</b>&#32;
                                in a variety of assets and marketplaces, which
                                helps to reduce risk and maximize the chances
                                of maximizing returns.
                            </p>
                        </div>
                        <div className="md:block hidden w-auto smooth-animated-block advantages-section-col col col-md-2 img">
                        </div>
                    </div>
                    <div className="justify-between gap-2 md:gap-0 advantages-section-row row">
                        <div className="smooth-animated-block advantages-section-col bggreen col col-md-6">
                            <p>
                                <b>The management of the company has vast experience</b>&#32;
                                and knowledge in trading on the cryptocurrency
                                market, which has a positive impact on making
                                competent and balanced strategic decisions
                                in the development of the company.
                            </p>
                        </div>
                        <div className="smooth-animated-block advantages-section-col bgwhite col col-md-6">
                            <p>
                                <b>We believe that every investor deserves confidence in their investment,</b>&#32;
                                which is why we strive to create a sustainable ecosystem where reliability and profitability go hand in hand. With our team, you can bet on success knowing that your investment is in good hands.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const ReferralSection = () => {
    return (
        <section className="mb-20 pt-20 referral-section" id="referral-section">
            <div className="container referral-section-wrapper">
                <div className="flex-col-reverse grid grid-cols-1 sm:grid-cols-2 referal-section-cirles">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
                <div className="referral-section-title">
                    <h1>Partnership</h1>
                    <h1>Program</h1>
                    <div className="referral-section-list">
                        <ul>
                            <li>
                                <p>
                                    <b>Calypso offers a seven-level referral program for each affiliate!</b>&#32;
                                    Our affiliate program is available to any user immediately after registration and does not require opening a deposit. This means that you can start earning without investing your own funds.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <b>Each affiliate receives a unique referral link upon registration.</b>&#32;
                                    Simply send it to your friends and acquaintances so they can use it to sign up.
                                    Your growth network is a guaranteed path to additional rewards!
                                </p>
                            </li>
                            <li>
                                <p>
                                    <b>Each member of the referral system will receive rewards</b>&#32;
                                    for referred partners, and you can watch your team grow and bring you profit.
                                    Join Calypso and open new horizons of financial opportunities with us!
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

const InvestmentsSection = () => {
    return (
        <section className="mb-20 pt-20 investments-section" id="investments-section">
            <div className="container investments-section-wrapper">
                <div className="investments-section-background">
                    <div></div>
                    <div></div>
                </div>
                <div className="investments-section-title">
                    <h1>Our referral</h1>
                    <h1>system</h1>
                </div>
                <div className="flex-col gap-4 mb-4 row">
                    <div className="flex-row gap-4 investments-row row">
                        <div className="col-2 investments-circle">
                            <p>Level 1</p>
                            <p>5%</p>
                        </div>
                        <div className="col-2 investments-circle">
                            <p>Level 2</p>
                            <p>3.5%</p>
                        </div>
                        <div className="col-2 investments-circle">
                            <p>Level 3</p>
                            <p>2%</p>
                        </div>
                        <div className="col-2 investments-circle">
                            <p>Level 4</p>
                            <p>2%</p>
                        </div>
                    </div>
                    <div className="flex-row gap-4 investments-row row">
                        <div className="col-2 investments-circle">
                            <p>Level 5</p>
                            <p>1%</p>
                        </div>
                        <div className="bgblack col-2 investments-circle">
                            <p>Level 6</p>
                            <p>0.5%</p>
                        </div>
                        <div className="col-2 investments-circle">
                            <p>Level 7</p>
                            <p>0.5%</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const AnotherSection = () => {
    return (
        <section className="mb-20 pt-20 pb-20 anth-section" id="another-section">
            <div className="container howtostart-section-wrapper">
                <div className="howtostart-title">
                    <h1>Investment tariffs</h1>
                </div>
                <div className="howtostart-body">
                    <div className="howtostart-block smooth-animated-block">
                        <div className="howtostart-block-number">
                            <h1>01</h1>
                        </div>
                        <div className="howtostart-block-text">
                            <p><b>Calypso provides stable passive income to all investors, regardless of the amount of their investments.</b></p>
                            <p>Each client gets the opportunity to track their daily investment income, which allows them to control their finances in real time.</p>
                        </div>
                    </div>
                    <div className="howtostart-block smooth-animated-block">
                        <div className="howtostart-block-number">
                            <h1>02</h1>
                        </div>
                        <div className="howtostart-block-text">
                            <p><b>Immerse yourself in a world of investment opportunities</b></p>
                            <p>with Calypso and find a plan that perfectly matches your financial goals. </p>
                        </div>
                    </div>
                    <div className="howtostart-block smooth-animated-block">
                        <div className="howtostart-block-number">
                            <h1>03</h1>
                        </div>
                        <div className="howtostart-block-text">
                            <p><b>Absolutely every partner of our company can choose an investment tariff suitable for him depending on the amount and term of investment.</b></p>
                            <p>We offer 7 different
                                investment tariffs,
                                each of them specifies
                                the minimum and maximum
                                investment threshold,
                                as well as the term of
                                validity of a particular tariff.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const TariffsSection = () => {
    return (
        <section className="mb-20 pt-20 tariffs-section" id="tariffs-section">
            <div className="container tariffs-section-wrapper">
                <div className="tariffs-section-title">
                    <h1>Tariff options</h1>
                </div>
                <div className="gap-x-2 gap-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <div className="tariffs-block smooth-animated-block">
                        <h4>RAPIDE 1</h4>
                        <p>The time limit – 15 days</p>
                        <p>Profit 0.65% per day</p>
                        <p>Amount 50-499$</p>
                    </div>
                    <div className="tariffs-block smooth-animated-block">
                        <h4>RAPIDE 2</h4>
                        <p>The time limit – 25 days</p>
                        <p>Profit 0.85% per day</p>
                        <p>Amount 500-4999$</p>
                    </div>
                    <div className="tariffs-block smooth-animated-block">
                        <h4>RAPIDE 3</h4>
                        <p>The time limit – 40 days</p>
                        <p>Profit 1% per day</p>
                        <p>Amount 5000-14999$</p>
                    </div>
                    <div className="tariffs-block smooth-animated-block">
                        <h4>RAPIDE 4</h4>
                        <p>The time limit – 65 days</p>
                        <p>Profit 1.15% per day</p>
                        <p>Amount 15000-29999$</p>
                    </div>
                    <div className="tariffs-block smooth-animated-block">
                        <h4>RAPIDE 5</h4>
                        <p>The time limit – 90 days</p>
                        <p>Profit 1.3% per day</p>
                        <p>Amount 30000-50000$</p>
                    </div>
                    <div className="tariffs-block smooth-animated-block bgblack">
                        <h4>LARGO 1</h4>
                        <p>Profit 260% for the period</p>
                        <p>The time limit – 180 days</p>
                        <p>Amount 50-19999$</p>
                    </div>
                    <div className="tariffs-block smooth-animated-block bgblack">
                        <h4>LARGO 2</h4>
                        <p>Profit 570% for the period</p>
                        <p>The time limit – 360 days</p>
                        <p>Amount 20000-50000$</p>
                    </div>
                    <div className="tariffs-block md:block hidden smooth-animated-block img"></div>
                </div>
            </div>
        </section>
    )
}

const RoadMapSection = () => {

    const roadmap_items = [
        {
            roadmapTitle: "Start of Q1 2025",
            info: [
                "Started development of a mobile application for iOS and Android platforms.",
                "Creating a mobile app will allow us to offer our customers an intuitive way to interact with and maximize the use of our products.",
            ],
        },
        {
            roadmapTitle: "Start of Q2 2025",
            info: [
                "Expansion of the company worldwide.",
                "Entering the markets of Asia, South America and Oceania.",
                "The main goal is an active presencein the world's major financial centers.",
            ],
        },

        {
            roadmapTitle: "Start of Q3 2025",
            info: [
                "Release of the beta version of the mobile app.",
                "The beta version will give members the unique opportunity to be among the first to utilize the limited services offered by our app.",
            ],
        },

        {
            roadmapTitle: "Start of Q4 2025",
            info: [
                "The company enters the niche of cryptocurrency vending.",
                "Technical realization.",
                "Selection of suitable vending machines.",
                "Development of transaction management software on the vending machines.",
                "Providing integration with crypto exchanges for liquidity.",
            ],
        },
        {
            roadmapTitle: "Start of Q1 2026",
            info: [
                "Launch of the pilot program.",
                "Installation of vending machines in test locations.",
                "Collecting feedback from users to optimize services.",
                "Conducting advertising campaigns to attract customers.",
            ],
        },
        {
            roadmapTitle: "Start of Q2 2026",
            info: [
                "Evaluation and scaling.",
                "Analyzing the performance of vending machines.",
                "Implementing improvements and expanding the network of machines to new locations.",
            ],
        },
    ];

    // const scrollRef = useHorizontalScroll();

    return (
        <section className="mb-20 roadmap-area pt-20" id="roadmap-section">
            <div className="roadmap-wrapper max-w-full">
                <div className="roadmap-container-title">
                    <h1>Company roadmap</h1>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div
                            className="bt-roadmap-scrollbar bt-roadmap_x"
                        // ref={scrollRef}
                        >
                            <div className="bt-roadmap-wrap-bg"></div>
                            <div className="bt-roadmap-wrap">
                                {roadmap_items.map((x, index) => (
                                    <RoadmapItem key={index} item={x} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const RoadmapItem = (props: { item: { roadmapTitle: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; info: any[]; }; }) => {
    return (
        <div className="bt-roadmap-item">
            <span className="roadmap-title">{props.item.roadmapTitle}</span>
            <div className="roadmap-content">
                <span className="dot" />
                {props.item.info.map((x: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                    <span key={index}>-&#32;{x}</span>
                ))}
            </div>
        </div>
    );
};

const AvailableCurrencySection = () => {
    return (
        <section className="mb-20 pt-20 available-section" id="available-section">
            <div className="available-section-wrapper container">
                <div className="available-section-title">
                    <h1>Available currencies for investment</h1>
                </div>
                <div className="available-section-body">
                    <p>
                        Calypso offers investors the opportunity to use four currencies for investments:
                        BTC, ETH, USDT, TRX and TON. In the future, we plan to expand this list by adding
                        new currencies for even greater convenience of our clients.
                    </p>
                    <h4>
                        We believe that flexibility and investor comfort are important
                        factors in the successful development of a company.
                    </h4>
                </div>
            </div>
        </section>
    )
}

const PartnersSection = () => {
    return (
        <section className="mb-20 pt-20 partners-section" id="partners-section">
            <div className="container partners-section-wrapper">
                <div className="partners-section-title">
                    <h1>Partner communication
                        with the company</h1>
                </div>
                <div className="partners-section-body">
                    <div className="partners-section-body-col">
                        <div className="partners-section-block smooth-animated-block bgwhite">
                            <p>
                                <b>
                                    Absolutely every partner of the company can contact Calypso
                                </b>&#32;
                                representatives and get competent answers to their questions, as well
                                as assistance in case of difficulties. Ease of communication between
                                partners and the company is an important component of our philosophy,
                                which we actively broadcast.
                            </p>
                        </div>
                        <div className="partners-section-block smooth-animated-block img"></div>
                        <div className="partners-section-block smooth-animated-block bggreen">
                            <p>
                                <b>
                                    Our Partner Communications department
                                    is open from 9:00 to 17:00 (GMT+1)
                                </b>&#32;
                                to ensure
                                maximum support and responsiveness to your
                                inquiries and promptness in resolving your
                                queries. We value your feedback and strive
                                to make your interaction with us as
                                comfortable and productive as possible.
                            </p>
                        </div>
                    </div>
                    <div className="partners-section-body-col">
                        <div className="partners-section-block smooth-animated-block brgreen">
                            <p>Take advantage of our support
                                and feel free to contact
                                with any questions </p>
                            <h3>we are here
                                to help you on
                                your investment
                                journey!</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
