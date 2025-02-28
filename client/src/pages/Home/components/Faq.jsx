import styled from "styled-components";

// FAQ Container with a gradient background and better spacing
const FaqContainer = styled.section`
  background: linear-gradient(135deg, #1b223c, #0d0e2b);
  color: #ffffff;
  padding: 120px 30px;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
`;

// FAQ Title with dynamic styling and glow effect
const FaqTitle = styled.h2`
  text-align: center;
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 60px;
  position: relative;
  color: #00f3ff;
  text-shadow: 0 0 10px #00f3ff, 0 0 20px #00baff;

  &:after {
    content: "";
    width: 100px;
    height: 5px;
    background: linear-gradient(90deg, #00f3ff, #00baff);
    display: block;
    margin: 20px auto;
    border-radius: 5px;
  }
`;

// FAQ List with hover effects and better spacing
const FaqList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

// FAQ Item with interactive effects
const FaqItem = styled.li`
  background: linear-gradient(145deg, #1d2648, #10152e);
  padding: 25px 35px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(0, 243, 255, 0.6);
  }
`;

// FAQ Question with an icon and hover animation
const FaqQuestion = styled.h4`
  font-size: 24px;
  font-weight: 600;
  color: #00f3ff;
  margin-bottom: 15px;
  display: flex;
  align-items: center;

  &:before {
    content: "✨";
    margin-right: 10px;
    font-size: 28px;
    color: #ffffff;
    transition: transform 0.3s ease;
  }

  ${FaqItem}:hover & {
    &:before {
      transform: rotate(360deg);
    }
  }
`;

// FAQ Answer with smooth transition visibility
const FaqAnswer = styled.p`
  font-size: 18px;
  color: #cbd3e0;
  line-height: 1.8;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

// Toggle visibility for FAQ answers
const Faq = () => {
  const faqData = [
    {
      question: "Is my data secure?",
      answer:
        "Absolutely! We employ advanced encryption and update our security protocols to keep your data safe.",
    },
    {
      question: "How much does the app cost?",
      answer:
        "Our app is completely free right now, with plans for premium features in the future.",
    },
    {
      question: "What kind of support is available?",
      answer:
        "Our team is available 24/7 via live chat, email, and phone for all your queries.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel anytime with no hidden fees or long-term commitments.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "We offer a 14-day trial with access to all premium features to help you evaluate the app.",
    },
    {
      question: "Is the app compatible with mobile devices?",
      answer:
        "Yes! Our app works perfectly on smartphones and tablets, with native apps for iOS and Android.",
    },
  ];

  const toggleAnswer = (index) => {
    const answer = document.querySelectorAll(".faq-answer")[index];
    const currentHeight = answer.style.maxHeight;

    answer.style.maxHeight = currentHeight ? null : `${answer.scrollHeight}px`;
  };

  return (
    <FaqContainer>
      <div id="faq">
        <FaqTitle>Frequently Asked Questions</FaqTitle>
      </div>
      <FaqList>
        {faqData.map((faq, index) => (
          <FaqItem key={index} onClick={() => toggleAnswer(index)}>
            <FaqQuestion>{faq.question}</FaqQuestion>
            <FaqAnswer className="faq-answer">{faq.answer}</FaqAnswer>
          </FaqItem>
        ))}
      </FaqList>
    </FaqContainer>
  );
};

export default Faq;
