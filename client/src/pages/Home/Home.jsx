import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { KeyboardArrowUp } from "@mui/icons-material";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Benefits from "./components/Benifits";
import About from "./components/About";
import SignUp from "../../components/SignUp";
import SignIn from "../../components/SignIn";
import Faq from "./components/Faq";
import { jwtDecode } from "jwt-decode";
import "../../App.css";

// Theme Toggle Button
const ThemeToggle = styled.button`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
  background-color: ${({ isLightMode }) =>
    isLightMode ? "#ffd700" : "#001f3d"}; /* Sun and Moon background */
  color: white; /* Icon color */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;

  &:hover {
    transform: scale(1.1);
  }

  .icon {
    transition: transform 0.5s ease-in-out;
  }

  .rotate-left {
    animation: rotate-left 0.5s ease-in-out;
  }

  .rotate-right {
    animation: rotate-right 0.5s ease-in-out;
  }

  @keyframes rotate-left {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  @keyframes rotate-right {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Scroll To Top Button
const ScrollToTop = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  height: 50px;
  width: 50px;
  background: #0288d1;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  opacity: ${({ show }) => (show ? "1" : "0")};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  transform: translateY(${({ show }) => (show ? "0" : "20px")});
  transition: all 0.3s ease-in-out;
  z-index: 999;

  &:hover {
    background: #01579b;
    transform: translateY(-5px);
  }
`;

// Styled Components for Layout
const Body = styled.div`
  background: ${({ isLightMode }) => (isLightMode ? "white" : "#001f3d")};
  color: ${({ isLightMode }) => (isLightMode ? "blue" : "white")};
  display: flex;
  justify-content: center;
  overflow-x: hidden;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(38.73deg, rgba(0, 123, 255, 0.15) 0%, rgba(0, 123, 255, 0) 50%);
`;

const Content = styled.div`
  width: 100%;
  background: ${({ isLightMode }) => (isLightMode ? "white" : "#001f3d")};
  color: ${({ isLightMode }) => (isLightMode ? "blue" : "white")};
  display: flex;
  flex-direction: column;
  margin-top: "25px"
`;

const Home = () => {
  const [SignInOpen, setSignInOpen] = useState(false);
  const [SignUpOpen, setSignUpOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [rotateDirection, setRotateDirection] = useState("rotate-left");

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.clear();
        window.location.href = "/";
      }
    } else {
      localStorage.clear();
    }
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode);

    // Toggle rotation direction
    setRotateDirection((prev) =>
      prev === "rotate-left" ? "rotate-right" : "rotate-left"
    );
  };

  return (
    <>
      <Navbar setSignInOpen={setSignInOpen} />
      <Body isLightMode={isLightMode}>
        <Container isLightMode={isLightMode}>
          <Top id="home">
            <div style={{ paddingBottom: '115px'}}>
              <Hero setSignInOpen={setSignInOpen} />
            </div>
          </Top>
          <Content isLightMode={isLightMode}>
            <Features />
            <Benefits />
            <Testimonials />
            <Faq />
            <About />
            <Footer />
          </Content>
          <ThemeToggle onClick={toggleTheme}>
            <img
              className={`icon ${rotateDirection}`}
              width="40"
              height="40"
              src={
                isLightMode
                  ? "https://img.icons8.com/ios-filled/50/summer.png"
                  : "https://img.icons8.com/pastel-glyph/64/moon-satellite.png"
              }
              alt={isLightMode ? "sun" : "moon"}
              style={{
                filter: isLightMode
                  ? "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"
                  : "invert(24%) sepia(98%) saturate(2119%) hue-rotate(205deg) brightness(85%) contrast(85%)",
                cursor: "pointer",
              }}
            />
          </ThemeToggle>
          {SignUpOpen && <SignUp setSignUpOpen={setSignUpOpen} setSignInOpen={setSignInOpen} />}
          {SignInOpen && <SignIn setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />}
          <ScrollToTop show={showScroll} onClick={scrollToTop}>
            <KeyboardArrowUp style={{ color: "white", fontSize: "28px" }} />
          </ScrollToTop>
        </Container>
      </Body>
    </>
  );
};

export default Home;
